/**
 * DAYFLOW HRMS — Authentication Module
 *
 * All authentication and role-resolution logic lives here.
 * index.html imports this module and calls these functions.
 *
 * Role routing:
 *   employee → Employee dashboard  (page: p-emp-dash)
 *   hr       → HR dashboard        (page: p-hr-dash)
 *   admin    → HR/Admin dashboard  (page: p-hr-dash)
 *
 * Security principles:
 *   - Roles are resolved from the database (user_roles table via RLS)
 *     after login — never from a button click or localStorage value.
 *   - Session persistence uses Supabase's built-in token storage.
 *   - Protected pages are hidden unless a valid session exists.
 */

import { supabase } from './supabase.js'

// ---------------------------------------------------------------------------
// DEV LOGGING
// Logs real Supabase error details to the browser console in development.
// Never logs passwords, tokens, or secret keys.
// Safe to leave in production — no sensitive data is logged.
// ---------------------------------------------------------------------------
function devLogError(context, error) {
  if (!error) return
  console.error(`[DAYFLOW:${context}]`, {
    message: error.message,
    code:    error.code,
    status:  error.status,
    // Explicitly exclude: password, access_token, refresh_token, service_role
  })
}

function devLogRpcError(context, error, data) {
  if (!error) return
  console.error(`[DAYFLOW:${context}] RPC error`, {
    message: error.message,
    code:    error.code,
    hint:    error.hint,
    details: error.details,
  })
  if (data !== undefined) console.info(`[DAYFLOW:${context}] RPC data:`, data)
}

// ---------------------------------------------------------------------------
// ERROR MESSAGES
// Maps Supabase/auth/DB error substrings to friendly user-facing strings.
// The mapper is ordered from most-specific to least-specific.
// Never expose raw SQL or database errors to the user.
// ---------------------------------------------------------------------------
const AUTH_ERROR_MAP = [
  ['Invalid login credentials',                   'Incorrect email or password. Please try again.'],
  ['Email not confirmed',                          'Please verify your email before signing in. Check your inbox for the confirmation link.'],
  ['User already registered',                      'An account with this email already exists. Please sign in instead.'],
  ['already been registered',                      'An account with this email already exists. Please sign in instead.'],
  ['Password should be at least',                  'Password must be at least 8 characters.'],
  ['Signup requires a valid password',             'Please enter a valid password.'],
  ['Unable to validate email address',             'Please enter a valid email address.'],
  ['invalid format',                               'Please enter a valid email address.'],
  ['Network request failed',                       'Network error. Please check your connection and try again.'],
  ['Failed to fetch',                              'Network error. Please check your connection and try again.'],
  ['JWT expired',                                  'Your session has expired. Please sign in again.'],
  ['invalid claim',                                'Session error. Please sign in again.'],
]

const DB_ERROR_MAP = [
  ['already registered',                           'This Employee ID is already registered. Please use your assigned Employee ID.'],
  ['employee_code',                                'This Employee ID is already registered. Please use your assigned Employee ID.'],
  ['unique_violation',                             'This Employee ID is already registered. Please use your assigned Employee ID.'],
  ['duplicate key',                                'This Employee ID is already registered. Please use your assigned Employee ID.'],
  ['Not authenticated',                            'Session error. Please refresh and try again.'],
  ['Profile creation failed',                      'Unable to create your employee profile. Please try again.'],
  ['cannot be empty',                              'Employee ID cannot be empty.'],
]

function friendlyAuthError(error) {
  if (!error) return null
  const msg = error.message || ''
  for (const [key, friendly] of AUTH_ERROR_MAP) {
    if (msg.includes(key)) return friendly
  }
  return 'Something went wrong. Please try again.'
}

function friendlyDbError(error) {
  if (!error) return null
  const msg = (error.message || '') + ' ' + (error.details || '') + ' ' + (error.hint || '')
  for (const [key, friendly] of DB_ERROR_MAP) {
    if (msg.toLowerCase().includes(key.toLowerCase())) return friendly
  }
  return 'Unable to create your employee profile. Please try again.'
}

// ---------------------------------------------------------------------------
// getRole(userId)
// Queries user_roles for the highest-privilege role of the given user.
// Returns: 'admin' | 'hr' | 'employee' | null
// ---------------------------------------------------------------------------
export async function getRole(userId) {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)

  if (error || !data || data.length === 0) return null

  // Priority: admin > hr > employee
  const roles = data.map(r => r.role)
  if (roles.includes('admin')) return 'admin'
  if (roles.includes('hr')) return 'hr'
  if (roles.includes('employee')) return 'employee'
  return null
}

// ---------------------------------------------------------------------------
// getPageForRole(role)
// Returns the radio input ID to activate for the resolved role.
// ---------------------------------------------------------------------------
export function getPageForRole(role) {
  if (role === 'hr' || role === 'admin') return 'p-hr-dash'
  return 'p-emp-dash'
}

// ---------------------------------------------------------------------------
// signIn({ email, password })
// Returns: { session, role, error }
// ---------------------------------------------------------------------------
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  })

  if (error) {
    devLogError('signIn', error)
    return { session: null, role: null, error: friendlyAuthError(error) }
  }

  // Complete any pending profile creation from signup
  // (handles the email-confirm flow: profile stored → created on first login)
  await completePendingProfile(data.session)

  const role = await getRole(data.user.id)

  if (!role) {
    // Authenticated but no role assigned — sign them out, show error
    await supabase.auth.signOut()
    return {
      session: null,
      role: null,
      error: 'Your account has not been assigned a role. Please contact HR.',
    }
  }

  return { session: data.session, role, error: null }
}

// ---------------------------------------------------------------------------
// signUp({ employeeCode, email, password, fullName })
//
// Flow:
//   1. supabase.auth.signUp() — creates auth.users row
//   2. If email confirmation is disabled (dev), a session is returned
//      immediately and we call create_employee_profile() RPC to create
//      the profiles row and user_roles(employee) row atomically.
//   3. If email confirmation is required, the session is null. We store
//      the pending profile data in a short-lived sessionStorage entry
//      so create_employee_profile() can be called after the user
//      verifies and signs in for the first time.
//
// Security:
//   - Role is always 'employee' — hardcoded in the DB function.
//   - id in profiles is always auth.uid() — set server-side.
//   - employee_code uniqueness is enforced by a UNIQUE constraint.
//   - HR/Admin roles can never be self-assigned through this path.
//
// Returns: { needsEmailVerification, error }
// ---------------------------------------------------------------------------
export async function signUp({ employeeCode, email, password, fullName }) {
  // Client-side pre-validation (DB constraints enforce server-side too)
  if (!email || !email.includes('@')) {
    return { error: 'Please enter a valid email address.' }
  }
  if (!password || password.length < 8) {
    return { error: 'Password must be at least 8 characters.' }
  }
  if (!employeeCode || employeeCode.trim() === '') {
    return { error: 'Employee ID is required.' }
  }
  if (!fullName || fullName.trim() === '') {
    return { error: 'Full name is required.' }
  }

  const normalEmail = email.trim().toLowerCase()
  const normalCode  = employeeCode.trim().toUpperCase()

  // Step 1 — create the auth.users row
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: normalEmail,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: {
        full_name:     fullName.trim(),
        employee_code: normalCode,
      },
    },
  })

  if (authError) {
    devLogError('signUp:auth', authError)
    return { error: friendlyAuthError(authError) }
  }

  // Supabase returns identities[] as empty when the email already exists
  // but confirmation is pending — surface this as a clear message.
  if (authData.user && authData.user.identities && authData.user.identities.length === 0) {
    return { error: 'An account with this email already exists. Please sign in instead.' }
  }

  // Step 2 — create profile + employee role via SECURITY DEFINER RPC
  // If a session was returned (email confirmation off), we can call it now.
  // If no session yet (email confirmation on), store pending data and
  // call the RPC after the user verifies and signs in (handled in signIn).
  if (authData.session) {
    // Session available immediately (email confirm disabled in dev)
    const profileResult = await createEmployeeProfile({
      employeeCode: normalCode,
      fullName:     fullName.trim(),
      email:        normalEmail,
    })
    if (profileResult.error) {
      // Profile creation failed — return the specific error
      // Auth user was created; they can retry profile creation on next sign-in
      devLogRpcError('signUp:profile', profileResult.rawError)
      return { error: profileResult.error, needsEmailVerification: false }
    }
    return { error: null, needsEmailVerification: false }
  } else {
    // Email confirmation required — store pending profile data
    // so we can complete profile creation after verification + first login
    try {
      sessionStorage.setItem('dayflow_pending_profile', JSON.stringify({
        employeeCode: normalCode,
        fullName:     fullName.trim(),
        email:        normalEmail,
      }))
    } catch (_) {
      // sessionStorage unavailable — profile will be created on first sign-in
      // if the user retries with the same credentials
    }
    return { error: null, needsEmailVerification: true }
  }
}

// ---------------------------------------------------------------------------
// createEmployeeProfile({ employeeCode, fullName, email })
// Calls the SECURITY DEFINER RPC to create the profiles row and
// user_roles(employee) row atomically.
// Must be called with an active authenticated session.
// Returns: { error, rawError }
// ---------------------------------------------------------------------------
export async function createEmployeeProfile({ employeeCode, fullName, email }) {
  const { data, error } = await supabase.rpc('create_employee_profile', {
    _employee_code: employeeCode.trim().toUpperCase(),
    _full_name:     fullName.trim(),
    _email:         email.trim().toLowerCase(),
  })

  if (error) {
    devLogRpcError('createEmployeeProfile', error, data)
    return { error: friendlyDbError(error), rawError: error }
  }

  return { error: null, data }
}

// ---------------------------------------------------------------------------
// completePendingProfile()
// Called after a user signs in for the first time post-email-verification.
// Checks for a pending profile stored during signup and creates it.
// Safe to call on every sign-in — no-ops if no pending data or already done.
// ---------------------------------------------------------------------------
export async function completePendingProfile(session) {
  if (!session) return

  // Check if profile already exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', session.user.id)
    .maybeSingle()

  if (existing) return // Already has a profile

  // Check for pending data stored during signup
  let pending = null
  try {
    const raw = sessionStorage.getItem('dayflow_pending_profile')
    if (raw) pending = JSON.parse(raw)
  } catch (_) { /* ignore */ }

  // Fallback: use auth metadata if no sessionStorage data
  if (!pending) {
    const meta = session.user.user_metadata || {}
    if (meta.employee_code && meta.full_name) {
      pending = {
        employeeCode: meta.employee_code,
        fullName:     meta.full_name,
        email:        session.user.email,
      }
    }
  }

  if (!pending) return // No data to create profile from

  await createEmployeeProfile(pending)

  // Clean up
  try { sessionStorage.removeItem('dayflow_pending_profile') } catch (_) { /* ignore */ }
}

// ---------------------------------------------------------------------------
// signOut()
// Signs out and clears all session state.
// ---------------------------------------------------------------------------
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    devLogError('signOut', error)
  }
  // Session cleared from localStorage by Supabase client automatically
  try { sessionStorage.removeItem('dayflow_pending_profile') } catch (_) { /* ignore */ }
}

// ---------------------------------------------------------------------------
// getSession()
// Returns the current active session, or null if not authenticated.
// ---------------------------------------------------------------------------
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// ---------------------------------------------------------------------------
// getCurrentUser()
// Returns { user, role } for the active session, or null.
// ---------------------------------------------------------------------------
export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null
  const role = await getRole(session.user.id)
  return { user: session.user, role }
}

// ---------------------------------------------------------------------------
// onAuthStateChange(callback)
// Subscribes to auth state changes (sign-in, sign-out, token refresh).
// callback receives: (event, session)
// Returns an unsubscribe function.
// ---------------------------------------------------------------------------
export function onAuthStateChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
  return () => subscription.unsubscribe()
}

// ---------------------------------------------------------------------------
// getUserProfile(userId)
// Fetches the authenticated user's own profile row.
// RLS ensures only their own row is returned.
// ---------------------------------------------------------------------------
export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      employee_code,
      full_name,
      email,
      job_title,
      status,
      date_of_joining,
      employment_type,
      department:department_id ( name )
    `)
    .eq('id', userId)
    .single()

  if (error) return null
  return data
}

/**
 * DAYFLOW HRMS — Demo User Creation Script
 *
 * Creates the 7 fictional demo users in Supabase Auth.
 * Requires the service_role key — NEVER put this in frontend code.
 *
 * Usage:
 *   1. Copy .env.example to .env and fill in your values:
 *        VITE_SUPABASE_URL=https://your-project.supabase.co
 *        SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
 *   2. Run:
 *        node scripts/create-demo-users.js
 *
 * The script is idempotent — re-running it will skip users that
 * already exist and report their status.
 *
 * After running this script, execute the seed SQL:
 *   supabase/seed/001_demo_data.sql
 * in the Supabase SQL Editor (or via supabase db seed).
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ---------------------------------------------------------------------------
// Load .env manually (no dotenv dependency required)
// ---------------------------------------------------------------------------
function loadEnv() {
  const envPath = resolve(__dirname, '../.env')
  try {
    const lines = readFileSync(envPath, 'utf8').split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      const val = trimmed.slice(eq + 1).trim()
      if (key && val && !process.env[key]) process.env[key] = val
    }
  } catch {
    // .env not found — rely on process.env (CI/CD environment)
  }
}

loadEnv()

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('\n[ERROR] Missing required environment variables.')
  console.error('  VITE_SUPABASE_URL =', SUPABASE_URL ? '✓ set' : '✗ MISSING')
  console.error('  SUPABASE_SERVICE_ROLE_KEY =', SERVICE_ROLE_KEY ? '✓ set' : '✗ MISSING')
  console.error('\nCreate a .env file from .env.example and add your credentials.')
  process.exit(1)
}

// Admin client — uses service_role key, bypasses RLS
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// ---------------------------------------------------------------------------
// Demo users — fictional identities only
// These emails and passwords are for local/hackathon demo use.
// Change passwords before any public or production deployment.
// ---------------------------------------------------------------------------
const DEMO_USERS = [
  {
    email: 'admin@dayflow.demo',
    password: 'DayflowAdmin1!',
    label: 'Admin',
    employee_code: 'EMP-000',
    full_name: 'Dayflow Admin',
  },
  {
    email: 'priya.sharma@dayflow.demo',
    password: 'DayflowHR1!',
    label: 'HR Manager (Priya Sharma)',
    employee_code: 'EMP-002',
    full_name: 'Priya Sharma',
  },
  {
    email: 'arjun.kumar@dayflow.demo',
    password: 'DayflowEmp1!',
    label: 'Employee (Arjun Kumar)',
    employee_code: 'EMP-001',
    full_name: 'Arjun Kumar',
  },
  {
    email: 'neha.singh@dayflow.demo',
    password: 'DayflowEmp1!',
    label: 'Employee (Neha Singh)',
    employee_code: 'EMP-014',
    full_name: 'Neha Singh',
  },
  {
    email: 'rohan.mehta@dayflow.demo',
    password: 'DayflowEmp1!',
    label: 'Employee (Rohan Mehta)',
    employee_code: 'EMP-021',
    full_name: 'Rohan Mehta',
  },
  {
    email: 'ananya.rao@dayflow.demo',
    password: 'DayflowEmp1!',
    label: 'Employee (Ananya Rao)',
    employee_code: 'EMP-034',
    full_name: 'Ananya Rao',
  },
  {
    email: 'karan.patel@dayflow.demo',
    password: 'DayflowEmp1!',
    label: 'Employee (Karan Patel)',
    employee_code: 'EMP-052',
    full_name: 'Karan Patel',
  },
]

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function createDemoUsers() {
  console.log('\n=== DAYFLOW — Create Demo Auth Users ===\n')
  console.log(`Project: ${SUPABASE_URL}\n`)

  const results = []

  for (const user of DEMO_USERS) {
    process.stdout.write(`  Creating ${user.label} (${user.email})... `)

    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true, // skip email verification for demo users
      user_metadata: {
        full_name: user.full_name,
        employee_code: user.employee_code,
      },
    })

    if (error) {
      if (error.message?.includes('already been registered') ||
          error.message?.includes('already exists') ||
          error.status === 422) {
        console.log('SKIPPED (already exists)')
        results.push({ email: user.email, status: 'skipped', id: null })
      } else {
        console.log(`FAILED — ${error.message}`)
        results.push({ email: user.email, status: 'failed', error: error.message })
      }
    } else {
      console.log(`OK — UUID: ${data.user.id}`)
      results.push({ email: user.email, status: 'created', id: data.user.id })
    }
  }

  // Summary
  const created = results.filter(r => r.status === 'created').length
  const skipped = results.filter(r => r.status === 'skipped').length
  const failed  = results.filter(r => r.status === 'failed').length

  console.log('\n=== Summary ===')
  console.log(`  Created: ${created}`)
  console.log(`  Skipped: ${skipped} (already existed)`)
  console.log(`  Failed:  ${failed}`)

  if (failed > 0) {
    console.log('\n[WARNING] Some users failed to create. Review errors above.')
    process.exit(1)
  }

  // UUID mapping report
  const newUsers = results.filter(r => r.status === 'created' && r.id)
  if (newUsers.length > 0) {
    console.log('\n=== UUID Mapping (update seed/001_demo_data.sql if needed) ===')
    for (const u of newUsers) {
      console.log(`  ${u.email}: ${u.id}`)
    }
    console.log('\n[NOTE] If these UUIDs differ from the seed file fixed UUIDs,')
    console.log('  update Section 1 of supabase/seed/001_demo_data.sql to match.')
    console.log('  Fixed seed UUIDs start with 00000000-0000-0000-0010-...')
    console.log('  If Supabase assigned different UUIDs, the seed SQL must be updated.')
  }

  console.log('\n=== Next Steps ===')
  console.log('  1. Apply migrations in Supabase SQL Editor (0001 → 0016 in order)')
  console.log('  2. Run supabase/seed/001_demo_data.sql in the SQL Editor')
  console.log('  3. Verify with VERIFICATION.md queries')
  console.log('\nDone.\n')
}

createDemoUsers().catch(err => {
  console.error('\n[FATAL]', err.message)
  process.exit(1)
})

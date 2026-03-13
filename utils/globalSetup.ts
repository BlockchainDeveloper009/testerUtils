/**
 * Global setup hook - runs once before all tests
 * Use this for:
 * - Setting up test data
 * - Creating test users
 * - Configuring global state
 * - Initializing services
 * - Seeding databases
 *
 * Note: Keep this simple to avoid bootstrap issues
 */

async function globalSetup(): Promise<void> {
  // Log environment info
  console.log('[Global Setup] Starting test suite');
  console.log('[Global Setup] Environment:', process.env.ENV_LOC || 'dev');
  console.log('[Global Setup] Base URL:', process.env.BASE_URL || 'http://localhost:3000');
  console.log('[Global Setup] CI Mode:', process.env.CI === 'true' ? 'enabled' : 'disabled');
  console.log('[Global Setup] Tests ready to run');
}

export default globalSetup;

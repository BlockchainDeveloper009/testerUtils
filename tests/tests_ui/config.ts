/**
 * Environment Configuration for SauceDemo Tests
 * Supports dev, test, stage, and prod environments
 */

export type Environment = 'dev' | 'test' | 'stage' | 'prod';

export interface EnvironmentConfig {
  baseUrl: string;
  credentials: {
    standard_user: { username: string; password: string };
    visual_user: { username: string; password: string };
    error_user: { username: string; password: string };
    locked_user?: { username: string; password: string };
  };
}

export const environmentConfigs: Record<Environment, EnvironmentConfig> = {
  dev: {
    baseUrl: 'https://dev.saucedemo.com',
    credentials: {
      standard_user: { username: 'standard_user', password: 'password123' },
      visual_user: { username: 'visual_user', password: 'password123' },
      error_user: { username: 'error_user', password: 'password123' },
      locked_user: { username: 'locked_out_user', password: 'password123' },
    },
  },
  test: {
    baseUrl: 'https://test.saucedemo.com',
    credentials: {
      standard_user: { username: 'standard_user', password: 'test_pass' },
      visual_user: { username: 'visual_user', password: 'test_pass' },
      error_user: { username: 'error_user', password: 'test_pass' },
      locked_user: { username: 'locked_out_user', password: 'test_pass' },
    },
  },
  stage: {
    baseUrl: 'https://stage.saucedemo.com',
    credentials: {
      standard_user: { username: 'standard_user', password: 'stage_pass' },
      visual_user: { username: 'visual_user', password: 'stage_pass' },
      error_user: { username: 'error_user', password: 'stage_pass' },
      locked_user: { username: 'locked_out_user', password: 'stage_pass' },
    },
  },
  prod: {
    baseUrl: 'https://www.saucedemo.com',
    credentials: {
      standard_user: { username: 'standard_user', password: 'secret_sauce' },
      visual_user: { username: 'visual_user', password: 'secret_sauce' },
      error_user: { username: 'error_user', password: 'secret_sauce' },
      locked_user: { username: 'locked_out_user', password: 'secret_sauce' },
    },
  },
};

/**
 * Get environment config - defaults to prod if not specified
 */
export function getEnvironmentConfig(env: Environment = 'prod'): EnvironmentConfig {
  return environmentConfigs[env];
}

/**
 * Get credentials for a specific user type in an environment
 */
export function getCredentials(
  userType: keyof EnvironmentConfig['credentials'],
  env: Environment = 'prod'
): { username: string; password: string } {
  const config = getEnvironmentConfig(env);
  return config.credentials[userType];
}

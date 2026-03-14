/**
 * Environment configuration for test automation
 * 
 * Supports multiple environments with different URLs and credentials
 * Each environment is configured for different deployment stages
 */

import {
  Environment,
  EnvironmentConfig,
  BrowserConfig,
} from '../types/config.types';

/**
 * Default browser configuration
 * Applied to all environments unless overridden
 */
const defaultBrowserConfig: BrowserConfig = {
  headless: true,
  timeout: 30000,
  retries: 2,
};

/**
 * Environment configurations
 * Each environment has its own base URL and credentials
 */
export const environmentConfigs: Record<Environment, EnvironmentConfig> = {
  /** Development environment */
  dev: {
    baseUrl: 'https://dev.saucedemo.com',
    credentials: {
      standard_user: {
        username: 'standard_user',
        password: 'password123',
      },
      visual_user: {
        username: 'visual_user',
        password: 'password123',
      },
      error_user: {
        username: 'error_user',
        password: 'password123',
      },
      locked_user: {
        username: 'locked_out_user',
        password: 'password123',
      },
    },
    browserConfig: {
      ...defaultBrowserConfig,
      headless: false, // Dev: show browser
      slowMo: 100, // Slow down for visibility
    },
  },

  /** Test environment */
  test: {
    baseUrl: 'https://test.saucedemo.com',
    credentials: {
      standard_user: {
        username: 'standard_user',
        password: 'test_pass',
      },
      visual_user: {
        username: 'visual_user',
        password: 'test_pass',
      },
      error_user: {
        username: 'error_user',
        password: 'test_pass',
      },
      locked_user: {
        username: 'locked_out_user',
        password: 'test_pass',
      },
    },
    browserConfig: {
      ...defaultBrowserConfig,
      timeout: 20000,
      retries: 1,
    },
  },

  /** Staging environment */
  stage: {
    baseUrl: 'https://stage.saucedemo.com',
    credentials: {
      standard_user: {
        username: 'standard_user',
        password: 'stage_pass',
      },
      visual_user: {
        username: 'visual_user',
        password: 'stage_pass',
      },
      error_user: {
        username: 'error_user',
        password: 'stage_pass',
      },
      locked_user: {
        username: 'locked_out_user',
        password: 'stage_pass',
      },
    },
    browserConfig: defaultBrowserConfig,
  },

  /** Production environment */
  prod: {
    baseUrl: 'https://www.saucedemo.com',
    credentials: {
      standard_user: {
        username: 'standard_user',
        password: 'secret_sauce',
      },
      visual_user: {
        username: 'visual_user',
        password: 'secret_sauce',
      },
      error_user: {
        username: 'error_user',
        password: 'secret_sauce',
      },
      locked_user: {
        username: 'locked_out_user',
        password: 'secret_sauce',
      },
    },
    browserConfig: {
      ...defaultBrowserConfig,
      timeout: 30000,
      retries: 3, // Higher retries for prod
    },
  },
};

/**
 * Get environment configuration
 * 
 * @param env - Environment name (defaults to 'prod')
 * @returns Complete configuration for specified environment
 * 
 * @example
 * const config = getEnvironmentConfig('dev');
 * console.log(config.baseUrl); // https://dev.saucedemo.com
 */
export function getEnvironmentConfig(
  env: Environment = 'prod'
): EnvironmentConfig {
  return environmentConfigs[env];
}

/**
 * Get credentials for specific user type in environment
 * 
 * @param userType - User type identifier
 * @param env - Environment name
 * @returns Credentials for specified user
 * 
 * @example
 * const creds = getCredentials('standard_user', 'dev');
 * console.log(creds.username); // standard_user
 */
export function getCredentials(
  userType: string,
  env: Environment = 'prod'
): { username: string; password: string } {
  const config = getEnvironmentConfig(env);
  const credentials = config.credentials[userType];

  if (!credentials) {
    throw new Error(
      `Credentials not found for user type: ${userType} in environment: ${env}`
    );
  }

  return credentials;
}

/**
 * Get current test environment from environment variable
 * 
 * @returns Environment name from TEST_ENV or default to 'prod'
 * 
 * @example
 * const env = getCurrentEnvironment(); // 'dev' if TEST_ENV=dev
 */
export function getCurrentEnvironment(): Environment {
  const env = process.env.TEST_ENV as Environment;
  const validEnvs: Environment[] = ['dev', 'test', 'stage', 'prod'];

  if (!env || !validEnvs.includes(env)) {
    return 'prod';
  }

  return env;
}

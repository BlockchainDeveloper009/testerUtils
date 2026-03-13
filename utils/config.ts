/**
 * Configuration Helper - Centralized environment variable access
 * Use this to safely access and validate environment variables
 */

export interface Config {
  baseUrl: string;
  apiBaseUrl: string;
  environment: 'dev' | 'test' | 'stage' | 'prod';
  apiTimeout: number;
  debug: boolean;
  authToken?: string;
  authUsername?: string;
  authPassword?: string;
}

/**
 * Get configuration from environment variables
 */
export function getConfig(): Config {
  return {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3001',
    environment: (process.env.ENV_LOC as 'dev' | 'test' | 'stage' | 'prod') || 'dev',
    apiTimeout: parseInt(process.env.API_TIMEOUT || '30000', 10),
    debug: process.env.DEBUG === 'true',
    authToken: process.env.AUTH_TOKEN,
    authUsername: process.env.AUTH_USERNAME,
    authPassword: process.env.AUTH_PASSWORD,
  };
}

/**
 * Validate configuration
 */
export function validateConfig(config: Config): void {
  if (!config.baseUrl) {
    throw new Error('BASE_URL is required');
  }
  if (config.apiTimeout < 0) {
    throw new Error('API_TIMEOUT must be positive');
  }
}

/**
 * Get specific config value with default fallback
 */
export function getConfigValue<T>(key: string, defaultValue: T): T {
  const value = process.env[key];
  return value !== undefined ? (value as unknown as T) : defaultValue;
}

// Export singleton instance
const config = getConfig();
validateConfig(config);
export default config;

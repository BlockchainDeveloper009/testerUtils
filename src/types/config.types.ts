/**
 * Type definitions for page object configuration
 */

export type Environment = 'dev' | 'test' | 'stage' | 'prod';

/**
 * Browser configuration options
 */
export interface BrowserConfig {
  /** Run browser in headless mode */
  headless: boolean;
  /** Timeout for operations in milliseconds */
  timeout: number;
  /** Number of test retries on failure */
  retries: number;
  /** Slow down execution by X milliseconds */
  slowMo?: number;
  /** Browser type */
  browser?: 'chromium' | 'firefox' | 'webkit';
}

/**
 * Credentials for authentication
 */
export interface Credentials {
  username: string;
  password: string;
}

/**
 * Environment-specific configuration
 */
export interface EnvironmentConfig {
  baseUrl: string;
  credentials: {
    standard_user: Credentials;
    visual_user: Credentials;
    error_user: Credentials;
    locked_user?: Credentials;
    [key: string]: Credentials | undefined;
  };
  browserConfig: BrowserConfig;
}

/**
 * Test data structure for SauceDemo
 */
export interface SauceDemoTestData {
  firstName: string;
  lastName: string;
  postalCode: string;
  username: string;
  password: string;
}

/**
 * Checkout information
 */
export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/**
 * Test product data
 */
export interface ProductData {
  id: string;
  name: string;
  price: number;
}

/**
 * Playwright Test Fixtures for SauceDemo Page Objects
 * 
 * Provides automatic dependency injection of:
 * - Page objects (all pre-initialized with correct baseUrl)
 * - Environment configuration
 * - Test data
 * - Logger
 */

import { test as base, Page, expect } from '@playwright/test';
import {
  SauceDemoLoginPage,
  SauceDemoInventoryPage,
  SauceDemoCartPage,
  SauceDemoCheckoutPage,
  SauceDemoMenuPage,
} from '../../src/pages/sauceDemo';
import {
  Environment,
  EnvironmentConfig,
} from '../../src/types/config.types';
import {
  getEnvironmentConfig,
  getCurrentEnvironment,
} from '../../src/config/environments';
import { logger } from '../../src/lib/logger';

/**
 * Type definition for all available fixtures
 */
type TestFixtures = {
  /**
   * Current test environment (from TEST_ENV env var or 'prod' default)
   */
  env: Environment;

  /**
   * Full configuration for current environment
   */
  envConfig: EnvironmentConfig;

  /**
   * Login page object
   */
  loginPage: SauceDemoLoginPage;

  /**
   * Inventory page object
   */
  inventoryPage: SauceDemoInventoryPage;

  /**
   * Cart page object
   */
  cartPage: SauceDemoCartPage;

  /**
   * Checkout page object
   */
  checkoutPage: SauceDemoCheckoutPage;

  /**
   * Menu page object
   */
  menuPage: SauceDemoMenuPage;
};

/**
 * Create custom test with SauceDemo fixtures
 * 
 * All page objects are automatically initialized with:
 * - Correct baseUrl for current environment
 * - Logger for structured logging
 * - Type safety
 * 
 * @example
 * import { test } from './fixtures/page.fixtures';
 * 
 * test('Complete order flow', async ({
 *   loginPage,
 *   inventoryPage,
 *   checkoutPage,
 *   env,
 * }) => {
 *   // All page objects ready to use!
 *   // env tells you which environment is being tested
 * });
 */
export const test = base.extend<TestFixtures>({
  // ========== Environment Fixtures ==========

  /**
   * Get current test environment
   * Reads from TEST_ENV environment variable
   * Falls back to 'prod' if not set
   */
  env: async ({}, use) => {
    const env = getCurrentEnvironment();
    logger.info(`Running tests against: ${env}`, { module: 'Fixtures' });
    await use(env);
  },

  /**
   * Get environment configuration
   * Includes baseUrl, credentials, and browser config
   */
  envConfig: async ({ env }, use) => {
    const config = getEnvironmentConfig(env);
    logger.debug(`Loaded configuration for ${env}`, {
      module: 'Fixtures',
      baseUrl: config.baseUrl,
    });
    await use(config);
  },

  // ========== Page Object Fixtures ==========

  /**
   * Login page object
   * Pre-initialized with correct baseUrl
   */
  loginPage: async ({ page, envConfig }, use) => {
    const loginPage = new SauceDemoLoginPage(page, envConfig.baseUrl);
    logger.debug('LoginPage fixture initialized', { module: 'Fixtures' });
    await use(loginPage);
  },

  /**
   * Inventory page object
   * Pre-initialized with correct baseUrl
   */
  inventoryPage: async ({ page, envConfig }, use) => {
    const inventoryPage = new SauceDemoInventoryPage(
      page,
      envConfig.baseUrl
    );
    logger.debug('InventoryPage fixture initialized', { module: 'Fixtures' });
    await use(inventoryPage);
  },

  /**
   * Cart page object
   * Pre-initialized with correct baseUrl
   */
  cartPage: async ({ page, envConfig }, use) => {
    const cartPage = new SauceDemoCartPage(page, envConfig.baseUrl);
    logger.debug('CartPage fixture initialized', { module: 'Fixtures' });
    await use(cartPage);
  },

  /**
   * Checkout page object
   * Pre-initialized with correct baseUrl
   */
  checkoutPage: async ({ page, envConfig }, use) => {
    const checkoutPage = new SauceDemoCheckoutPage(page, envConfig.baseUrl);
    logger.debug('CheckoutPage fixture initialized', { module: 'Fixtures' });
    await use(checkoutPage);
  },

  /**
   * Menu page object
   * Pre-initialized with correct baseUrl
   */
  menuPage: async ({ page, envConfig }, use) => {
    const menuPage = new SauceDemoMenuPage(page, envConfig.baseUrl);
    logger.debug('MenuPage fixture initialized', { module: 'Fixtures' });
    await use(menuPage);
  },
});

/**
 * Re-export expect for use in tests
 */
export { expect };

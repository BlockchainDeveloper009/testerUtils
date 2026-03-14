/**
 * Playwright Test Fixtures for Page Objects and Environment Configuration
 * Allows tests to use environment-specific config and page objects
 */

import { test as base, Page } from '@playwright/test';
import { Environment, getEnvironmentConfig, EnvironmentConfig } from './config';
import {
  SauceDemoLoginPage,
  SauceDemoInventoryPage,
  SauceDemoCartPage,
  SauceDemoCheckoutPage,
  SauceDemoMenuPage,
} from './sauceDemo.page';

type TestFixtures = {
  env: Environment;
  envConfig: EnvironmentConfig;
  loginPage: SauceDemoLoginPage;
  inventoryPage: SauceDemoInventoryPage;
  cartPage: SauceDemoCartPage;
  checkoutPage: SauceDemoCheckoutPage;
  menuPage: SauceDemoMenuPage;
};

/**
 * Create custom test with fixtures for SauceDemo
 * Usage: test('my test', async ({ loginPage, inventoryPage, env }) => { ... })
 */
export const test = base.extend<TestFixtures>({
  // Get environment from environment variable or use 'prod' as default
  env: async ({}, use) => {
    const env: Environment = (process.env.TEST_ENV as Environment) || 'prod';
    await use(env);
  },

  // Get environment config
  envConfig: async ({ env }, use) => {
    const config = getEnvironmentConfig(env);
    await use(config);
  },

  // Login page object
  loginPage: async ({ page, envConfig }, use) => {
    const loginPage = new SauceDemoLoginPage(page, envConfig.baseUrl);
    await use(loginPage);
  },

  // Inventory page object
  inventoryPage: async ({ page, envConfig }, use) => {
    const inventoryPage = new SauceDemoInventoryPage(page, envConfig.baseUrl);
    await use(inventoryPage);
  },

  // Cart page object
  cartPage: async ({ page, envConfig }, use) => {
    const cartPage = new SauceDemoCartPage(page, envConfig.baseUrl);
    await use(cartPage);
  },

  // Checkout page object
  checkoutPage: async ({ page, envConfig }, use) => {
    const checkoutPage = new SauceDemoCheckoutPage(page, envConfig.baseUrl);
    await use(checkoutPage);
  },

  // Menu page object
  menuPage: async ({ page, envConfig }, use) => {
    const menuPage = new SauceDemoMenuPage(page, envConfig.baseUrl);
    await use(menuPage);
  },
});

export { expect } from '@playwright/test';

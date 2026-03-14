/**
 * SauceDemo Order Flow Tests
 * Tests cover different user types: standard_user, visual_user, error_user
 * Can be run against different environments: dev, test, stage, prod (default)
 * 
 * Usage:
 * - npm run test:ui (runs tests against prod)
 * - TEST_ENV=dev npx playwright test (runs tests against dev)
 * - TEST_ENV=stage npx playwright test (runs tests against stage)
 */

import { test, expect } from './fixtures';
import { getCredentials } from './config';

const testCases = [
  {
    name: 'Standard user order',
    userType: 'standard_user' as const,
    cartItems: ['sauce-labs-backpack', 'sauce-labs-bolt-t-shirt'],
    checkout: { firstName: 'HG', lastName: 'Ka', postalCode: '65051' },
    logout: false,
  },
  {
    name: 'Visual user order and logout',
    userType: 'visual_user' as const,
    cartItems: ['sauce-labs-onesie', 'sauce-labs-fleece-jacket', 'sauce-labs-bike-light'],
    checkout: { firstName: 'Usr2', lastName: 'Agtest', postalCode: '90650' },
    logout: true,
  },
  {
    name: 'Error user order and logout',
    userType: 'error_user' as const,
    cartItems: [
      'sauce-labs-bike-light',
      'sauce-labs-fleece-jacket',
      'test.allthethings()-t-shirt-(red)',
      'sauce-labs-bolt-t-shirt',
      'sauce-labs-backpack',
      'sauce-labs-bolt-t-shirt',
      'sauce-labs-onesie',
    ],
    checkout: { firstName: 'error', lastName: 'd', postalCode: '95051' },
    logout: true,
  },
];

for (const tc of testCases) {
  test(`${tc.name}`, async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
    menuPage,
    env,
    envConfig,
  }) => {
    // Get credentials for the user type in the current environment
    const credentials = getCredentials(tc.userType, env);

    // Navigate to app and login
    await loginPage.goto();
    await loginPage.login(credentials.username, credentials.password);

    // Add items to cart
    for (const item of tc.cartItems) {
      await inventoryPage.addToCart(item);
    }

    // Proceed to checkout
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInfo(tc.checkout.firstName, tc.checkout.lastName, tc.checkout.postalCode);
    await checkoutPage.finish();

    // Logout if required by test case
    if (tc.logout) {
      await menuPage.openMenu();
      await menuPage.logout();
    }
  });
}
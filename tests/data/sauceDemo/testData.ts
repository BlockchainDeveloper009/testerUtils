/**
 * Test data for SauceDemo application
 * 
 * Centralized test data management
 * Separate from tests for easy maintenance and updates
 */

import { SauceDemoTestData } from '../types/config.types';

/**
 * Test user accounts
 * Different users for different test scenarios
 */
export const testUsers = {
  /** Standard user (happy path) */
  standard: {
    username: 'standard_user',
    password: 'secret_sauce',
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345',
  } as SauceDemoTestData,

  /** Visual testing user */
  visual: {
    username: 'visual_user',
    password: 'secret_sauce',
    firstName: 'Jane',
    lastName: 'Smith',
    postalCode: '54321',
  } as SauceDemoTestData,

  /** Error user (negative testing) */
  error: {
    username: 'error_user',
    password: 'secret_sauce',
    firstName: 'Error',
    lastName: 'User',
    postalCode: '99999',
  } as SauceDemoTestData,

  /** Locked out user */
  lockedOut: {
    username: 'locked_out_user',
    password: 'secret_sauce',
    firstName: 'Locked',
    lastName: 'User',
    postalCode: '00000',
  } as SauceDemoTestData,
} as const;

/**
 * Product identifiers for adding to cart
 */
export const products = {
  backpack: 'sauce-labs-backpack',
  bikeLight: 'sauce-labs-bike-light',
  boltTshirt: 'sauce-labs-bolt-t-shirt',
  fleeceJacket: 'sauce-labs-fleece-jacket',
  onesie: 'sauce-labs-onesie',
  testServerShirt: 'test.allthethings()-t-shirt-(red)',
} as const;

/**
 * Common test data for checkout
 */
export const checkoutData = {
  validCheckout: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345',
  },
  alternateCheckout: {
    firstName: 'Jane',
    lastName: 'Smith',
    postalCode: '54321',
  },
  minimalCheckout: {
    firstName: 'J',
    lastName: 'D',
    postalCode: '1',
  },
} as const;

/**
 * Common test shopping lists
 * Pre-defined product combinations for different test scenarios
 */
export const shoppingLists = {
  /** Single item */
  singleItem: [products.backpack],

  /** Multiple items for standard user */
  standardOrder: [products.backpack, products.boltTshirt],

  /** Multiple items for visual user */
  visualOrder: [products.onesie, products.fleeceJacket, products.bikeLight],

  /** All products (for comprehensive testing) */
  allItems: [
    products.backpack,
    products.bikeLight,
    products.boltTshirt,
    products.fleeceJacket,
    products.onesie,
    products.testServerShirt,
  ],
} as const;

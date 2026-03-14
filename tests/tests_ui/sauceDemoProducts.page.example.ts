/**
 * Example: Products Page Object
 * This is an example of how to create a new page object for future pages
 * 
 * To use this page in your tests:
 * 1. Add it to fixtures.ts like other page objects
 * 2. Import it in your test file
 * 3. Use it through the test fixture
 */

import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class SauceDemoProductsPage extends BasePage {
  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  // ============ Navigation ============
  async navigate() {
    await this.goto('/inventory.html');
  }

  // ============ Product Listing ============
  async getProductList(): Promise<string[]> {
    const elements = await this.page.locator('[data-test="inventory-item"]').allTextContents();
    return elements;
  }

  async getProductNames(): Promise<string[]> {
    const names = await this.page.locator('[data-test="inventory-item-name"]').allTextContents();
    return names;
  }

  async getProductPrices(): Promise<string[]> {
    const prices = await this.page.locator('[data-test="inventory-item-price"]').allTextContents();
    return prices;
  }

  // ============ Sorting ============
  async sortBy(option: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc') {
    await this.click('[data-test="product-sort-container"]');
    await this.click(`[data-test="product_sort_container"] option[value="${option}"]`);
  }

  // ============ Filtering ============
  async filterByPrice(minPrice: number, maxPrice: number) {
    // Implementation depends on actual filter UI
    // This is a placeholder example
    await this.fill('[data-test="price-min"]', minPrice.toString());
    await this.fill('[data-test="price-max"]', maxPrice.toString());
    await this.click('[data-test="filter-button"]');
  }

  // ============ Product Details ============
  async clickProduct(productName: string) {
    await this.click(`//div[@data-test="inventory-item-name" and text()="${productName}"]`);
  }

  async getProductDescription(productName: string): Promise<string> {
    const selector = `//div[contains(text(), "${productName}")]/ancestor::div[@data-test="inventory-item"]//div[@data-test="inventory-item-description"]`;
    return await this.getText(selector);
  }

  async addProductToCart(productName: string) {
    const selector = `//div[contains(text(), "${productName}")]/ancestor::div[@data-test="inventory-item"]//button[contains(@data-test, "add-to-cart")]`;
    await this.click(selector);
  }

  // ============ Verification ============
  async isProductVisible(productName: string): Promise<boolean> {
    const selector = `//div[@data-test="inventory-item-name" and text()="${productName}"]`;
    return await this.isVisible(selector);
  }

  async getCartItemCount(): Promise<string> {
    return await this.getText('[data-test="shopping-cart-badge"]');
  }

  async isCartEmpty(): Promise<boolean> {
    return !(await this.isVisible('[data-test="shopping-cart-badge"]'));
  }
}

/**
 * Example usage in a test file:
 * 
 * import { test } from './fixtures';
 * 
 * test('Filter and sort products', async ({ productsPage, loginPage, env }) => {
 *   const credentials = getCredentials('standard_user', env);
 *   
 *   await loginPage.goto();
 *   await loginPage.login(credentials.username, credentials.password);
 *   
 *   await productsPage.navigate();
 *   await productsPage.sortBy('price-asc');
 *   
 *   const prices = await productsPage.getProductPrices();
 *   console.log('Prices:', prices);
 *   
 *   const isVisible = await productsPage.isProductVisible('Sauce Labs Backpack');
 *   expect(isVisible).toBeTruthy();
 * });
 */

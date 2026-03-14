/**
 * SauceDemo Inventory/Products Page Object
 * 
 * Handles all product listing and shopping cart interactions
 */

import { Page } from '@playwright/test';
import { BasePage } from '../basePage';
import { ISauceDemoInventoryPage } from '../../interfaces';
import { SauceDemoSelectors } from '../../utils/selectors';
import { Retry, LogExecution } from '../../decorators';

/**
 * Inventory page for SauceDemo application
 * 
 * @example
 * const inventoryPage = new SauceDemoInventoryPage(page, baseUrl);
 * await inventoryPage.goto('/inventory');
 * await inventoryPage.addToCart('sauce-labs-backpack');
 * 
 * @implements ISauceDemoInventoryPage
 */
export class SauceDemoInventoryPage
  extends BasePage
  implements ISauceDemoInventoryPage
{
  /**
   * Initialize SauceDemo Inventory Page
   * @param page - Playwright page object
   * @param baseUrl - Base URL of the application
   */
  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  /**
   * Navigate to inventory page
   */
  @LogExecution('info')
  async goto(): Promise<void> {
    await super.goto('/inventory.html');
  }

  /**
   * Add item to shopping cart
   * 
   * @param itemId - Item identifier (product name slug)
   * @throws {PageObjectError} If add to cart fails
   * 
   * @example
   * await inventoryPage.addToCart('sauce-labs-backpack');
   */
  @Retry(2, 500)
  @LogExecution('debug')
  async addToCart(itemId: string): Promise<void> {
    const selector = SauceDemoSelectors.inventory.addToCartButton(itemId);

    this.logger.debug(`Adding to cart: ${itemId}`, {
      module: 'SauceDemoInventoryPage',
    });

    await this.clickElement(selector);
  }

  /**
   * Open shopping cart
   * 
   * @throws {PageObjectError} If navigation to cart fails
   * 
   * @example
   * await inventoryPage.openCart();
   */
  @LogExecution('info')
  async openCart(): Promise<void> {
    this.logger.info('Opening shopping cart', {
      module: 'SauceDemoInventoryPage',
    });

    await this.clickElement(SauceDemoSelectors.inventory.cartLink);

    // Wait for cart page to load
    await this.page.waitForURL(/cart\.html/, { timeout: 10000 });
  }

  /**
   * Get cart badge count
   * 
   * @returns Cart item count or null if badge not visible
   * 
   * @example
   * const count = await inventoryPage.getCartBadgeCount();
   * expect(count).toBe('2');
   */
  @LogExecution('debug')
  async getCartBadgeCount(): Promise<string | null> {
    if (await this.isVisible(SauceDemoSelectors.inventory.cartBadge)) {
      return await this.getText(SauceDemoSelectors.inventory.cartBadge);
    }
    return null;
  }

  /**
   * Verify if inventory page is loaded
   * 
   * @returns true if inventory page is fully loaded
   * 
   * @example
   * expect(await inventoryPage.isInventoryPageLoaded()).toBeTruthy();
   */
  @LogExecution('debug')
  async isInventoryPageLoaded(): Promise<boolean> {
    try {
      await this.waitForElement(SauceDemoSelectors.inventory.inventorylist);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get all product names on the page
   * 
   * @returns Array of product names
   * 
   * @example
   * const products = await inventoryPage.getProductNames();
   */
  @LogExecution('debug')
  async getProductNames(): Promise<string[]> {
    const elements = await this.page
      .locator(SauceDemoSelectors.inventory.inventoryItemName)
      .allTextContents();

    return elements.map((name) => name.trim());
  }

  /**
   * Check if specific product is visible
   * 
   * @param productName - Name of the product
   * @returns true if product is visible
   */
  @LogExecution('debug')
  async isProductVisible(productName: string): Promise<boolean> {
    const selector = `${SauceDemoSelectors.inventory.inventoryItemName}:has-text("${productName}")`;
    return await this.isVisible(selector);
  }
}

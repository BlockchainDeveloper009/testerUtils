/**
 * SauceDemo Cart Page Object
 * 
 * Handles shopping cart interactions and checkout initiation
 */

import { Page } from '@playwright/test';
import { BasePage } from '../basePage';
import { SauceDemoSelectors } from '../../utils/selectors';
import { LogExecution } from '../../decorators';

/**
 * Cart page for SauceDemo application
 * 
 * @example
 * const cartPage = new SauceDemoCartPage(page, baseUrl);
 * await cartPage.goto('/cart.html');
 * await cartPage.checkout();
 */
export class SauceDemoCartPage extends BasePage {
  /**
   * Initialize SauceDemo Cart Page
   * @param page - Playwright page object
   * @param baseUrl - Base URL of the application
   */
  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  /**
   * Navigate to cart page
   */
  @LogExecution('info')
  async goto(): Promise<void> {
    await super.goto('/cart.html');
  }

  /**
   * Proceed to checkout
   * 
   * @throws {PageObjectError} If checkout button click fails
   * 
   * @example
   * await cartPage.checkout();
   */
  @LogExecution('info')
  async checkout(): Promise<void> {
    this.logger.info('Proceeding to checkout', {
      module: 'SauceDemoCartPage',
    });

    await this.clickElement(SauceDemoSelectors.cart.checkoutButton);

    // Wait for checkout step one page
    await this.page.waitForURL(/checkout-step-one/, { timeout: 10000 });
  }

  /**
   * Continue shopping (go back to inventory)
   * 
   * @throws {PageObjectError} If navigation fails
   */
  @LogExecution('info')
  async continueShopping(): Promise<void> {
    this.logger.info('Continuing shopping', {
      module: 'SauceDemoCartPage',
    });

    await this.clickElement(SauceDemoSelectors.cart.continueShoppingButton);

    // Wait for inventory page
    await this.page.waitForURL(/inventory/, { timeout: 10000 });
  }

  /**
   * Get all item names in cart
   * 
   * @returns Array of item names
   */
  @LogExecution('debug')
  async getCartItems(): Promise<string[]> {
    const items = await this.page
      .locator(SauceDemoSelectors.cart.cartItemName)
      .allTextContents();

    return items.map((item) => item.trim());
  }

  /**
   * Verify if cart is empty
   * 
   * @returns true if no items in cart
   */
  @LogExecution('debug')
  async isCartEmpty(): Promise<boolean> {
    const items = await this.getCartItems();
    return items.length === 0;
  }

  /**
   * Get cart item count
   * 
   * @returns Number of items in cart
   */
  @LogExecution('debug')
  async getCartItemCount(): Promise<number> {
    const items = await this.getCartItems();
    return items.length;
  }
}

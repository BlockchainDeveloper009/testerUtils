/**
 * Interface for SauceDemo Inventory/Products Page
 */

import { IPage } from './IPage';

export interface ISauceDemoInventoryPage extends IPage {
  /**
   * Add item to cart
   * @param itemId - Item identifier for cart button
   */
  addToCart(itemId: string): Promise<void>;

  /**
   * Open shopping cart
   */
  openCart(): Promise<void>;

  /**
   * Get cart badge count
   */
  getCartBadgeCount(): Promise<string | null>;

  /**
   * Verify if inventory page is loaded
   */
  isInventoryPageLoaded(): Promise<boolean>;
}

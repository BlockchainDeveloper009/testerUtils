/**
 * Interface for SauceDemo Checkout Page
 */

import { IPage } from './IPage';

export interface ISauceDemoCheckoutPage extends IPage {
  /**
   * Fill checkout information
   * @param firstName - First name
   * @param lastName - Last name
   * @param postalCode - Postal/ZIP code
   */
  fillInfo(firstName: string, lastName: string, postalCode: string): Promise<void>;

  /**
   * Complete checkout by clicking finish button
   */
  finish(): Promise<void>;

  /**
   * Get success message after completing order
   */
  getSuccessMessage(): Promise<string | null>;

  /**
   * Verify if checkout page is loaded
   */
  isCheckoutPageLoaded(): Promise<boolean>;
}

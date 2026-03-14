/**
 * SauceDemo Checkout Page Object
 * 
 * Handles checkout flow including information entry and order completion
 */

import { Page } from '@playwright/test';
import { BasePage } from '../basePage';
import { ISauceDemoCheckoutPage } from '../../interfaces';
import { SauceDemoSelectors } from '../../utils/selectors';
import { CheckoutInfo } from '../../types/config.types';
import { LogExecution } from '../../decorators';

/**
 * Checkout page for SauceDemo application
 * 
 * @example
 * const checkoutPage = new SauceDemoCheckoutPage(page, baseUrl);
 * await checkoutPage.goto('/checkout-step-one.html');
 * await checkoutPage.fillInfo('John', 'Doe', '12345');
 * await checkoutPage.finish();
 * 
 * @implements ISauceDemoCheckoutPage
 */
export class SauceDemoCheckoutPage
  extends BasePage
  implements ISauceDemoCheckoutPage
{
  /**
   * Initialize SauceDemo Checkout Page
   * @param page - Playwright page object
   * @param baseUrl - Base URL of the application
   */
  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  /**
   * Navigate to checkout page
   */
  @LogExecution('info')
  async goto(): Promise<void> {
    await super.goto('/checkout-step-one.html');
  }

  /**
   * Fill checkout information (first name, last name, postal code)
   * 
   * @param firstName - Customer's first name
   * @param lastName - Customer's last name
   * @param postalCode - Customer's postal/ZIP code
   * @throws {PageObjectError} If form fill fails
   * 
   * @example
   * await checkoutPage.fillInfo('John', 'Doe', '12345');
   */
  @LogExecution('info')
  async fillInfo(
    firstName: string,
    lastName: string,
    postalCode: string
  ): Promise<void> {
    this.logger.info('Filling checkout information', {
      module: 'SauceDemoCheckoutPage',
      firstName,
      lastName,
    });

    // Fill first name
    await this.fillInput(
      SauceDemoSelectors.checkout.firstNameInput,
      firstName
    );

    // Fill last name
    await this.fillInput(
      SauceDemoSelectors.checkout.lastNameInput,
      lastName
    );

    // Fill postal code
    await this.fillInput(
      SauceDemoSelectors.checkout.postalCodeInput,
      postalCode
    );

    // Click continue button
    await this.clickElement(SauceDemoSelectors.checkout.continueButton);

    // Wait for checkout overview page to load
    await this.page.waitForURL(/checkout-step-two/, { timeout: 10000 });

    this.logger.info('✓ Checkout information filled and submitted', {
      module: 'SauceDemoCheckoutPage',
    });
  }

  /**
   * Complete order by clicking finish button
   * 
   * @throws {PageObjectError} If finish action fails
   * 
   * @example
   * await checkoutPage.finish();
   */
  @LogExecution('info')
  async finish(): Promise<void> {
    this.logger.info('Completing order', {
      module: 'SauceDemoCheckoutPage',
    });

    await this.clickElement(SauceDemoSelectors.checkout.finishButton);

    // Wait for confirmation page
    await this.page.waitForURL(/checkout-complete/, { timeout: 10000 });

    this.logger.info('✓ Order completed successfully', {
      module: 'SauceDemoCheckoutPage',
    });
  }

  /**
   * Get success message after order completion
   * 
   * @returns Success message text or null if not visible
   * 
   * @example
   * const message = await checkoutPage.getSuccessMessage();
   * expect(message).toContain('Thank you');
   */
  @LogExecution('debug')
  async getSuccessMessage(): Promise<string | null> {
    if (await this.isVisible(SauceDemoSelectors.checkout.successMessage)) {
      return await this.getText(SauceDemoSelectors.checkout.successMessage);
    }
    return null;
  }

  /**
   * Verify if checkout page is loaded
   * 
   * @returns true if checkout form is visible
   * 
   * @example
   * expect(await checkoutPage.isCheckoutPageLoaded()).toBeTruthy();
   */
  @LogExecution('debug')
  async isCheckoutPageLoaded(): Promise<boolean> {
    return await this.isVisible(
      SauceDemoSelectors.checkout.firstNameInput
    );
  }

  /**
   * Cancel checkout and go back
   * 
   * @example
   * await checkoutPage.cancel();
   */
  @LogExecution('info')
  async cancel(): Promise<void> {
    this.logger.info('Cancelling checkout', {
      module: 'SauceDemoCheckoutPage',
    });

    await this.clickElement(SauceDemoSelectors.checkout.cancelButton);
  }
}

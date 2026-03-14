/**
 * SauceDemo Login Page Object
 * 
 * Handles all login-related interactions on the SauceDemo application
 */

import { Page } from '@playwright/test';
import { BasePage } from '../basePage';
import { ISauceDemoLoginPage } from '../../interfaces';
import { SauceDemoSelectors } from '../../utils/selectors';
import { Retry, LogExecution } from '../../decorators';

/**
 * Login page for SauceDemo application
 * 
 * @example
 * const loginPage = new SauceDemoLoginPage(page, baseUrl);
 * await loginPage.goto();
 * await loginPage.login('standard_user', 'secret_sauce');
 * 
 * @implements ISauceDemoLoginPage
 */
export class SauceDemoLoginPage
  extends BasePage
  implements ISauceDemoLoginPage
{
  /**
   * Initialize SauceDemo Login Page
   * @param page - Playwright page object
   * @param baseUrl - Base URL of the application
   */
  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  /**
   * Navigate to login page
   */
  @LogExecution('info')
  async goto(): Promise<void> {
    await super.goto();
  }

  /**
   * Login with credentials
   * 
   * Automatically retries if login fails (up to 3 times)
   * 
   * @param username - Username for authentication
   * @param password - Password for authentication
   * @throws {PageObjectError} If login fails after retries
   * 
   * @example
   * await loginPage.login('standard_user', 'secret_sauce');
   */
  @Retry(3, 1000)
  @LogExecution('info')
  async login(username: string, password: string): Promise<void> {
    this.logger.info(`Attempting login as: ${username}`, {
      module: 'SauceDemoLoginPage',
    });

    // Fill username
    await this.fillInput(
      SauceDemoSelectors.login.usernameInput,
      username
    );

    // Fill password
    await this.fillInput(
      SauceDemoSelectors.login.passwordInput,
      password
    );

    // Click login button
    await this.clickElement(SauceDemoSelectors.login.loginButton);

    // Wait for either success (inventory page) or error
    await this.page.waitForURL(/inventory|$/, { timeout: 10000 });

    this.logger.info(`✓ Login successful as: ${username}`, {
      module: 'SauceDemoLoginPage',
    });
  }

  /**
   * Get error message displayed on login page
   * 
   * @returns Error message text or null if not visible
   * 
   * @example
   * const error = await loginPage.getErrorMessage();
   * expect(error).toContain('locked out');
   */
  @LogExecution('debug')
  async getErrorMessage(): Promise<string | null> {
    if (await this.isVisible(SauceDemoSelectors.login.errorMessage)) {
      return await this.getText(SauceDemoSelectors.login.errorMessage);
    }
    return null;
  }

  /**
   * Verify if login form is visible
   * 
   * @returns true if login form is visible
   */
  @LogExecution('debug')
  async isLoginFormVisible(): Promise<boolean> {
    return await this.isVisible(SauceDemoSelectors.login.usernameInput) &&
      await this.isVisible(SauceDemoSelectors.login.passwordInput);
  }

  /**
   * Get login credentials hint (for demo purposes)
   * 
   * @returns Credentials information text
   */
  @LogExecution('debug')
  async getCredentialsHint(): Promise<string | null> {
    return await this.getText(SauceDemoSelectors.login.credentialsInfo);
  }
}

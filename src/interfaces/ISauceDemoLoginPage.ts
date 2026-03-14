/**
 * Interface for SauceDemo Login Page
 * Extends IPage with login-specific functionality
 */

import { IPage } from './IPage';

export interface ISauceDemoLoginPage extends IPage {
  /**
   * Login with credentials
   * @param username - Username for authentication
   * @param password - Password for authentication
   * @throws {PageObjectError} If login fails
   */
  login(username: string, password: string): Promise<void>;

  /**
   * Get error message displayed on login page
   * @returns Error message text or null if not visible
   */
  getErrorMessage(): Promise<string | null>;

  /**
   * Verify if login form is visible
   */
  isLoginFormVisible(): Promise<boolean>;
}

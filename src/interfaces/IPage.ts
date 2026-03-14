/**
 * Base interface for all page objects
 * Defines the contract that all pages must implement
 */

export interface IPage {
  /**
   * Navigate to a page or path
   * @param path - Optional relative path or URL to navigate to
   */
  goto(path?: string): Promise<void>;

  /**
   * Wait for page to fully load
   */
  waitForPageLoad(): Promise<void>;

  /**
   * Get the current page URL
   */
  getCurrentUrl(): Promise<string>;

  /**
   * Get the page title
   */
  getPageTitle(): Promise<string>;

  /**
   * Check if element is visible on the page
   * @param selector - CSS selector or Playwright locator
   */
  isVisible(selector: string): Promise<boolean>;

  /**
   * Check if element is enabled
   * @param selector - CSS selector or Playwright locator
   */
  isEnabled(selector: string): Promise<boolean>;

  /**
   * Get element text content
   * @param selector - CSS selector or Playwright locator
   */
  getText(selector: string): Promise<string | null>;

  /**
   * Take screenshot for debugging
   * @param name - Name of the screenshot
   */
  takeScreenshot(name: string): Promise<void>;
}

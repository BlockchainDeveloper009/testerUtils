/**
 * Abstract base class for all page objects
 * 
 * Principles:
 * - Interface-based design (implements IPage)
 * - Clear public API for tests
 * - Protected/private methods for internal use
 * - Built-in error handling and logging
 * - Type-safe selectors
 */

import { Page } from '@playwright/test';
import { IPage } from '../interfaces';
import { logger } from '../lib/logger';
import {
  PageObjectError,
  SelectorNotFoundError,
  NavigationError,
} from '../utils/errors';

/**
 * Abstract base class for page objects
 * All page objects should extend this class
 * 
 * @abstract
 * @example
 * export class LoginPage extends BasePage implements ILoginPage {
 *   async login(username: string, password: string) {
 *     await this.clickElement(SauceDemoSelectors.login.loginButton);
 *   }
 * }
 */
export abstract class BasePage implements IPage {
  /** Playwright page object */
  protected readonly page: Page;

  /** Base URL for navigation */
  protected readonly baseUrl: string;

  /** Logger instance */
  protected readonly logger: typeof logger;

  /**
   * Initialize page object
   * @param page - Playwright page object
   * @param baseUrl - Base URL for the application
   */
  constructor(page: Page, baseUrl: string) {
    this.page = page;
    this.baseUrl = baseUrl;
    this.logger = logger;
  }

  /**
   * Navigate to a path or URL
   * 
   * @param path - Optional path relative to baseUrl
   * @throws {NavigationError} If navigation fails
   * @example
   * await page.goto('/inventory');
   */
  async goto(path: string = ''): Promise<void> {
    const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`;

    try {
      this.logger.debug(`Navigating to: ${url}`, {
        module: this.constructor.name,
      });

      await this.page.goto(url, { waitUntil: 'networkidle' });

      this.logger.info(`✓ Navigation successful to ${url}`, {
        module: this.constructor.name,
      });
    } catch (error) {
      const pageError = new NavigationError(
        this.constructor.name,
        url,
        error as Error
      );
      this.logger.error(pageError.message, pageError);
      throw pageError;
    }
  }

  /**
   * Wait for page to fully load
   * @throws {TimeoutError} If page load exceeds timeout
   */
  async waitForPageLoad(): Promise<void> {
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 30000 });
      this.logger.debug('Page load complete', {
        module: this.constructor.name,
      });
    } catch (error) {
      const pageError = new PageObjectError(
        this.constructor.name,
        'waitForPageLoad',
        error as Error
      );
      this.logger.error(pageError.message, pageError);
      throw pageError;
    }
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Check if element is visible
   * 
   * @param selector - CSS selector
   * @returns true if visible, false otherwise
   */
  async isVisible(selector: string): Promise<boolean> {
    try {
      return await this.page.locator(selector).isVisible({
        timeout: 5000,
      });
    } catch {
      return false;
    }
  }

  /**
   * Check if element is enabled
   * 
   * @param selector - CSS selector
   * @returns true if enabled, false otherwise
   */
  async isEnabled(selector: string): Promise<boolean> {
    try {
      return await this.page.locator(selector).isEnabled({
        timeout: 5000,
      });
    } catch {
      return false;
    }
  }

  /**
   * Get element text content
   * 
   * @param selector - CSS selector
   * @returns Text content or null if not found
   */
  async getText(selector: string): Promise<string | null> {
    try {
      return await this.page.locator(selector).textContent({
        timeout: 5000,
      });
    } catch (error) {
      this.logger.warn(
        `Failed to get text from selector: ${selector}`,
        { module: this.constructor.name }
      );
      return null;
    }
  }

  /**
   * Take screenshot for debugging
   * 
   * @param name - Screenshot name
   */
  async takeScreenshot(name: string): Promise<void> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `screenshots/${this.constructor.name}-${name}-${timestamp}.png`;

      await this.page.screenshot({ path: filename });

      this.logger.info(`Screenshot saved: ${filename}`, {
        module: this.constructor.name,
      });
    } catch (error) {
      this.logger.error(
        `Failed to take screenshot: ${name}`,
        error as Error,
        { module: this.constructor.name }
      );
    }
  }

  // ========== Protected Methods (for subclasses only) ==========

  /**
   * Click an element
   * Protected method for page objects to use
   * 
   * @param selector - CSS selector
   * @throws {PageObjectError} If click fails
   */
  protected async clickElement(selector: string): Promise<void> {
    try {
      this.logger.debug(`Clicking: ${selector}`, {
        module: this.constructor.name,
      });

      await this.page.locator(selector).click({ timeout: 10000 });
    } catch (error) {
      const pageError = new PageObjectError(
        this.constructor.name,
        `click[${selector}]`,
        error as Error,
        { selector }
      );
      this.logger.error(pageError.message, pageError);
      throw pageError;
    }
  }

  /**
   * Fill input field with text
   * Protected method for page objects to use
   * 
   * @param selector - CSS selector
   * @param text - Text to fill
   * @throws {PageObjectError} If fill fails
   */
  protected async fillInput(selector: string, text: string): Promise<void> {
    try {
      this.logger.debug(`Filling input: ${selector}`, {
        module: this.constructor.name,
      });

      await this.page.locator(selector).fill(text, { timeout: 10000 });
    } catch (error) {
      const pageError = new PageObjectError(
        this.constructor.name,
        `fill[${selector}]`,
        error as Error,
        { selector, textLength: text.length }
      );
      this.logger.error(pageError.message, pageError);
      throw pageError;
    }
  }

  /**
   * Press a key
   * Protected method for page objects to use
   * 
   * @param selector - CSS selector
   * @param key - Key to press
   */
  protected async pressKey(selector: string, key: string): Promise<void> {
    try {
      this.logger.debug(`Pressing key: ${key} on ${selector}`, {
        module: this.constructor.name,
      });

      await this.page.locator(selector).press(key, { timeout: 10000 });
    } catch (error) {
      const pageError = new PageObjectError(
        this.constructor.name,
        `press[${key}]`,
        error as Error
      );
      this.logger.error(pageError.message, pageError);
      throw pageError;
    }
  }

  /**
   * Wait for element to be visible
   * Protected method for page objects to use
   * 
   * @param selector - CSS selector
   * @param timeoutMs - Timeout in milliseconds
   */
  protected async waitForElement(
    selector: string,
    timeoutMs: number = 10000
  ): Promise<void> {
    try {
      await this.page.waitForSelector(selector, { timeout: timeoutMs });
    } catch (error) {
      const pageError = new SelectorNotFoundError(
        this.constructor.name,
        selector,
        error as Error
      );
      this.logger.error(pageError.message, pageError);
      throw pageError;
    }
  }

  /**
   * Execute JavaScript in page context
   * Protected method for page objects to use
   * 
   * @param script - JavaScript to execute
   * @param args - Arguments to pass to script
   */
  protected async executeScript<T>(
    script: string,
    ...args: any[]
  ): Promise<T> {
    try {
      return await this.page.evaluate(script, ...args);
    } catch (error) {
      const pageError = new PageObjectError(
        this.constructor.name,
        'executeScript',
        error as Error
      );
      this.logger.error(pageError.message, pageError);
      throw pageError;
    }
  }
}

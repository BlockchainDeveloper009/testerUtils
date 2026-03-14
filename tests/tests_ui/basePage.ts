/**
 * Base Page Object Model
 * All page objects should extend this class
 */

import { Page } from '@playwright/test';
import { EnvironmentConfig } from './config';

export class BasePage {
  readonly page: Page;
  readonly baseUrl: string;

  constructor(page: Page, baseUrl: string) {
    this.page = page;
    this.baseUrl = baseUrl;
  }

  /**
   * Navigate to a relative or absolute URL
   */
  async goto(path: string = '') {
    const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`;
    await this.page.goto(url);
  }

  /**
   * Wait for page load
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Take screenshot for debugging
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }

  /**
   * Check if element is visible
   */
  async isVisible(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isVisible();
  }

  /**
   * Check if element is enabled
   */
  async isEnabled(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isEnabled();
  }

  /**
   * Get element text
   */
  async getText(selector: string): Promise<string> {
    return await this.page.locator(selector).textContent();
  }

  /**
   * Click element
   */
  async click(selector: string) {
    await this.page.locator(selector).click();
  }

  /**
   * Fill input field
   */
  async fill(selector: string, text: string) {
    await this.page.locator(selector).fill(text);
  }

  /**
   * Press key
   */
  async press(selector: string, key: string) {
    await this.page.locator(selector).press(key);
  }
}

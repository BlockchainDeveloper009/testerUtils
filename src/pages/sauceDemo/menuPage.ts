/**
 * SauceDemo Menu/Header Page Object
 * 
 * Handles header menu interactions and logout functionality
 */

import { Page } from '@playwright/test';
import { BasePage } from '../basePage';
import { SauceDemoSelectors } from '../../utils/selectors';
import { LogExecution } from '../../decorators';

/**
 * Menu page for SauceDemo application
 * 
 * @example
 * const menuPage = new SauceDemoMenuPage(page, baseUrl);
 * await menuPage.openMenu();
 * await menuPage.logout();
 */
export class SauceDemoMenuPage extends BasePage {
  /**
   * Initialize SauceDemo Menu Page
   * @param page - Playwright page object
   * @param baseUrl - Base URL of the application
   */
  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  /**
   * Open the hamburger menu
   * 
   * @throws {PageObjectError} If menu button click fails
   * 
   * @example
   * await menuPage.openMenu();
   */
  @LogExecution('debug')
  async openMenu(): Promise<void> {
    this.logger.debug('Opening menu', { module: 'SauceDemoMenuPage' });

    await this.clickElement(SauceDemoSelectors.menu.menuButton);

    // Wait for menu to become visible
    await this.page.waitForSelector(SauceDemoSelectors.menu.menuContainer, {
      timeout: 5000,
    });
  }

  /**
   * Logout from application
   * 
   * @throws {PageObjectError} If logout fails
   * 
   * @example
   * await menuPage.logout();
   */
  @LogExecution('info')
  async logout(): Promise<void> {
    this.logger.info('Logging out', { module: 'SauceDemoMenuPage' });

    // Open menu if not already open
    const isMenuOpen = await this.isVisible(
      SauceDemoSelectors.menu.logoutLink
    );
    if (!isMenuOpen) {
      await this.openMenu();
    }

    await this.clickElement(SauceDemoSelectors.menu.logoutLink);

    // Wait for login page
    await this.page.waitForURL(/\/$/, { timeout: 10000 });

    this.logger.info('✓ Logout successful', {
      module: 'SauceDemoMenuPage',
    });
  }

  /**
   * Close the menu
   */
  @LogExecution('debug')
  async closeMenu(): Promise<void> {
    this.logger.debug('Closing menu', { module: 'SauceDemoMenuPage' });

    // Click on page background to close menu
    await this.page.click('body', { position: { x: 800, y: 400 } });
  }

  /**
   * Navigate to all items
   * Requires menu to be open
   */
  @LogExecution('debug')
  async goToAllItems(): Promise<void> {
    await this.clickElement(SauceDemoSelectors.menu.allItemsLink);
  }

  /**
   * Reset app state
   * Requires menu to be open
   */
  @LogExecution('info')
  async resetAppState(): Promise<void> {
    this.logger.info('Resetting app state', {
      module: 'SauceDemoMenuPage',
    });

    await this.clickElement(SauceDemoSelectors.menu.resetLink);

    this.logger.info('✓ App state reset', {
      module: 'SauceDemoMenuPage',
    });
  }
}

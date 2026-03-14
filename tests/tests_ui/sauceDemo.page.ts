import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class SauceDemoLoginPage extends BasePage {
  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  async login(username: string, password: string) {
    await this.fill('[data-test="username"]', username);
    await this.fill('[data-test="password"]', password);
    await this.click('[data-test="login-button"]');
  }
}

export class SauceDemoInventoryPage extends BasePage {
  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  async addToCart(itemDataTest: string) {
    await this.click(`[data-test="add-to-cart-${itemDataTest}"]`);
  }

  async openCart() {
    await this.click('[data-test="shopping-cart-link"]');
  }
}

export class SauceDemoCartPage extends BasePage {
  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  async checkout() {
    await this.click('[data-test="checkout"]');
  }
}

export class SauceDemoCheckoutPage extends BasePage {
  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  async fillInfo(firstName: string, lastName: string, postalCode: string) {
    await this.fill('[data-test="firstName"]', firstName);
    await this.fill('[data-test="lastName"]', lastName);
    await this.fill('[data-test="postalCode"]', postalCode);
    await this.click('[data-test="continue"]');
  }

  async finish() {
    await this.click('[data-test="finish"]');
  }
}

export class SauceDemoMenuPage extends BasePage {
  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  async openMenu() {
    await this.page.getByRole('button', { name: 'Open Menu' }).click();
  }

  async logout() {
    await this.click('[data-test="logout-sidebar-link"]');
  }
}

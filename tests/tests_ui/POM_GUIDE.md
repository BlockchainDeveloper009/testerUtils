# Page Object Model (POM) Architecture Guide

This guide explains the Page Object Model architecture implemented for UI automation tests and how to extend it for new pages and environments.

## Project Structure

```
tests/tests_ui/
├── basePage.ts           # Base class for all page objects
├── sauceDemo.page.ts     # Page object classes for SauceDemo app
├── config.ts             # Environment and credentials configuration
├── fixtures.ts           # Playwright test fixtures with page objects
├── sauce_order1.spec.ts  # Example test using POM and fixtures
└── POM_GUIDE.md         # This guide
```

## Key Components

### 1. BasePage (basePage.ts)
Base class that all page objects extend. Provides common functionality:
- Navigation (`goto()`)
- Element interactions (`click()`, `fill()`, `isVisible()`)
- Utility methods (`takeScreenshot()`, `getCurrentUrl()`)

**Benefits:**
- DRY principle - shared code in one place
- Consistent API across all page objects
- Easy to add new helper methods used by all pages

### 2. Environment Configuration (config.ts)
Defines environments and credentials for different deployments:
- **dev** - Development environment
- **test** - Test environment
- **stage** - Staging environment
- **prod** - Production (default)

Each environment has:
- Base URL (e.g., `https://dev.saucedemo.com`)
- Credentials for multiple user types (standard_user, visual_user, error_user, locked_user)

**Usage:**
```typescript
import { getEnvironmentConfig, getCredentials } from './config';

// Get full config for an environment
const config = getEnvironmentConfig('stage');

// Get specific credentials
const creds = getCredentials('standard_user', 'test');
// Returns: { username: 'standard_user', password: 'test_pass' }
```

### 3. Page Objects (sauceDemo.page.ts)
Classes representing pages in the application. Each page object:
- Extends `BasePage`
- Receives `page` (Playwright Page) and `baseUrl` in constructor
- Implements page-specific actions as methods

**Example:**
```typescript
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
```

### 4. Fixtures (fixtures.ts)
Playwright fixtures provide automatic dependency injection. Tests receive:
- `env` - Current test environment (from `TEST_ENV` env var)
- `envConfig` - Configuration for current environment
- `loginPage`, `inventoryPage`, etc. - Page objects pre-configured with correct baseUrl

**Benefits:**
- No manual page object instantiation
- Automatic environment switching
- Type-safe page objects and credentials

### 5. Tests (sauce_order1.spec.ts)
Tests using the fixture-based approach:

```typescript
import { test } from './fixtures';

test('Standard user order', async ({ loginPage, inventoryPage, cartPage, env }) => {
  // Get credentials for current environment
  const credentials = getCredentials('standard_user', env);
  
  // Use page objects - they're already initialized with correct baseUrl
  await loginPage.goto();
  await loginPage.login(credentials.username, credentials.password);
  await inventoryPage.addToCart('sauce-labs-backpack');
  // ... rest of test
});
```

## How to Add a New Page

### Step 1: Create Page Object Class

Create a new file `pages/myNewPage.page.ts`:

```typescript
import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class MyNewPage extends BasePage {
  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  // Define page-specific actions
  async navigateToSettings() {
    await this.click('[data-test="settings-link"]');
    await this.waitForPageLoad();
  }

  async updateProfile(name: string, email: string) {
    await this.fill('[data-test="name-input"]', name);
    await this.fill('[data-test="email-input"]', email);
    await this.click('[data-test="save-button"]');
  }

  async getSuccessMessage(): Promise<string> {
    return await this.getText('[data-test="success-message"]');
  }
}
```

### Step 2: Add to Fixtures

Update `fixtures.ts` to include your new page object:

```typescript
import { MyNewPage } from './myNewPage.page';

type TestFixtures = {
  // ... existing fixtures
  myNewPage: MyNewPage;
};

export const test = base.extend<TestFixtures>({
  // ... existing fixtures
  
  myNewPage: async ({ page, envConfig }, use) => {
    const myNewPage = new MyNewPage(page, envConfig.baseUrl);
    await use(myNewPage);
  },
});
```

### Step 3: Use in Tests

```typescript
import { test } from './fixtures';

test('User profile update', async ({ loginPage, myNewPage, env, envConfig }) => {
  const credentials = getCredentials('standard_user', env);
  
  await loginPage.goto();
  await loginPage.login(credentials.username, credentials.password);
  await myNewPage.navigateToSettings();
  await myNewPage.updateProfile('John Doe', 'john@example.com');
  
  const message = await myNewPage.getSuccessMessage();
  expect(message).toContain('Profile updated');
});
```

## How to Add a New Environment

Update `config.ts`:

```typescript
export const environmentConfigs: Record<Environment, EnvironmentConfig> = {
  // ... existing environments
  
  production: {
    baseUrl: 'https://prod.saucedemo.com',
    credentials: {
      standard_user: { username: 'std_user_prod', password: 'prod_pass' },
      visual_user: { username: 'vis_user_prod', password: 'prod_pass' },
      error_user: { username: 'err_user_prod', password: 'prod_pass' },
    },
  },
};
```

Then update the `Environment` type:
```typescript
export type Environment = 'dev' | 'test' | 'stage' | 'prod' | 'production';
```

## Running Tests with Different Environments

### Default (Production)
```bash
npx playwright test
npm run test:ui
```

### Development
```bash
TEST_ENV=dev npx playwright test
TEST_ENV=dev npm run test:ui
```

### Staging
```bash
TEST_ENV=stage npx playwright test
```

### With Specific Test File
```bash
TEST_ENV=test npx playwright test sauce_order1.spec.ts
```

## Best Practices

### 1. Selector Management
Keep selectors in page objects, not in tests:
```typescript
// ❌ Bad
test('login', async ({ page }) => {
  await page.locator('[data-test="username"]').fill('user');
});

// ✅ Good
test('login', async ({ loginPage }) => {
  await loginPage.login('user', 'pass');
});
```

### 2. Single Responsibility
Each page object should represent one page/component:
```typescript
// ✅ Good - Each class has one clear purpose
export class LoginPage extends BasePage { }
export class HomePage extends BasePage { }
export class ProfilePage extends BasePage { }
```

### 3. Descriptive Method Names
Method names should describe the action and outcome:
```typescript
// ✅ Good
async loginWithValidCredentials(username: string, password: string) { }
async verifyErrorMessage(expectedText: string) { }

// ❌ Avoid
async click1() { }
async do() { }
```

### 4. Use Fixtures Over Manual Instantiation
```typescript
// ❌ Avoid
const loginPage = new SauceDemoLoginPage(page, 'https://example.com');

// ✅ Use fixtures
test('login', async ({ loginPage }) => {
  // loginPage is automatically initialized
});
```

### 5. Parameterize Credentials
```typescript
// ✅ Good - Use getCredentials() for environment-aware credentials
const creds = getCredentials('standard_user', env);

// ❌ Avoid - Hardcoded credentials
const creds = { username: 'admin', password: 'admin123' };
```

## Adding Helper Methods to BasePage

If you find yourself repeating an action across multiple page objects, add it to `BasePage`:

```typescript
// In basePage.ts
export class BasePage {
  // ... existing methods
  
  async selectDropdown(selector: string, value: string) {
    await this.click(selector);
    await this.click(`[data-value="${value}"]`);
  }

  async dismissAlert() {
    await this.page.on('dialog', dialog => dialog.accept());
  }
}

// Now all page objects can use these methods
export class MyPage extends BasePage {
  async selectCountry(country: string) {
    await this.selectDropdown('[data-test="country"]', country);
  }
}
```

## Debugging Tests

### 1. Enable Visual Debugging
```bash
npx playwright test --headed
```

### 2. Slow Down Tests
```bash
npx playwright test --headed --workers=1
```

### 3. Debug Mode
```bash
npx playwright test --debug
```

### 4. Screenshots and Traces
POM includes `takeScreenshot()` method:
```typescript
test('debug test', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.takeScreenshot('after-navigation');
  // ... rest of test
});
```

## Summary

This POM architecture provides:
- ✅ **Scalability** - Easy to add new pages and environments
- ✅ **Maintainability** - Changes to selectors in one place
- ✅ **Reusability** - Common methods in BasePage
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Environment Flexibility** - Switch environments via env var
- ✅ **Clean Tests** - Focus on test logic, not implementation

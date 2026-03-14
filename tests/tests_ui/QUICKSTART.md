# Quick Start: Adding a New Page to POM Architecture

## Steps to Add a New Page

### 1. Create Page Object File

Create `tests/tests_ui/yourNewPage.page.ts`:

```typescript
import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class YourNewPage extends BasePage {
  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  // Navigation
  async goto() {
    await super.goto('/your-page-path');
  }

  // Actions
  async doSomething(param: string) {
    // Use helper methods from BasePage
    await this.click('[selector]');
    await this.fill('[input-selector]', param);
  }

  // Verifications
  async verifyElement() {
    return await this.isVisible('[selector]');
  }
}
```

### 2. Add to Fixtures

Update `tests/tests_ui/fixtures.ts`:

**Import at top:**
```typescript
import { YourNewPage } from './yourNewPage.page';
```

**Add to TestFixtures type:**
```typescript
type TestFixtures = {
  // ... existing
  yourNewPage: YourNewPage;
};
```

**Add to extend() configuration:**
```typescript
export const test = base.extend<TestFixtures>({
  // ... existing fixtures
  
  yourNewPage: async ({ page, envConfig }, use) => {
    const yourNewPage = new YourNewPage(page, envConfig.baseUrl);
    await use(yourNewPage);
  },
});
```

### 3. Use in Tests

```typescript
import { test } from './fixtures';
import { getCredentials } from './config';

test('My feature test', async ({ loginPage, yourNewPage, env }) => {
  const credentials = getCredentials('standard_user', env);
  
  // Use fixtures - they're automatically initialized
  await loginPage.goto();
  await loginPage.login(credentials.username, credentials.password);
  await yourNewPage.doSomething('value');
  
  expect(await yourNewPage.verifyElement()).toBeTruthy();
});
```

## Adding New Environment

### 1. Update config.ts

```typescript
export type Environment = 'dev' | 'test' | 'stage' | 'prod' | 'your-env';

export const environmentConfigs: Record<Environment, EnvironmentConfig> = {
  // ... existing
  
  'your-env': {
    baseUrl: 'https://your-env.example.com',
    credentials: {
      standard_user: { username: 'user1', password: 'pass1' },
      visual_user: { username: 'user2', password: 'pass2' },
      error_user: { username: 'user3', password: 'pass3' },
    },
  },
};
```

### 2. Run Tests Against Environment

```bash
# Run against your new environment
TEST_ENV=your-env npx playwright test

# Run specific test file
TEST_ENV=your-env npx playwright test sauce_order1.spec.ts
```

## File Organization (Current Structure)

```
tests/tests_ui/
├── basePage.ts                          # Base class (parent of all pages)
├── config.ts                            # Environment configs
├── fixtures.ts                          # Test fixtures
├── sauceDemo.page.ts                    # Page objects for SauceDemo
├── sauceDemoProducts.page.example.ts    # Example page (reference)
├── sauce_order1.spec.ts                 # Example tests
└── POM_GUIDE.md                         # Detailed guide
```

## Summary of Key Files

| File | Purpose |
|------|---------|
| `basePage.ts` | Shared functionality for all pages (navigation, clicks, fills, etc.) |
| `config.ts` | Environment URLs and credentials |
| `fixtures.ts` | Auto-initialization of page objects and config for tests |
| `*.page.ts` | Page-specific functionality (extends BasePage) |
| `*.spec.ts` | Tests (use fixtures for page objects) |

## Common Patterns

### Getting Credentials
```typescript
import { getCredentials } from './config';

const creds = getCredentials('standard_user', env);
// creds.username, creds.password
```

### Using Page Objects
```typescript
test('my test', async ({ loginPage, yourNewPage, env }) => {
  // Page objects automatically have correct baseUrl
  await loginPage.goto();
  await yourNewPage.doSomething();
});
```

### Verifying Elements
```typescript
// From BasePage helper methods
const visible = await page.isVisible('[selector]');
const text = await page.getText('[selector]');
const enabled = await page.isEnabled('[selector]');
```

## Tips

1. **Use data-test attributes** when possible - they're stable across UI changes
2. **Keep selectors in page objects** - don't hardcode in tests
3. **Use meaningful method names** - `loginWithValidCredentials()` not `click1()`
4. **Run with environment variable** - `TEST_ENV=dev npx playwright test`
5. **Use fixtures** - let Playwright inject page objects automatically

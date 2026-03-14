# Enterprise-Grade Test Automation Architecture

This project implements a **senior-level, industry-standard** test automation architecture following SOLID principles and clean code practices.

## 🏗️ Architecture Overview

### Directory Structure

```
src/
├── pages/                          # Page objects (reusable across projects)
│   ├── basePage.ts                 # Abstract base class with common functionality
│   └── sauceDemo/                  # Domain-specific pages
│       ├── loginPage.ts
│       ├── inventoryPage.ts
│       ├── cartPage.ts
│       ├── checkoutPage.ts
│       ├── menuPage.ts
│       └── index.ts                # Barrel export
│
├── interfaces/                     # Type contracts (interfaces)
│   ├── IPage.ts                    # Base page interface
│   ├── ISauceDemoLoginPage.ts      # Login-specific contract
│   ├── ISauceDemoInventoryPage.ts  # Inventory-specific contract
│   ├── ISauceDemoCheckoutPage.ts   # Checkout-specific contract
│   └── index.ts                    # Barrel export
│
├── decorators/                     # Reusable decorators
│   ├── retry.decorator.ts          # Automatic retry with backoff
│   ├── logExecution.decorator.ts   # Execution logging + timing
│   ├── timeout.decorator.ts        # Timeout enforcement
│   └── index.ts                    # Barrel export
│
├── utils/
│   ├── selectors/                  # Centralized selectors
│   │   ├── sauceDemo.selectors.ts  # SauceDemo app selectors
│   │   └── index.ts
│   │
│   └── errors/                     # Custom error classes
│       ├── PageObjectError.ts      # Error hierarchy
│       └── index.ts
│
├── types/                          # TypeScript type definitions
│   └── config.types.ts             # Configuration types
│
├── config/                         # Application configuration
│   └── environments.ts             # Environment configs (dev, test, stage, prod)
│
└── lib/                            # Existing utilities
    ├── logger.ts                   # Structured logging (already exists)
    ├── apiHelper.ts                # API helper (already exists)
    └── index.ts

tests/
├── fixtures/
│   └── page.fixtures.ts            # Playwright fixtures with DI
│
├── sauceDemo/
│   └── order.spec.ts               # Example test suite
│
└── data/
    └── sauceDemo/
        └── testData.ts             # Centralized test data
```

## 🎯 Core Principles

### 1. **SOLID Principles**

#### Single Responsibility
Each class has one job:
- `LoginPage` handles login
- `InventoryPage` handles product listing
- `BasePage` provides common functionality

#### Open/Closed
Easy to extend, hard to modify:
```typescript
// Add new page without modifying existing code
export class ProfilePage extends BasePage implements IProfilePage {
  // New functionality
}
```

#### Liskov Substitution
Page objects are interchangeable via interfaces:
```typescript
// Tests depend on abstractions
test('login test', async ({ loginPage }: { loginPage: ISauceDemoLoginPage }) => {
  // Works with any implementation of ISauceDemoLoginPage
});
```

#### Interface Segregation
Small, focused interfaces:
```typescript
export interface IPage {
  goto(): Promise<void>;
  getCurrentUrl(): Promise<string>;
  // Only core navigation and utility methods
}

export interface ISauceDemoLoginPage extends IPage {
  login(username: string, password: string): Promise<void>;
  // Login-specific methods only
}
```

#### Dependency Inversion
Depend on abstractions, not implementations:
```typescript
// Page objects depend on abstractions (interfaces)
export class SauceDemoLoginPage extends BasePage implements ISauceDemoLoginPage

// Tests inject dependencies via fixtures
test('login', async ({ loginPage, envConfig }) => {
  // loginPage is already initialized with correct config
});
```

## 🔄 Architecture Diagrams

### System Architecture
```
┌─────────────────────────────────────────────────────────────────────┐
│                          🧪 TESTS LAYER                              │
│                      (order.spec.ts)                                 │
│                    6 Test Cases with @tags                           │
└────────────────────────────────────────────┬────────────────────────┘
                                             │
                                    Injects via Fixtures
                                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      🔧 FIXTURES LAYER                               │
│          (page.fixtures.ts + testData.ts)                           │
│    Dependency Injection for all Page Objects & Test Data            │
└──────┬──────────┬──────────┬──────────┬──────────┬──────────────────┘
       │          │          │          │          │
       ↓          ↓          ↓          ↓          ↓
    LoginPage  InventoryPage CartPage CheckoutPage MenuPage
       │          │          │          │          │
       └──────────┴──────────┴──────────┴──────────┘
              All Extend BasePage
                      │
       ┌──────────────┴──────────────┐
       ↓                             ↓
   BasePage                    Interfaces
   (Abstract)            (IPage, ISauceDemoLoginPage,
   - Public API                ISauceDemoInventoryPage,
   - Protected Methods         ISauceDemoCheckoutPage)
   - Private Methods

       ↓         Uses        ↓          ↓
   Decorators              Selectors   Errors
   @Retry                 (CSS)      (Custom)
   @LogExecution     sauceDemo.ts    Handler
   @Timeout          Centralized     Context


Configuration
├── environments.ts (dev, test, stage, prod)
└── config.types.ts (TypeScript Types)
```

### Execution Flow
```
Test Starts (order.spec.ts)
         │
         ↓
Fixtures Inject Page Objects (pre-configured with baseUrl)
         │
         ↓
Test calls: loginPage.login(username, password)
         │
         ↓
@Retry Decorator Wraps Method (Attempt 1)
         │
         ↓
BasePage.fillInput() → Selectors.lookup() → Logger.log()
         │
         ↓
Custom Error? → @Retry catches error
         │              │
         └──Exponential Backoff (wait 1s, 1.5s, 2.25s)
            │
            └──Retry Attempt 2, 3...
         │
         ↓
Success → @LogExecution logs timing
         │
         ↓
Return to Test
         │
         ↓
Assert Results ✅
```

### 2. **Decorators for Cross-Cutting Concerns**

Automatic retry, logging, and timeout without cluttering test code:

```typescript
@Retry(3, 1000)           // Retry 3 times with 1s delay
@LogExecution('info')     // Log with timing
async login(username: string, password: string): Promise<void> {
  // Implementation is clean - retry/logging are transparent
}
```

### 3. **Interface-Based Design**

Contracts ensure consistency:

```typescript
// Interfaces define what pages MUST do
export interface ISauceDemoLoginPage extends IPage {
  login(username: string, password: string): Promise<void>;
  getErrorMessage(): Promise<string | null>;
  isLoginFormVisible(): Promise<boolean>;
}

// Implementation fulfills contract
export class SauceDemoLoginPage extends BasePage implements ISauceDemoLoginPage {
  async login(username: string, password: string): Promise<void> {
    // Must implement correctly
  }
}
```

### 4. **Centralized Selectors**

Single source of truth for CSS selectors:

```typescript
// src/utils/selectors/sauceDemo.selectors.ts
export const SauceDemoSelectors = {
  login: {
    usernameInput: '[data-test="username"]',
    passwordInput: '[data-test="password"]',
    loginButton: '[data-test="login-button"]',
  },
  inventory: {
    addToCartButton: (itemId: string) => `[data-test="add-to-cart-${itemId}"]`,
  },
} as const;

// Usage in page objects
await this.clickElement(SauceDemoSelectors.login.loginButton);
```

**Benefits:**
- Easy refactor when UI changes
- Type-safe selector keys
- Clear organization
- No selector duplication

### 5. **Custom Error Classes**

Structured error information for debugging:

```typescript
export class PageObjectError extends Error {
  constructor(
    public readonly pageName: string,
    public readonly action: string,
    public readonly originalError: Error,
    public readonly context?: Record<string, any>
  ) {
    // Error provides full context and stack trace
  }
}

// Specific error types
export class SelectorNotFoundError extends PageObjectError { }
export class TimeoutError extends PageObjectError { }
export class NavigationError extends PageObjectError { }
```

### 6. **Encapsulation with Protected/Private Methods**

Clear API design:

```typescript
export abstract class BasePage implements IPage {
  // Public API for tests
  async goto(path?: string): Promise<void> { }
  async isVisible(selector: string): Promise<boolean> { }

  // Protected - only for subclasses
  protected async clickElement(selector: string): Promise<void> { }
  protected async fillInput(selector: string, text: string): Promise<void> { }

  // Private - internal helpers only
  private async waitFor(selector: string): Promise<void> { }
}
```

### 7. **Environment-Aware Configuration**

Type-safe config for multiple environments:

```typescript
// src/config/environments.ts
export const environmentConfigs: Record<Environment, EnvironmentConfig> = {
  dev: {
    baseUrl: 'https://dev.example.com',
    credentials: { /* ... */ },
    browserConfig: { headless: false, slowMo: 100 },
  },
  prod: {
    baseUrl: 'https://example.com',
    credentials: { /* ... */ },
    browserConfig: { headless: true, retries: 3 },
  },
};

// Usage
const config = getEnvironmentConfig('dev'); // Type-safe
const creds = getCredentials('standard_user', 'dev'); // Type-safe
```

### 8. **Centralized Test Data**

Separate data from logic:

```typescript
// tests/data/sauceDemo/testData.ts
export const testUsers = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce',
    firstName: 'John',
    lastName: 'Doe',
  },
};

export const shoppingLists = {
  standardOrder: ['sauce-labs-backpack', 'sauce-labs-bolt-t-shirt'],
};

// Usage in tests
test('order flow', async ({ loginPage }) => {
  await loginPage.login(testUsers.standard.username, testUsers.standard.password);
  // Easy to maintain data in one place
});
```

### 9. **Comprehensive JSDoc Documentation**

Self-documenting code:

```typescript
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
async login(username: string, password: string): Promise<void> { }
```

### 10. **Dependency Injection via Fixtures**

Automatic initialization with correct configuration:

```typescript
// tests/fixtures/page.fixtures.ts
export const test = base.extend<TestFixtures>({
  loginPage: async ({ page, envConfig }, use) => {
    // Automatically initialized with correct baseUrl
    const loginPage = new SauceDemoLoginPage(page, envConfig.baseUrl);
    await use(loginPage); // Injected into tests
  },
});

// Usage - everything is ready!
test('login', async ({ loginPage, envConfig }) => {
  // loginPage is pre-configured
  // envConfig is set for current environment
});
```

### 11. **Barrel Exports for Clean Imports**

```typescript
// src/pages/sauceDemo/index.ts
export { SauceDemoLoginPage } from './loginPage';
export { SauceDemoInventoryPage } from './inventoryPage';
export { SauceDemoCheckoutPage } from './checkoutPage';

// Usage - clean imports
import { SauceDemoLoginPage, SauceDemoInventoryPage } from '@pages/sauceDemo';
```

### 12. **Strict TypeScript Mode**

Full type safety:

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,                    // All checks enabled
    "forceConsistentCasingInFileNames": true,
    "noImplicitOverride": true,        // Catch override mistakes
    "noImplicitReturns": true,         // Return statements required
    "noUnusedLocals": true,            // No unused variables
    "noUnusedParameters": true
  }
}
```

## 📋 Multi-Page Pattern Example

Want to test a different website? Easy!

```typescript
// src/pages/anotherWebsite/loginPage.ts
import { BasePage } from '../basePage';
import { IAnotherWebsiteLoginPage } from '@interfaces';

export class AnotherWebsiteLoginPage extends BasePage implements IAnotherWebsiteLoginPage {
  async login(username: string, password: string): Promise<void> {
    // Use different selectors, inherit common functionality
    await this.fillInput('.email-field', username);
    await this.fillInput('.password-field', password);
    await this.clickElement('.submit-btn');
  }
}

// src/interfaces/IAnotherWebsiteLoginPage.ts
import { IPage } from './IPage';

export interface IAnotherWebsiteLoginPage extends IPage {
  login(username: string, password: string): Promise<void>;
}

// tests/fixtures/page.fixtures.ts - add to fixtures
anotherWebsiteLoginPage: async ({ page, envConfig }, use) => {
  const loginPage = new AnotherWebsiteLoginPage(page, envConfig.baseUrl);
  await use(loginPage);
},

// tests/anotherWebsite/login.spec.ts
test('login to another website', async ({ anotherWebsiteLoginPage }) => {
  await anotherWebsiteLoginPage.goto();
  await anotherWebsiteLoginPage.login('user', 'pass');
});
```

## 🚀 Running Tests

### By Environment

```bash
# Production (default)
npm run ui:prod

# Development
npm run ui:dev

# Staging
npm run ui:stage

# With browser visible
npm run ui:dev:headed
```

### By Tags

```bash
# Smoke tests
npx playwright test --grep @smoke

# Order tests
npx playwright test --grep @order

# Negative tests
npx playwright test --grep @negative
```

### Specific Test

```bash
# Single test
npx playwright test tests/sauceDemo/order.spec.ts

# Specific test name
npx playwright test -g "Standard user"

# Debug mode
npx playwright test --debug
```

## 📚 Enterprise Features

✅ **SOLID Principles** - Professional code organization  
✅ **Type Safety** - Strict TypeScript with zero implicit any  
✅ **Error Handling** - Custom error classes with context  
✅ **Automatic Retry** - Decorator-based retry with backoff  
✅ **Structured Logging** - Full execution tracing  
✅ **Dependency Injection** - Fixtures handle all initialization  
✅ **Interface-Based** - Depend on contracts, not implementations  
✅ **Encapsulation** - Clear public/protected/private boundaries  
✅ **Scalable** - Easy to add pages and environments  
✅ **Maintainable** - Centralized selectors and test data  
✅ **Professional Documentation** - JSDoc on every method  
✅ **Clean Code** - No duplication, no technical debt  

## 🎓 Learning Resources

Each file has comprehensive JSDoc comments explaining:
- What the code does
- Why design decisions were made
- How to use it
- Examples for common patterns

## 🔄 Extending the Architecture

### Adding a New Page

1. Create interface: `src/interfaces/IMyPage.ts`
2. Create page object: `src/pages/myApp/myPage.ts`
3. Add to fixtures: `tests/fixtures/page.fixtures.ts`
4. Create tests: `tests/myApp/my.spec.ts`
5. Add test data: `tests/data/myApp/testData.ts`

### Adding a New Environment

Update `src/config/environments.ts`:

```typescript
export const environmentConfigs = {
  // ... existing
  qa: {
    baseUrl: 'https://qa.example.com',
    credentials: { /* ... */ },
    browserConfig: { /* ... */ },
  },
};

// Use: TEST_ENV=qa npx playwright test
```

## ✅ Quality Checklist

Before committing:

```bash
npm run build      # Compile TypeScript
npm run lint       # Check code style
npm run test       # Run all tests
```

Each commit passes:
- TypeScript strict mode
- ESLint rules
- Prettier formatting
- All tests pass
- No console errors

---

**This is enterprise-grade, senior-level test automation architecture.**

Ready for production, scalable for growth, maintainable long-term. 🚀

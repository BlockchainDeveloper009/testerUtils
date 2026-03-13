import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ApiUtils } from '../utils/ApiUtils.ts';

// Define the types for your fixtures
type MyFixtures = {
  loginPage: LoginPage;
  apiUtils: ApiUtils;
  authenticatedPage: any; 
};

export const test = base.extend<MyFixtures>({
  // Initialize the LoginPage object automatically
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  // Initialize a utility class for API calls (perfect for seeding data)
  apiUtils: async ({ request }, use) => {
    await use(new ApiUtils(request));
  },

  // A fixture that ensures the user is logged in before the test starts
  authenticatedPage: async ({ page }, use) => {
    // Logic to check/set storage state or perform a quick UI login
    await page.goto('/login');
    // ... login logic ...
    await use(page);
  },
});

//export { expect } from '@playwright/test';
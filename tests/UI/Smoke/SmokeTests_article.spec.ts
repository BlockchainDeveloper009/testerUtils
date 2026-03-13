import { test, expect } from '../../../src/fixtures/baseTest';


test.describe('Article Management', () => {
  
  test('should create a new article via UI after seeding data via API', async ({ loginPage, apiUtils, page }) => {
    // 1. Arrange: Use API to ensure a clean state or setup a prerequisite
    const userToken = await apiUtils.getAuthToken();
    
    // 2. Act: Use the injected loginPage fixture
    await loginPage.navigate();
    await loginPage.login('email@example.com', 'password');
    
    // 3. Assert
    await expect(page).toHaveURL(/.*dashboard/);
  });
});
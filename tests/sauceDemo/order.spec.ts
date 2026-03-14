import { test, expect } from '../fixtures/page.fixtures';

test.describe('SauceDemo Order Flow Tests', () => {
  // ========== SMOKE TESTS ==========

  /**
   * Test 1: Standard user completes order
   * 
   * Flow:
   * 1. Login with standard_user
   * 2. Add item to cart
   * 3. Proceed to checkout
   * 4. Fill checkout info
   * 5. Verify success message
   * 
   * @tags @smoke, @order
   */
  test('Standard user completes order @smoke @order', async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
    testData,
  }) => {
    // Arrange
    const testUser = testData.testUsers.standard;
    const checkoutInfo = testData.checkoutData.validCheckout;
    const product = testData.products.backpack;

    // Act - Login
    await loginPage.goto();
    await loginPage.login(testUser.username, testUser.password);
    await inventoryPage.waitForPageLoad();

    // Act - Add to cart and checkout
    await inventoryPage.addToCart('1');
    const cartBadge = await inventoryPage.getCartBadgeCount();
    expect(cartBadge).toBe('1');

    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.waitForPageLoad();

    // Act - Fill checkout info
    await checkoutPage.fillInfo(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.postalCode
    );
    await checkoutPage.finish();

    // Assert
    const successMessage = await checkoutPage.getSuccessMessage();
    expect(successMessage).toContain('Thank you');
  });

  /**
   * Test 2: Visual user adds multiple items and checks out
   * 
   * Flow:
   * 1. Login with visual_user
   * 2. Add multiple items
   * 3. Verify item count in cart
   * 4. Complete checkout with alternate address
   * 
   * @tags @order, @visual
   */
  test('Visual user adds multiple items and checks out @order @visual', async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
    testData,
  }) => {
    // Arrange
    const testUser = testData.testUsers.visual;
    const shoppingList = testData.shoppingLists.standardOrder;
    const checkoutInfo = testData.checkoutData.alternateCheckout;

    // Act - Login
    await loginPage.goto();
    await loginPage.login(testUser.username, testUser.password);
    await inventoryPage.waitForPageLoad();

    // Act - Add multiple items
    for (const itemId of shoppingList) {
      await inventoryPage.addToCart(itemId);
    }

    // Assert - Cart count
    const cartBadge = await inventoryPage.getCartBadgeCount();
    expect(parseInt(cartBadge)).toBe(shoppingList.length);

    // Act - Checkout
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillInfo(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.postalCode
    );
    await checkoutPage.finish();

    // Assert
    const successMessage = await checkoutPage.getSuccessMessage();
    expect(successMessage).toBeTruthy();
  });

  /**
   * Test 3: Error user completes purchase flow
   * 
   * Flow:
   * 1. Login with error_user
   * 2. Add item to cart
   * 3. Complete checkout
   * 4. Verify completion
   * 
   * @tags @order, @error-user
   */
  test('Error user completes purchase flow @order @error-user', async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
    testData,
  }) => {
    // Arrange
    const testUser = testData.testUsers.error;
    const checkoutInfo = testData.checkoutData.validCheckout;

    // Act - Login
    await loginPage.goto();
    await loginPage.login(testUser.username, testUser.password);

    // Act - Complete order
    await inventoryPage.addToCart('6');
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillInfo(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.postalCode
    );
    await checkoutPage.finish();

    // Assert
    const successMessage = await checkoutPage.getSuccessMessage();
    expect(successMessage).toContain('Thank you');
  });

  // ========== QUICK TESTS ==========

  /**
   * Test 4: User can add single item to cart
   * 
   * Flow:
   * 1. Login
   * 2. Add single item
   * 3. Verify cart badge count
   * 
   * @tags @smoke, @quick
   */
  test('User can add single item to cart @smoke @quick', async ({
    loginPage,
    inventoryPage,
    testData,
  }) => {
    // Arrange
    const testUser = testData.testUsers.standard;

    // Act
    await loginPage.goto();
    await loginPage.login(testUser.username, testUser.password);
    await inventoryPage.waitForPageLoad();
    await inventoryPage.addToCart('1');

    // Assert
    const cartBadge = await inventoryPage.getCartBadgeCount();
    expect(cartBadge).toBe('1');
  });

  // ========== VALIDATION TESTS ==========

  /**
   * Test 5: Invalid credentials display error message
   * 
   * Flow:
   * 1. Login with invalid credentials
   * 2. Verify error message appears
   * 
   * @tags @validation, @negative
   */
  test('Invalid credentials display error message @validation @negative', async ({
    loginPage,
  }) => {
    // Arrange
    const invalidUsername = 'invalid_user';
    const invalidPassword = 'wrong_password';

    // Act
    await loginPage.goto();
    await loginPage.login(invalidUsername, invalidPassword);

    // Assert
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
    expect(errorMessage).toContain('Username and password');
  });

  /**
   * Test 6: Locked out user receives error message
   * 
   * Flow:
   * 1. Login with locked_out_user
   * 2. Verify error message about account lock
   * 
   * @tags @validation, @negative, @locked-out
   */
  test('Locked out user receives error message @validation @negative @locked-out', async ({
    loginPage,
  }) => {
    // Arrange
    const testUser = testData.testUsers.lockedOut;

    // Act
    await loginPage.goto();
    await loginPage.login(testUser.username, testUser.password);

    // Assert
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
    expect(errorMessage).toContain('locked out');
  });
});

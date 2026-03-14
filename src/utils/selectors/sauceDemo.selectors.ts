/**
 * Centralized selectors for SauceDemo application
 * Single source of truth for all CSS selectors
 * 
 * Benefits:
 * - Easy to refactor when UI changes
 * - Type-safe selector keys
 * - Clear organization by page/section
 * - Reusable across multiple tests
 */

/**
 * SauceDemo application selectors
 * All selectors are data-test attributes for stability
 */
export const SauceDemoSelectors = {
  /** Login page selectors */
  login: {
    usernameInput: '[data-test="username"]',
    passwordInput: '[data-test="password"]',
    loginButton: '[data-test="login-button"]',
    errorMessage: '[data-test="error"]',
    credentialsInfo: '[data-test="login-credentials"]',
  },

  /** Inventory/Products page selectors */
  inventory: {
    pageContainer: '[data-test="inventory-container"]',
    cartLink: '[data-test="shopping-cart-link"]',
    cartBadge: '[data-test="shopping-cart-badge"]',
    sortContainer: '[data-test="product-sort-container"]',
    inventorylist: '[data-test="inventory-list"]',
    inventoryItem: '[data-test="inventory-item"]',
    inventoryItemName: '[data-test="inventory-item-name"]',
    inventoryItemPrice: '[data-test="inventory-item-price"]',
    inventoryItemDesc: '[data-test="inventory-item-description"]',
    addToCartButton: (itemId: string) =>
      `[data-test="add-to-cart-${itemId}"]`,
  },

  /** Cart page selectors */
  cart: {
    cartContainer: '[data-test="cart-contents-container"]',
    cartItem: '[data-test="cart-item"]',
    cartItemName: '[data-test="inventory-item-name"]',
    cartItemPrice: '[data-test="inventory-item-price"]',
    continueShoppingButton: '[data-test="continue-shopping"]',
    checkoutButton: '[data-test="checkout"]',
  },

  /** Checkout page selectors */
  checkout: {
    checkoutContainer: '[data-test="checkout_info_container"]',
    firstNameInput: '[data-test="firstName"]',
    lastNameInput: '[data-test="lastName"]',
    postalCodeInput: '[data-test="postalCode"]',
    continueButton: '[data-test="continue"]',
    cancelButton: '[data-test="cancel"]',
    overviewLink: '[data-test="checkout-summary-container"]',
    finishButton: '[data-test="finish"]',
    successMessage: '[data-test="complete-header"]',
  },

  /** Menu/Header selectors */
  menu: {
    menuButton: 'button[id="react-burger-menu-btn"]',
    menuContainer: '[class="bm-menu"]',
    logoutLink: '[data-test="logout-sidebar-link"]',
    allItemsLink: '[data-test="inventory-sidebar-link"]',
    aboutLink: '[data-test="about-sidebar-link"]',
    resetLink: '[data-test="reset-sidebar-link"]',
  },

  /** Common selectors */
  common: {
    pageTitle: '[data-test="title"]',
    primaryHeader: '[data-test="primary-header"]',
    body: 'body',
  },
} as const;

/**
 * Type-safe selector retrieval
 * Ensures selector keys are valid at compile time
 * @param section - Section of selectors
 * @param key - Key within section
 * @example
 * const selector = getSelector('login', 'usernameInput');
 */
export function getSelector<T extends keyof typeof SauceDemoSelectors>(
  section: T,
  key: keyof typeof SauceDemoSelectors[T]
): string {
  return (SauceDemoSelectors[section][key] as any) || '';
}

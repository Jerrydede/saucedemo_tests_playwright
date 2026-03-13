import { Page, Locator } from '@playwright/test';

/**
 * Represents the Shopping Cart Page.
 * Used to verify added items and proceed to checkout.
 */
export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Locates all item rows in the cart
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  /**
   * Verifies if a specific product name exists in the cart list.
   * @param productName - The visible name of the product.
   */
  async isProductInCart(productName: string) {
    return this.page.locator(`.inventory_item_name:has-text("${productName}")`);
  }
}
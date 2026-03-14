/**
 * Custom error for page object operations
 * Provides structured error information for debugging
 */

/**
 * Error thrown when a page object operation fails
 */
export class PageObjectError extends Error {
  /**
   * Create PageObjectError
   * @param pageName - Name of the page object
   * @param action - Name of the action that failed
   * @param originalError - The original error that was thrown
   * @param context - Additional context about the failure
   */
  constructor(
    public readonly pageName: string,
    public readonly action: string,
    public readonly originalError: Error,
    public readonly context?: Record<string, any>
  ) {
    super(
      `${pageName}.${action}() failed: ${originalError.message}`
    );

    // Maintain prototype chain for instanceof checks
    Object.setPrototypeOf(this, PageObjectError.prototype);

    this.name = 'PageObjectError';
  }

  /**
   * Get detailed error information
   */
  getDetails(): string {
    const details = [
      `Page: ${this.pageName}`,
      `Action: ${this.action}`,
      `Message: ${this.originalError.message}`,
      `Stack: ${this.originalError.stack}`,
    ];

    if (this.context) {
      details.push(`Context: ${JSON.stringify(this.context, null, 2)}`);
    }

    return details.join('\n');
  }
}

/**
 * Error thrown when selector is not found
 */
export class SelectorNotFoundError extends PageObjectError {
  constructor(
    pageName: string,
    selector: string,
    originalError: Error
  ) {
    super(pageName, `findElement[${selector}]`, originalError, {
      selector,
    });
    this.name = 'SelectorNotFoundError';
    Object.setPrototypeOf(this, SelectorNotFoundError.prototype);
  }
}

/**
 * Error thrown when timeout is exceeded
 */
export class TimeoutError extends PageObjectError {
  constructor(
    pageName: string,
    action: string,
    timeoutMs: number,
    originalError: Error
  ) {
    super(pageName, action, originalError, { timeout: timeoutMs });
    this.name = 'TimeoutError';
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

/**
 * Error thrown for navigation failures
 */
export class NavigationError extends PageObjectError {
  constructor(
    pageName: string,
    url: string,
    originalError: Error
  ) {
    super(pageName, 'goto', originalError, { url });
    this.name = 'NavigationError';
    Object.setPrototypeOf(this, NavigationError.prototype);
  }
}

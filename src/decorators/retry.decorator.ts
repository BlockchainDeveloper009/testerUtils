/**
 * Decorator for automatic retry logic
 * Retries failed method calls with exponential backoff
 */

import { logger } from '../lib/logger';

/**
 * Retry decorator with exponential backoff
 * @param maxAttempts - Maximum number of retry attempts
 * @param delayMs - Initial delay in milliseconds
 * @param backoffMultiplier - Multiplier for exponential backoff
 */
export function Retry(
  maxAttempts: number = 3,
  delayMs: number = 1000,
  backoffMultiplier: number = 1.5
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let lastError: Error | null = null;
      let delay = delayMs;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          logger.debug(
            `[${target.constructor.name}.${propertyKey}] Attempt ${attempt}/${maxAttempts}`,
            { module: 'Decorator:Retry' }
          );
          return await originalMethod.apply(this, args);
        } catch (error) {
          lastError = error as Error;
          logger.warn(
            `[${target.constructor.name}.${propertyKey}] Attempt ${attempt} failed: ${lastError.message}`,
            { module: 'Decorator:Retry' }
          );

          if (attempt === maxAttempts) {
            logger.error(
              `[${target.constructor.name}.${propertyKey}] All ${maxAttempts} attempts failed`,
              lastError,
              { module: 'Decorator:Retry' }
            );
            break;
          }

          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= backoffMultiplier;
        }
      }

      throw lastError;
    };

    return descriptor;
  };
}

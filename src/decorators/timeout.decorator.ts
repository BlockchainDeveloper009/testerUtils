/**
 * Decorator for timeout enforcement
 * Fails method if execution exceeds timeout
 */

import { logger } from '../lib/logger';

/**
 * Timeout decorator
 * @param timeoutMs - Timeout in milliseconds
 */
export function Timeout(timeoutMs: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const methodName = `${target.constructor.name}.${propertyKey}`;

      return Promise.race([
        originalMethod.apply(this, args),
        new Promise((_, reject) =>
          setTimeout(() => {
            const error = new Error(
              `${methodName} exceeded timeout of ${timeoutMs}ms`
            );
            logger.error(`[TIMEOUT] ${methodName}`, error, {
              module: 'Decorator:Timeout',
              timeout: timeoutMs,
            });
            reject(error);
          }, timeoutMs)
        ),
      ]);
    };

    return descriptor;
  };
}

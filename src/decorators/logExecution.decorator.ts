/**
 * Decorator for method execution logging
 * Logs method entry and exit with timing
 */

import { logger } from '../lib/logger';

/**
 * Log method execution with timing
 * @param logLevel - Log level for method logging
 */
export function LogExecution(logLevel: 'debug' | 'info' = 'debug') {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const methodName = `${target.constructor.name}.${propertyKey}`;
      const startTime = performance.now();

      try {
        logger[logLevel](`→ [START] ${methodName}`, { module: 'Decorator:LogExecution' });

        const result = await originalMethod.apply(this, args);

        const duration = performance.now() - startTime;
        logger[logLevel](
          `← [SUCCESS] ${methodName} (${duration.toFixed(2)}ms)`,
          { module: 'Decorator:LogExecution' },
          { duration }
        );

        return result;
      } catch (error) {
        const duration = performance.now() - startTime;
        logger.error(
          `← [FAILED] ${methodName} (${duration.toFixed(2)}ms)`,
          error as Error,
          { module: 'Decorator:LogExecution' }
        );
        throw error;
      }
    };

    return descriptor;
  };
}

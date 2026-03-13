/**
 * Test data helper with structured logging support
 */

import { logger, LogContext } from './logger';

export interface TestDataConfig {
  basePath?: string;
  clearOnInit?: boolean;
}

export class TestDataHelper {
  private data: Map<string, any> = new Map();
  private basePath: string;
  private clearOnInit: boolean;

  constructor(config?: TestDataConfig) {
    this.basePath = config?.basePath || 'test-data';
    this.clearOnInit = config?.clearOnInit || false;

    if (this.clearOnInit) {
      this.clear();
    }

    logger.debug(`TestDataHelper initialized`, { 
      module: 'TestDataHelper',
      basePath: this.basePath,
    });
  }

  /**
   * Store test data
   */
  set(key: string, value: any, context?: LogContext): void {
    this.data.set(key, value);
    logger.debug(`Test data stored`, { 
      ...context,
      module: 'TestDataHelper',
      key,
      type: typeof value,
    });
  }

  /**
   * Retrieve test data
   */
  get<T = any>(key: string, context?: LogContext): T | undefined {
    const value = this.data.get(key) as T;
    
    if (!value) {
      logger.warn(`Test data not found`, { 
        ...context,
        module: 'TestDataHelper',
        key,
      });
      return undefined;
    }

    logger.debug(`Test data retrieved`, { 
      ...context,
      module: 'TestDataHelper',
      key,
    });

    return value;
  }

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    return this.data.has(key);
  }

  /**
   * Delete test data
   */
  delete(key: string, context?: LogContext): boolean {
    const existed = this.data.has(key);

    if (existed) {
      this.data.delete(key);
      logger.debug(`Test data deleted`, { 
        ...context,
        module: 'TestDataHelper',
        key,
      });
    } else {
      logger.warn(`Test data key not found for deletion`, { 
        ...context,
        module: 'TestDataHelper',
        key,
      });
    }

    return existed;
  }

  /**
   * Clear all test data
   */
  clear(context?: LogContext): void {
    const count = this.data.size;
    this.data.clear();
    logger.info(`Test data cleared`, { 
      ...context,
      module: 'TestDataHelper',
      clearedCount: count,
    });
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    return Array.from(this.data.keys());
  }

  /**
   * Get all data
   */
  getAll(): Record<string, any> {
    const all: Record<string, any> = {};
    this.data.forEach((value, key) => {
      all[key] = value;
    });
    return all;
  }

  /**
   * Get size
   */
  size(): number {
    return this.data.size;
  }

  /**
   * Merge data sets
   */
  merge(other: Record<string, any>, context?: LogContext): void {
    Object.entries(other).forEach(([key, value]) => {
      this.set(key, value, context);
    });
    logger.info(`Test data merged`, { 
      ...context,
      module: 'TestDataHelper',
      mergedKeys: Object.keys(other).length,
    });
  }

  /**
   * Create test data from template
   */
  static createFromTemplate<T extends Record<string, any>>(
    template: T,
    overrides?: Partial<T>,
    context?: LogContext
  ): T {
    const data = { ...template, ...overrides };
    logger.debug(`Test data created from template`, { 
      ...context,
      module: 'TestDataHelper',
      template: template.constructor.name,
      overridesCount: overrides ? Object.keys(overrides).length : 0,
    });
    return data;
  }

  /**
   * Generate test data with counter
   */
  static generateWithCounter(
    prefix: string,
    counter: number,
    template?: Record<string, any>,
    context?: LogContext
  ): Record<string, any> {
    const data = {
      ...template,
      id: `${prefix}_${counter}`,
      timestamp: new Date().toISOString(),
    };

    logger.debug(`Test data generated with counter`, { 
      ...context,
      module: 'TestDataHelper',
      prefix,
      counter,
    });

    return data;
  }
}

export default TestDataHelper;

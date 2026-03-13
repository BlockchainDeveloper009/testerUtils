/**
 * Example: Test Data Management with structured logging
 */

import { test, expect } from '@playwright/test';
import { logger, TestDataHelper, ApiHelper } from '@lib/index';

test.describe('Test Data Management Examples', () => {
  let testData: TestDataHelper;
  let api: ApiHelper;

  test.beforeAll(() => {
    logger.configure({
      level: 'DEBUG',
      enableConsole: true,
    });

    testData = new TestDataHelper({ basePath: 'test-data' });
    api = new ApiHelper('https://jsonplaceholder.typicode.com');
  });

  test('example 1: basic data storage and retrieval', async () => {
    const testName = 'example 1: basic data storage';
    logger.logTestStep(testName, 'STARTED', { testName });

    try {
      // Store test data
      testData.set('user_1_id', 1, { testName });
      testData.set('user_1_name', 'John Doe', { testName });
      testData.set('user_1_email', 'john@example.com', { testName });

      logger.info('Stored user data', { testName }, { 
        dataSize: testData.size(),
      });

      // Retrieve test data
      const userId = testData.get<number>('user_1_id', { testName });
      const userName = testData.get<string>('user_1_name', { testName });

      logger.info('Retrieved user data', { testName }, { userId, userName });

      expect(userId).toBe(1);
      expect(userName).toBe('John Doe');

      logger.logTestStep(testName, 'PASSED', { testName });
    } catch (error) {
      logger.error('Test failed', error as Error, { testName });
      logger.logTestStep(testName, 'FAILED', { testName });
      throw error;
    }
  });

  test('example 2: template-based data generation', async () => {
    const testName = 'example 2: template-based data';
    logger.logTestStep(testName, 'STARTED', { testName });

    try {
      // Define template
      const userTemplate = {
        name: 'Default User',
        email: 'default@example.com',
        age: 30,
        active: true,
      };

      // Create data from template with overrides
      const testUser = TestDataHelper.createFromTemplate(
        userTemplate,
        { name: 'Test User', age: 25 },
        { testName }
      );

      logger.info('Test user created from template', { testName }, testUser);

      testData.set('test_user', testUser, { testName });

      expect(testUser.name).toBe('Test User');
      expect(testUser.age).toBe(25);
      expect(testUser.email).toBe('default@example.com'); // From template

      logger.logTestStep(testName, 'PASSED', { testName });
    } catch (error) {
      logger.error('Test failed', error as Error, { testName });
      logger.logTestStep(testName, 'FAILED', { testName });
      throw error;
    }
  });

  test('example 3: generate data with counter', async () => {
    const testName = 'example 3: generate with counter';
    logger.logTestStep(testName, 'STARTED', { testName });

    try {
      // Generate multiple test items
      const items = [];
      for (let i = 1; i <= 3; i++) {
        const item = TestDataHelper.generateWithCounter(
          'item',
          i,
          { type: 'test', value: `item_${i}` },
          { testName, iteration: i }
        );
        items.push(item);
        testData.set(`item_${i}`, item, { testName });
      }

      logger.info('Generated items with counters', { testName }, { 
        count: items.length,
        items: items.map(i => i.id),
      });

      expect(testData.size()).toBe(3);
      expect(testData.get('item_1').id).toBe('item_1');

      logger.logTestStep(testName, 'PASSED', { testName });
    } catch (error) {
      logger.error('Test failed', error as Error, { testName });
      logger.logTestStep(testName, 'FAILED', { testName });
      throw error;
    }
  });

  test('example 4: API response data persistence', async () => {
    const testName = 'example 4: API response persistence';
    logger.logTestStep(testName, 'STARTED', { testName });

    try {
      // Fetch API data
      logger.info('Fetching user data from API', { testName });
      const response = await api.get('/users/1', { ctx: { testName } });

      // Store response data
      testData.set('api_user', response.data, { testName, source: 'api' });
      testData.set('api_user_response_time', response.duration, { testName });

      logger.info('API response stored', { testName }, { 
        userId: response.data.id,
        responseTime: response.duration,
      });

      // Retrieve and verify
      const storedUser = testData.get('api_user', { testName });
      expect(storedUser).toBeDefined();
      expect(storedUser.id).toBe(1);

      logger.logTestStep(testName, 'PASSED', { testName });
    } catch (error) {
      logger.error('Test failed', error as Error, { testName });
      logger.logTestStep(testName, 'FAILED', { testName });
      throw error;
    }
  });

  test('example 5: data merging and bulk operations', async () => {
    const testName = 'example 5: data merging';
    logger.logTestStep(testName, 'STARTED', { testName });

    try {
      // Create new test data instance for bulk merge
      const newData = {
        config_env: 'test',
        config_timeout: 5000,
        config_retries: 3,
        config_debug: true,
      };

      logger.info('Merging configuration data', { testName });
      testData.merge(newData, { testName, operation: 'merge' });

      logger.info('Test data after merge', { testName }, { 
        totalKeys: testData.size(),
        keys: testData.keys(),
      });

      expect(testData.has('config_env')).toBe(true);
      expect(testData.get('config_timeout')).toBe(5000);

      logger.logTestStep(testName, 'PASSED', { testName });
    } catch (error) {
      logger.error('Test failed', error as Error, { testName });
      logger.logTestStep(testName, 'FAILED', { testName });
      throw error;
    }
  });

  test('example 6: data inspection and cleanup', async () => {
    const testName = 'example 6: data inspection';
    logger.logTestStep(testName, 'STARTED', { testName });

    try {
      // Inspect current data
      const allData = testData.getAll();
      const keys = testData.keys();
      const size = testData.size();

      logger.info('Test data inspection', { testName }, { 
        totalKeys: size,
        keys: keys.slice(0, 5), // Show first 5
      });

      logger.debug('Full data snapshot', { testName }, allData);

      // Delete specific items
      testData.delete('user_1_id', { testName });
      testData.delete('user_1_name', { testName });

      logger.info('Cleaned up user data', { testName }, { 
        keysAfterCleanup: testData.size(),
      });

      // Clear all
      const beforeClear = testData.size();
      testData.clear({ testName });

      logger.info('All test data cleared', { testName }, { 
        clearedCount: beforeClear,
      });

      expect(testData.size()).toBe(0);

      logger.logTestStep(testName, 'PASSED', { testName });
    } catch (error) {
      logger.error('Test failed', error as Error, { testName });
      logger.logTestStep(testName, 'FAILED', { testName });
      throw error;
    }
  });

  test.afterAll(() => {
    const logs = logger.getHistory();
    logger.info('Test data suite completed', { module: 'TestDataSuite' }, { 
      totalLogs: logs.length,
    });

    // Export logs for analysis
    const logsJson = logger.exportAsJson();
    logger.debug('Logs exported', { module: 'TestDataSuite' }, { 
      sizeBytes: logsJson.length,
    });
  });
});

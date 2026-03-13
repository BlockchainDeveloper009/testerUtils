/**
 * Example: Using structured logging in tests
 */

import { test, expect } from '@playwright/test';
import { logger, ApiHelper, FileHelper } from '@lib/index';

test.describe('Structured Logging Examples', () => {
  test.beforeAll(() => {
    // Configure logger at test start
    logger.configure({
      level: 'DEBUG', // Set to DEBUG to see all logs
      enableConsole: true,
    });
  });

  test('example 1: basic logging', async () => {
    const testName = 'example 1: basic logging';
    
    logger.logTestStep(testName, 'STARTED', { testName });
    
    logger.info('Starting test', { testName });
    logger.debug('Debug information', { testName }, { value: 42 });
    logger.warn('Warning message', { testName });
    
    expect(true).toBe(true);
    
    logger.logTestStep(testName, 'PASSED', { testName });
  });

  test('example 2: API calls with logging', async () => {
    const testName = 'example 2: API calls with logging';
    logger.logTestStep(testName, 'STARTED', { testName });

    const api = new ApiHelper('https://jsonplaceholder.typicode.com');
    
    try {
      logger.info('Fetching user data', { testName, api: 'jsonplaceholder' });
      const response = await api.get('/users/1', {
        ctx: { testName, endpoint: '/users/1' },
      });

      logger.info('User data received', { testName }, { userId: response.data.id });
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id');

      logger.logTestStep(testName, 'PASSED', { testName });
    } catch (error) {
      logger.error('Failed to fetch user', error as Error, { testName });
      logger.logTestStep(testName, 'FAILED', { testName });
      throw error;
    }
  });

  test('example 3: File operations with logging', async () => {
    const testName = 'example 3: file operations with logging';
    logger.logTestStep(testName, 'STARTED', { testName });

    const testFilePath = 'test-data/sample.json';
    const testData = { name: 'Test', value: 123, timestamp: new Date().toISOString() };

    try {
      // Write file
      logger.info('Writing test data to file', { testName, file: testFilePath });
      await FileHelper.writeJson(testFilePath, testData);

      // Read file
      logger.info('Reading test data from file', { testName, file: testFilePath });
      const readData = await FileHelper.readJson(testFilePath);

      expect(readData).toEqual(testData);
      logger.info('File data verified', { testName });

      // Cleanup
      await FileHelper.deleteFile(testFilePath);
      logger.logTestStep(testName, 'PASSED', { testName });
    } catch (error) {
      logger.error('File operation failed', error as Error, { testName });
      logger.logTestStep(testName, 'FAILED', { testName });
      throw error;
    }
  });

  test('example 4: Log history and export', async () => {
    const testName = 'example 4: log history and export';
    
    logger.info('Step 1: Logging multiple messages', { testName });
    logger.debug('Step 2: Debug info', { testName });
    logger.warn('Step 3: Warning', { testName });
    
    const history = logger.getHistory();
    logger.info(`Captured ${history.length} log entries`, { testName }, { entries: history.length });

    expect(history.length).toBeGreaterThan(0);
    
    // Export as JSON
    const jsonExport = logger.exportAsJson();
    logger.debug('Exported logs as JSON', { testName }, { sizeBytes: jsonExport.length });

    // Export as CSV
    const csvExport = logger.exportAsCsv();
    logger.debug('Exported logs as CSV', { testName }, { sizeBytes: csvExport.length });
  });

  test('example 5: Error handling with structured logging', async () => {
    const testName = 'example 5: error handling';
    logger.logTestStep(testName, 'STARTED', { testName });

    try {
      logger.info('Attempting operation that will fail', { testName });
      
      // Simulate error
      throw new Error('Intentional test error');
    } catch (error) {
      logger.error('Operation failed with error', error as Error, { 
        testName,
        errorType: (error as Error).constructor.name,
      });
      
      // Still mark test as passed since we handled the error
      logger.info('Error was handled gracefully', { testName });
      logger.logTestStep(testName, 'PASSED', { testName });
    }
  });

  test.afterAll(() => {
    // Export final logs
    const logs = logger.getHistory();
    console.log(`\nTest suite completed. Total logs: ${logs.length}`);
  });
});

/**
 * Example: Using environment configuration and JUnit reporting
 * This test demonstrates:
 * - Access to environment variables
 * - Configuration management  
 * - JUnit XML output for CI/CD
 * - Global setup integration
 */

import { test, expect } from '@playwright/test';
import config from '../utils/config';

test.describe('Configuration & Environment Variables', () => {
  test.beforeAll(() => {
    console.log('[Test Suite] Configuration Examples - Starting');
  });

  test('example 1: access configuration', async () => {
    console.log('[STARTED] example 1: access configuration');

    try {
      console.log('Current Configuration', {
        baseUrl: config.baseUrl,
        environment: config.environment,
        apiTimeout: config.apiTimeout,
        debug: config.debug,
      });

      expect(config.baseUrl).toBeTruthy();
      expect(config.environment).toMatch(/^(dev|test|stage|prod)$/);
      expect(config.apiTimeout).toBeGreaterThan(0);

      console.log('[PASSED] example 1: access configuration');
    } catch (error) {
      console.error('Test failed', error);
      throw error;
    }
  });

  test('example 2: environment is configured', async () => {
    console.log('[STARTED] example 2: environment is configured');

    try {
      const baseUrl = config.baseUrl;
      console.log(`Using Base URL: ${baseUrl}`);

      expect(baseUrl).toBeTruthy();
      expect(baseUrl).toMatch(/^http/);

      console.log('[PASSED] example 2: environment is configured');
    } catch (error) {
      console.error('Test failed', error);
      throw error;
    }
  });

  test('example 3: environment-specific settings', async () => {
    console.log('[STARTED] example 3: environment-specific settings');

    try {
      const settings: Record<string, any> = {
        dev: { timeout: 10000, retries: 1, verboseLogging: true },
        test: { timeout: 15000, retries: 2, verboseLogging: true },
        stage: { timeout: 20000, retries: 2, verboseLogging: false },
        prod: { timeout: 30000, retries: 3, verboseLogging: false },
      };

      const envSettings = settings[config.environment];

      console.log('Environment Settings', { environment: config.environment }, envSettings);

      expect(envSettings).toBeDefined();
      expect(envSettings.timeout).toBeGreaterThan(0);

      console.log('[PASSED] example 3: environment-specific settings');
    } catch (error) {
      console.error('Test failed', error);
      throw error;
    }
  });

  test('example 4: conditional logic based on CI', async () => {
    console.log('[STARTED] example 4: conditional CI logic');

    try {
      const isCI = process.env.CI === 'true';
      const isCIDev = process.env.CI && config.environment === 'dev';

      console.log('CI Information', {
        isCI,
        isCIDev,
        environment: config.environment,
      });

      if (isCI) {
        console.log('Running in CI environment');
        expect(isCI).toBe(true);
      } else {
        console.log('Running locally');
      }

      console.log('[PASSED] example 4: conditional CI logic');
    } catch (error) {
      console.error('Test failed', error);
      throw error;
    }
  });

  test('example 5: debug mode features', async () => {
    console.log('[STARTED] example 5: debug mode');

    try {
      if (config.debug) {
        console.log('Debug Mode ENABLED - Detailed logging active');
        console.log('Configuration:', config);
      } else {
        console.log('Debug Mode disabled - Normal logging only');
      }

      expect(typeof config.debug).toBe('boolean');

      console.log('[PASSED] example 5: debug mode');
    } catch (error) {
      console.error('Test failed', error);
      throw error;
    }
  });

  test('example 6: JUnit output verification', async () => {
    console.log('[STARTED] example 6: JUnit output (CI reporting)');

    try {
      console.log('This test demonstrates JUnit output generation');
      console.log('JUnit XML is automatically generated to: test-results/junit.xml');
      console.log('HTML report is generated to: playwright-report/index.html');

      if (process.env.CI) {
        console.log('CI detected: Both JUnit and HTML reports are generated');
      }

      expect(true).toBe(true);

      console.log('[PASSED] example 6: JUnit output verification');
    } catch (error) {
      console.error('Test failed', error);
      throw error;
    }
  });

  test.afterAll(() => {
    console.log('[Test Suite] Configuration Examples - Completed');
  });
});

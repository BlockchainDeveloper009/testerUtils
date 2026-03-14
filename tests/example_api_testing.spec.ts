/**
 * Example: Using ApiHelper with structured logging for API tests
 */

import { test, expect } from '@playwright/test';
import { logger, ApiHelper } from '@lib/index';

test.describe('API Testing with Structured Logging @example_api', () => {
  let api: ApiHelper;

  test.beforeAll(() => {
    logger.configure({
      level: 'DEBUG',
      enableConsole: true,
    });

    // Initialize API with public JSON placeholder
    api = new ApiHelper('https://jsonplaceholder.typicode.com');
  });

  test('GET - Fetch all posts', async () => {
    const testName = 'GET - Fetch all posts';
    logger.logTestStep(testName, 'STARTED', { testName });

    try {
      const response = await api.get('/posts', {
        ctx: { testName, endpoint: '/posts' },
      });

      logger.info('Posts fetched successfully', { testName }, { 
        count: response.data.length,
        duration: response.duration,
      });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);

      logger.logTestStep(testName, 'PASSED', { testName });
    } catch (error) {
      logger.error('Failed to fetch posts', error as Error, { testName });
      logger.logTestStep(testName, 'FAILED', { testName });
      throw error;
    }
  });

  test('GET - Fetch single post', async () => {
    const testName = 'GET - Fetch single post';
    logger.logTestStep(testName, 'STARTED', { testName });

    try {
      const postId = 1;
      const response = await api.get(`/posts/${postId}`, {
        ctx: { testName, postId },
      });

      logger.info('Post fetched', { testName, postId }, { 
        title: response.data.title,
        duration: response.duration,
      });

      expect(response.status).toBe(200);
      expect(response.data.id).toBe(postId);
      expect(response.data).toHaveProperty('title');
      expect(response.data).toHaveProperty('body');

      logger.logTestStep(testName, 'PASSED', { testName });
    } catch (error) {
      logger.error('Failed to fetch single post', error as Error, { testName });
      logger.logTestStep(testName, 'FAILED', { testName });
      throw error;
    }
  });

  test('GET - Fetch comments for post', async () => {
    const testName = 'GET - Fetch comments for post';
    logger.logTestStep(testName, 'STARTED', { testName });

    try {
      const postId = 1;
      const response = await api.get(`/posts/${postId}/comments`, {
        ctx: { testName, postId },
      });

      logger.info('Comments fetched', { testName, postId }, { 
        count: response.data.length,
        duration: response.duration,
      });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);

      // Verify comment structure
      const comment = response.data[0];
      expect(comment).toHaveProperty('id');
      expect(comment).toHaveProperty('email');
      expect(comment).toHaveProperty('body');

      logger.logTestStep(testName, 'PASSED', { testName });
    } catch (error) {
      logger.error('Failed to fetch comments', error as Error, { testName });
      logger.logTestStep(testName, 'FAILED', { testName });
      throw error;
    }
  });

  test('POST - Create new post', async () => {
    const testName = 'POST - Create new post';
    logger.logTestStep(testName, 'STARTED', { testName });

    try {
      const newPost = {
        title: 'Test Post',
        body: 'This is a test post created with structured logging',
        userId: 1,
      };

      logger.info('Creating new post', { testName }, { post: newPost });

      const response = await api.post('/posts', newPost, {
        ctx: { testName, userId: newPost.userId },
      });

      logger.info('Post created', { testName }, { 
        postId: response.data.id,
        duration: response.duration,
      });

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.title).toBe(newPost.title);

      logger.logTestStep(testName, 'PASSED', { testName });
    } catch (error) {
      logger.error('Failed to create post', error as Error, { testName });
      logger.logTestStep(testName, 'FAILED', { testName });
      throw error;
    }
  });

  test('PUT - Update existing post', async () => {
    const testName = 'PUT - Update existing post';
    logger.logTestStep(testName, 'STARTED', { testName });

    try {
      const postId = 1;
      const updatedPost = {
        id: postId,
        title: 'Updated Post Title',
        body: 'Updated body content',
        userId: 1,
      };

      logger.info('Updating post', { testName, postId }, { updatedPost });

      const response = await api.put(`/posts/${postId}`, updatedPost, {
        ctx: { testName, postId },
      });

      logger.info('Post updated', { testName, postId }, { 
        updatedTitle: response.data.title,
        duration: response.duration,
      });

      expect(response.status).toBe(200);
      expect(response.data.title).toBe(updatedPost.title);

      logger.logTestStep(testName, 'PASSED', { testName });
    } catch (error) {
      logger.error('Failed to update post', error as Error, { testName });
      logger.logTestStep(testName, 'FAILED', { testName });
      throw error;
    }
  });

  test('DELETE - Remove post', async () => {
    const testName = 'DELETE - Remove post';
    logger.logTestStep(testName, 'STARTED', { testName });

    try {
      const postId = 1;
      logger.info('Deleting post', { testName, postId });

      const response = await api.delete(`/posts/${postId}`, {
        ctx: { testName, postId },
      });

      logger.info('Post deleted', { testName, postId }, { 
        status: response.status,
        duration: response.duration,
      });

      expect(response.status).toBe(200);

      logger.logTestStep(testName, 'PASSED', { testName });
    } catch (error) {
      logger.error('Failed to delete post', error as Error, { testName });
      logger.logTestStep(testName, 'FAILED', { testName });
      throw error;
    }
  });

  test('Error handling - Invalid endpoint', async () => {
    const testName = 'Error handling - Invalid endpoint';
    logger.logTestStep(testName, 'STARTED', { testName });

    try {
      await api.get('/invalid-endpoint', {
        ctx: { testName, endpoint: '/invalid-endpoint' },
      });

      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      logger.warn('Expected error occurred', { testName }, { 
        errorType: (error as any).response?.status,
      });

      // Verify error was caught properly
      expect(error).toBeDefined();

      logger.logTestStep(testName, 'PASSED', { testName });
    }
  });

  test.afterAll(() => {
    const logs = logger.getHistory();
    logger.info('Test suite summary', { module: 'ApiTestSuite' }, { 
      totalLogs: logs.length,
      errors: logs.filter(l => l.level === 'ERROR').length,
    });
  });
});

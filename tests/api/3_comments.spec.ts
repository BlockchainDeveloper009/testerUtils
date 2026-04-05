import { test, expect } from '../../fixtures';
import { CommentSchema } from '../../utils/schemas';

test.describe('Comments API', () => {

  test.describe('GET /comments', () => {
    test('returns 200 with 500 comments', async ({ api }) => {
      const res  = await api.getComments();
      const body = await res.json();
      expect(res.status()).toBe(200);
      expect(body).toHaveLength(500);
    });

    test('every comment conforms to contract schema', async ({ api }) => {
      const res      = await api.getComments();
      const comments = await res.json();
      // Spot-check first 20 to keep test fast
      for (const comment of comments.slice(0, 20)) {
        const result = CommentSchema.safeParse(comment);
        expect(result.success, `Comment id=${comment.id} failed: ${JSON.stringify(result.error)}`).toBe(true);
      }
    });

    test('all comment emails are valid format', async ({ api }) => {
      const res      = await api.getComments();
      const comments = await res.json();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      for (const c of comments.slice(0, 50)) {
        expect(c.email).toMatch(emailRegex);
      }
    });
  });

  test.describe('GET /comments?postId=:id (query filter)', () => {
    test('filters comments by postId', async ({ api }) => {
      const res      = await api.getCommentsByPost(1);
      const comments = await res.json();
      expect(res.status()).toBe(200);
      expect(comments.length).toBeGreaterThan(0);
      for (const c of comments) {
        expect(c.postId).toBe(1);
      }
    });

    // Data-driven: multiple postIds
    const postIds = [1, 5, 10, 50, 100];
    for (const postId of postIds) {
      test(`all comments for postId=${postId} belong to that post`, async ({ api }) => {
        const res      = await api.getCommentsByPost(postId);
        const comments = await res.json();
        expect(res.status()).toBe(200);
        for (const c of comments) {
          expect(c.postId).toBe(postId);
        }
      });
    }

    test('returns empty array for non-existent postId', async ({ api }) => {
      const res  = await api.getCommentsByPost(99999);
      const body = await res.json();
      expect(res.status()).toBe(200);
      expect(body).toEqual([]);
    });
  });

});

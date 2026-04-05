import { test, expect } from '../../fixtures';
import { PostSchema } from '../../utils/schemas';
import { PostFactory } from '../../test-data/factories';

test.describe('Posts API', () => {

  // ── GET /posts ──────────────────────────────────────────
  test.describe('GET /posts', () => {
    test('returns 200 with 100 posts', async ({ api }) => {
      const res = await api.getPosts();
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body)).toBeTruthy();
      expect(body).toHaveLength(100);
    });

    test('each post conforms to contract schema', async ({ api }) => {
      const res  = await api.getPosts();
      const posts = await res.json();
      for (const post of posts) {
        const result = PostSchema.safeParse(post);
        expect(result.success, `Post id=${post.id} failed schema: ${JSON.stringify(result.error)}`).toBe(true);
      }
    });

    test('returns correct Content-Type header', async ({ api }) => {
      const res = await api.getPosts();
      expect(res.headers()['content-type']).toContain('application/json');
    });
  });

  // ── GET /posts/:id ──────────────────────────────────────
  test.describe('GET /posts/:id', () => {
    test('returns a single post by id', async ({ api }) => {
      const res  = await api.getPost(1);
      const body = await res.json();
      expect(res.status()).toBe(200);
      expect(body.id).toBe(1);
      expect(body).toHaveProperty('title');
      expect(body).toHaveProperty('body');
      expect(body).toHaveProperty('userId');
    });

    test('returns 404 for non-existent post', async ({ api }) => {
      const res = await api.getPost(99999);
      expect(res.status()).toBe(404);
    });

    // Data-driven: spot-check multiple post IDs
    const postIds = [1, 25, 50, 75, 100];
    for (const id of postIds) {
      test(`returns valid schema for post id=${id}`, async ({ api }) => {
        const res  = await api.getPost(id);
        const body = await res.json();
        expect(res.status()).toBe(200);
        expect(PostSchema.safeParse(body).success).toBe(true);
      });
    }
  });

  // ── POST /posts ─────────────────────────────────────────
  test.describe('POST /posts', () => {
    test('creates a new post and returns 201', async ({ api }) => {
      const payload = PostFactory.valid();
      const res  = await api.createPost(payload);
      const body = await res.json();
      expect(res.status()).toBe(201);
      expect(body.id).toBeDefined();
      expect(body.title).toBe(payload.title);
      expect(body.body).toBe(payload.body);
      expect(body.userId).toBe(payload.userId);
    });

    test('response contains auto-generated id', async ({ api }) => {
      const res  = await api.createPost(PostFactory.valid());
      const body = await res.json();
      expect(typeof body.id).toBe('number');
      expect(body.id).toBeGreaterThan(0);
    });

    test('created post reflects sent payload', async ({ api }) => {
      const payload = PostFactory.valid({ title: 'Custom Title', userId: 3 });
      const res  = await api.createPost(payload);
      const body = await res.json();
      expect(body.title).toBe('Custom Title');
      expect(body.userId).toBe(3);
    });
  });

  // ── PUT /posts/:id ──────────────────────────────────────
  test.describe('PUT /posts/:id', () => {
    test('fully replaces a post and returns 200', async ({ api }) => {
      const payload = PostFactory.valid({ title: 'Updated Title' });
      const res  = await api.updatePost(1, payload);
      const body = await res.json();
      expect(res.status()).toBe(200);
      expect(body.title).toBe('Updated Title');
      expect(body.id).toBe(1);
    });
  });

  // ── PATCH /posts/:id ────────────────────────────────────
  test.describe('PATCH /posts/:id', () => {
    test('partially updates a post title', async ({ api }) => {
      const res  = await api.patchPost(1, { title: 'Patched Title' });
      const body = await res.json();
      expect(res.status()).toBe(200);
      expect(body.title).toBe('Patched Title');
    });
  });

  // ── DELETE /posts/:id ───────────────────────────────────
  test.describe('DELETE /posts/:id', () => {
    test('deletes a post and returns 200', async ({ api }) => {
      const res = await api.deletePost(1);
      expect(res.status()).toBe(200);
    });

    test('response body is empty object on delete', async ({ api }) => {
      const res  = await api.deletePost(1);
      const body = await res.json();
      expect(body).toEqual({});
    });
  });

  // ── GET /posts/:id/comments ─────────────────────────────
  test.describe('GET /posts/:id/comments', () => {
    test('returns comments for a post', async ({ api }) => {
      const res  = await api.getPostComments(1);
      const body = await res.json();
      expect(res.status()).toBe(200);
      expect(Array.isArray(body)).toBeTruthy();
      expect(body.length).toBeGreaterThan(0);
    });

    test('all comments belong to the requested post', async ({ api }) => {
      const res      = await api.getPostComments(1);
      const comments = await res.json();
      for (const comment of comments) {
        expect(comment.postId).toBe(1);
      }
    });

    test('each comment has a valid email field', async ({ api }) => {
      const res      = await api.getPostComments(1);
      const comments = await res.json();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      for (const c of comments) {
        expect(c.email).toMatch(emailRegex);
      }
    });
  });

});

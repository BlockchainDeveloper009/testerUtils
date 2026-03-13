import { test, expect } from '../../fixtures';
import { UserSchema } from '../../utils/schemas';

test.describe('Users API', () => {

  test.describe('GET /users', () => {
    test('returns 200 with exactly 10 users', async ({ api }) => {
      const res   = await api.getUsers();
      const users = await res.json();
      expect(res.status()).toBe(200);
      expect(users).toHaveLength(10);
    });

    test('every user conforms to contract schema', async ({ api }) => {
      const res   = await api.getUsers();
      const users = await res.json();
      for (const user of users) {
        const result = UserSchema.safeParse(user);
        expect(result.success, `User id=${user.id} failed: ${JSON.stringify(result.error)}`).toBe(true);
      }
    });

    test('all user emails are unique', async ({ api }) => {
      const res   = await api.getUsers();
      const users = await res.json();
      const emails = users.map((u: any) => u.email);
      const unique = new Set(emails);
      expect(unique.size).toBe(emails.length);
    });

    test('all user usernames are unique', async ({ api }) => {
      const res   = await api.getUsers();
      const users = await res.json();
      const names = users.map((u: any) => u.username);
      const unique = new Set(names);
      expect(unique.size).toBe(names.length);
    });
  });

  test.describe('GET /users/:id', () => {
    test('returns correct user by id', async ({ api }) => {
      const res  = await api.getUser(1);
      const body = await res.json();
      expect(res.status()).toBe(200);
      expect(body.id).toBe(1);
    });

    test('returns 404 for non-existent user', async ({ api }) => {
      const res = await api.getUser(9999);
      expect(res.status()).toBe(404);
    });

    test('user has nested address with geo coordinates', async ({ api }) => {
      const res  = await api.getUser(1);
      const user = await res.json();
      expect(user.address).toHaveProperty('geo');
      expect(user.address.geo).toHaveProperty('lat');
      expect(user.address.geo).toHaveProperty('lng');
    });
  });

  test.describe('GET /users/:id/todos', () => {
    test('returns todos belonging to the user', async ({ api }) => {
      const res   = await api.getUserTodos(1);
      const todos = await res.json();
      expect(res.status()).toBe(200);
      expect(todos.length).toBeGreaterThan(0);
      for (const todo of todos) {
        expect(todo.userId).toBe(1);
      }
    });

    test('todos have completed flag as boolean', async ({ api }) => {
      const res   = await api.getUserTodos(1);
      const todos = await res.json();
      for (const todo of todos) {
        expect(typeof todo.completed).toBe('boolean');
      }
    });
  });

  test.describe('GET /users/:id/posts', () => {
    test('returns posts belonging to the user', async ({ api }) => {
      const res   = await api.getUserPosts(1);
      const posts = await res.json();
      expect(res.status()).toBe(200);
      expect(posts.length).toBeGreaterThan(0);
      for (const post of posts) {
        expect(post.userId).toBe(1);
      }
    });
  });

});

import { test, expect } from '../../fixtures';
import { TodoSchema } from '../../utils/schemas';
import { TodoFactory } from '../../test-data/factories';

test.describe('Todos API', () => {

  test.describe('GET /todos', () => {
    test('returns 200 with 200 todos', async ({ api }) => {
      const res   = await api.getTodos();
      const todos = await res.json();
      expect(res.status()).toBe(200);
      expect(todos).toHaveLength(200);
    });

    test('every todo conforms to contract schema', async ({ api }) => {
      const res   = await api.getTodos();
      const todos = await res.json();
      for (const todo of todos.slice(0, 20)) {
        const result = TodoSchema.safeParse(todo);
        expect(result.success, `Todo id=${todo.id} failed: ${JSON.stringify(result.error)}`).toBe(true);
      }
    });

    test('dataset contains both completed and incomplete todos', async ({ api }) => {
      const res   = await api.getTodos();
      const todos = await res.json();
      const completed   = todos.filter((t: any) => t.completed === true);
      const incomplete  = todos.filter((t: any) => t.completed === false);
      expect(completed.length).toBeGreaterThan(0);
      expect(incomplete.length).toBeGreaterThan(0);
    });

    test('completed rate is reasonable (20-80%)', async ({ api }) => {
      const res   = await api.getTodos();
      const todos = await res.json();
      const rate  = todos.filter((t: any) => t.completed).length / todos.length;
      expect(rate).toBeGreaterThan(0.2);
      expect(rate).toBeLessThan(0.8);
    });
  });

  test.describe('GET /todos/:id', () => {
    test('returns a single todo', async ({ api }) => {
      const res  = await api.getTodo(1);
      const body = await res.json();
      expect(res.status()).toBe(200);
      expect(body.id).toBe(1);
    });

    test('returns 404 for non-existent todo', async ({ api }) => {
      const res = await api.getTodo(9999);
      expect(res.status()).toBe(404);
    });

    // Data-driven: completed vs incomplete
    const cases: Array<{ id: number; expectedCompleted: boolean }> = [
      { id: 1,   expectedCompleted: false },
      { id: 4,   expectedCompleted: true  },
      { id: 9,   expectedCompleted: false },
    ];
    for (const { id, expectedCompleted } of cases) {
      test(`todo id=${id} has completed=${expectedCompleted}`, async ({ api }) => {
        const res  = await api.getTodo(id);
        const body = await res.json();
        expect(body.completed).toBe(expectedCompleted);
      });
    }
  });

  test.describe('POST /todos', () => {
    test('creates an incomplete todo and returns 201', async ({ api }) => {
      const payload = TodoFactory.incomplete();
      const res  = await api.createTodo(payload);
      const body = await res.json();
      expect(res.status()).toBe(201);
      expect(body.id).toBeDefined();
      expect(body.completed).toBe(false);
      expect(body.title).toBe(payload.title);
    });

    test('creates a completed todo', async ({ api }) => {
      const payload = TodoFactory.complete();
      const res  = await api.createTodo(payload);
      const body = await res.json();
      expect(res.status()).toBe(201);
      expect(body.completed).toBe(true);
    });
  });

  test.describe('PUT /todos/:id', () => {
    test('marks a todo as complete', async ({ api }) => {
      const res  = await api.updateTodo(1, { ...TodoFactory.incomplete(), completed: true, id: 1 });
      const body = await res.json();
      expect(res.status()).toBe(200);
      expect(body.completed).toBe(true);
    });
  });

  test.describe('DELETE /todos/:id', () => {
    test('deletes a todo and returns 200', async ({ api }) => {
      const res  = await api.deleteTodo(1);
      const body = await res.json();
      expect(res.status()).toBe(200);
      expect(body).toEqual({});
    });
  });

});

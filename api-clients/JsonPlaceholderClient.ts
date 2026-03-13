import { APIRequestContext } from '@playwright/test';

export class JsonPlaceholderClient {
  constructor(private request: APIRequestContext) {}

  // ── Posts ──────────────────────────────────────────────
  async getPosts()                        { return this.request.get('/posts'); }
  async getPost(id: number)               { return this.request.get(`/posts/${id}`); }
  async createPost(body: object)          { return this.request.post('/posts', { data: body }); }
  async updatePost(id: number, body: object) { return this.request.put(`/posts/${id}`, { data: body }); }
  async patchPost(id: number, body: object)  { return this.request.patch(`/posts/${id}`, { data: body }); }
  async deletePost(id: number)            { return this.request.delete(`/posts/${id}`); }
  async getPostComments(id: number)       { return this.request.get(`/posts/${id}/comments`); }

  // ── Users ──────────────────────────────────────────────
  async getUsers()                        { return this.request.get('/users'); }
  async getUser(id: number)               { return this.request.get(`/users/${id}`); }
  async getUserTodos(id: number)          { return this.request.get(`/users/${id}/todos`); }
  async getUserPosts(id: number)          { return this.request.get(`/users/${id}/posts`); }

  // ── Comments ───────────────────────────────────────────
  async getComments()                     { return this.request.get('/comments'); }
  async getCommentsByPost(postId: number) { return this.request.get(`/comments?postId=${postId}`); }

  // ── Todos ──────────────────────────────────────────────
  async getTodos()                        { return this.request.get('/todos'); }
  async getTodo(id: number)               { return this.request.get(`/todos/${id}`); }
  async createTodo(body: object)          { return this.request.post('/todos', { data: body }); }
  async updateTodo(id: number, body: object) { return this.request.put(`/todos/${id}`, { data: body }); }
  async deleteTodo(id: number)            { return this.request.delete(`/todos/${id}`); }
}

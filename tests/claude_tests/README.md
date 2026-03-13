# JSONPlaceholder API Tests — Playwright + TypeScript

Senior SDET portfolio project demonstrating production-grade API test architecture.

## 🏗️ Project Structure

```
├── api-clients/
│   └── JsonPlaceholderClient.ts   # API abstraction layer
├── fixtures/
│   └── index.ts                   # Shared Playwright fixtures
├── test-data/
│   └── factories.ts               # Data factories
├── tests/api/
│   ├── posts.spec.ts              # Posts CRUD + contract tests
│   ├── users.spec.ts              # Users + nested resources
│   ├── comments.spec.ts           # Comments + query filtering
│   └── todos.spec.ts              # Todos CRUD + data-driven
├── utils/
│   └── schemas.ts                 # Zod contract schemas
└── playwright.config.ts
```

## 🚀 Quick Start

```bash
npm install
npx playwright install --with-deps
npm test
```

## 📊 View Report

```bash
npm run report
```

## ✅ What's Covered

| Area                  | Technique                        |
|-----------------------|----------------------------------|
| Contract validation   | Zod schemas on every response    |
| CRUD coverage         | GET / POST / PUT / PATCH / DELETE|
| Negative testing      | 404s, empty results              |
| Data-driven tests     | `for...of` loops over test cases |
| Business logic        | Uniqueness, completion rates     |
| Nested resources      | `/users/:id/posts`, `/todos`     |
| Query params          | `?postId=` filtering             |
| API abstraction       | `JsonPlaceholderClient` class    |
| Fixtures              | Custom `test.extend` fixture     |
| Data factories        | `PostFactory`, `TodoFactory`     |

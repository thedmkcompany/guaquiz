---
description: Refactor and clean up code for readability, maintainability, and adherence to best practices
model: claude-sonnet-4-5
---

Transform the provided code to improve clarity, structure, and alignment with modern standards.

## Code to Refactor

$ARGUMENTS

## Code Quality Refactoring Checklist

### 1. **Naming & Structure**

- Use clear, descriptive names (camelCase for variables/functions, PascalCase for types/components)
- Prefer full words over abbreviations
- Prefix booleans with is/has/can for intent

### 2. **Functions & Logic**

- Ensure functions have a single responsibility
- Limit function size and parameter count (ideally ≤ 4 parameters)
- Extract complex blocks into helpers
- Minimize side effects (prefer pure functions)

### 3. **Duplication & Reuse**

- Consolidate repeated code into shared utilities or hooks
- Create reusable components for repeated UI
- Apply generics for shared TypeScript types
- Centralize constants and config

### 4. **Complexity Reduction**

- Simplify deep/nested logic where possible
- Extract complex conditions into aptly-named functions
- Use early returns and declarative patterns
- Simplify boolean expressions

### 5. **TypeScript Best Practices**

- Remove `any` types and use precise type annotations
- Define interfaces/types for object shapes
- Utilize Partial, Pick, Omit, and other utility types when appropriate

### 6. **Modern JavaScript/TypeScript Features**

- Use optional chaining: `obj?.prop?.nested`
- Use nullish coalescing: `value ?? fallback`
- Prefer destructuring: `const { foo, bar } = obj`
- Use template literals for string interpolation
- Prefer array methods like filter, map, reduce over loops

### 7. **React Patterns**

- Create custom hooks for business or UI logic
- Explicitly type props/interfaces
  ```typescript
  interface MyComponentProps {
    user: User
    onEdit: (u: User) => void
  }
  ```
- Use context to avoid prop drilling

### 8. **Routine Cleanup**

- Remove unused imports, dead code, and outdated comments
- Ensure consistent formatting (indentation, quotes, line length ≤100 chars)
- Group and order imports logically

### 9. **Error Handling**

- Prefer explicit, granular error handling:
  ```typescript
  try {
    doThing()
  } catch (error) {
    if (error instanceof ValidationError) {
      // Handle specific error
    } else {
      logger.error('Unexpected error', { error })
      throw error
    }
  }
  ```

### 10. **React & Next.js Considerations**

- Use "use client" only when local state or effects are required
- Do data-fetching in server components where possible
- Client-side fetch/caching: prefer SWR/React Query
- Server-side: use `fetch` with `await`

### 11. **Documentation & Comments**

- Write why-focused comments only for non-obvious or crucial logic
- Use JSDoc/TSDoc for public APIs, functions, and components
- Avoid stating the obvious or repeating code

---

## Output: What to Expect

1. **Issue Summary** – Key code smells or structure issues found
2. **Refactored Code** – Improved, cleaned-up code
3. **Explanation** – What changed and why
4. **Before/After Comparison** – (optional)
5. **Additional Suggestions** – For future improvement (optional)

Focus on clarity, maintainability, and practical refactoring in your output.

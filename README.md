# Bridge Dashboard

A React, TypeScript, and Vite application.

## Form Validation

Do not create component-local helper predicates such as:

```ts
const isMissing = (value: string) => submitted && value.trim() === "";
```

Use shared form utilities from `src/lib/form.utils.ts`, especially
`getMissingFields`, and derive submitted-state display flags from those results.

## Code Style

Always use braces for `if`, `else if`, and `else` blocks, including one-line
guard clauses.

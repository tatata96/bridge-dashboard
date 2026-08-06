# Coding Conventions

## React Imports

Do not import React just because a file contains JSX. Import from React only
when the file uses a hook, helper, or React type.

Import React hooks and helpers directly when they are used.

Prefer this:

```tsx
import { useEffect, useState } from "react";

useEffect(() => {
  // ...
}, []);
```

Avoid this:

```tsx
import * as React from "react";

React.useEffect(() => {
  // ...
}, []);
```

Use named type imports for React types when possible:

```tsx
import { type ComponentProps, type CSSProperties } from "react";
```

Prefer this:

```tsx
import { type ComponentProps, type ReactNode } from "react";

type ButtonProps = ComponentProps<"button"> & {
  icon: ReactNode;
};
```

Avoid this:

```tsx
import * as React from "react";

type ButtonProps = React.ComponentProps<"button"> & {
  icon: React.ReactNode;
};
```

## Utility Files

Name utility files by purpose instead of using a single broad `utils.ts` file.

Examples:

```txt
src/lib/classnames.utils.ts
src/lib/date.utils.ts
src/lib/number.utils.ts
```

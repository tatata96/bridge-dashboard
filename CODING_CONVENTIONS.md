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

## Accessibility

### Semantic Headings

Use real heading elements (`<h1>`–`<h6>`) for section and content titles
instead of styling a `<span>` or `<div>` to look like one. Screen reader users
navigate a page by jumping between headings, so text that's only styled to
look like a heading is invisible to that navigation. Nest heading levels to
match the page's structure — don't skip levels for convenience.

Prefer this:

```tsx
<h2 className="text-base font-semibold text-foreground">{className}</h2>
```

Avoid this:

```tsx
<span className="text-base font-semibold text-foreground">{className}</span>
```

### Selection State

Use `aria-current="true"` (or a full `listbox`/`option` pattern) to mark the
currently selected item in a list — not `aria-pressed`. `aria-pressed`
communicates toggle-button state (like a mute button), not "this is the
selected item among several."

Prefer this:

```tsx
<button aria-current={isSelected ? "true" : undefined}>
```

Avoid this:

```tsx
<button aria-pressed={isSelected}>
```

### Icon-Only Status Indicators

`lucide-react` icons are automatically hidden from screen readers
(`aria-hidden="true"`) unless an aria prop is passed to them. So an icon (or
icon + color) that conveys meaning on its own — not just decoration next to
visible text — needs an explicit text alternative on the wrapping element.
Don't rely on the icon shape or color alone to communicate status.

Prefer this:

```tsx
<span role="img" aria-label={label}>
  <CheckIcon aria-hidden="true" />
</span>
```

Avoid this:

```tsx
<span>
  <CheckIcon />
</span>
```

### Accessible Names for Value-Only Controls

A control whose only visible content is a bare value — a number, an icon,
with no surrounding label text inside it — has nothing for the browser's
accessible-name computation to read. Give it an explicit `aria-label`
describing what it controls, even if sighted users get the context from
nearby text.

Prefer this:

```tsx
<SelectTrigger aria-label="Classiva capacity">
  <SelectValue>{capacity}</SelectValue>
</SelectTrigger>
```

Avoid this:

```tsx
<SelectTrigger>
  <SelectValue>{capacity}</SelectValue>
</SelectTrigger>
```

### Labeling Popovers and Similar Regions

When a popover, dialog, or similar region has a visible title, connect it via
`aria-labelledby` so the region itself gets an accessible name once it's
open — not just the trigger button that opened it. A trigger's `aria-label`
only describes the button; it doesn't carry over to the content that opens.

Prefer this:

```tsx
<PopoverContent aria-labelledby="filter-title">
  <p id="filter-title">Filter attendees</p>
  {/* ... */}
</PopoverContent>
```

Avoid this:

```tsx
<PopoverContent>
  <p>Filter attendees</p>
  {/* ... */}
</PopoverContent>
```

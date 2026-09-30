// The backend rejects empty strings on optional text fields, so forms never
// send "" for them. Which value replaces it depends on the request:
// create omits the field (`normalizeOptionalText`), update sends `null` to
// clear an existing value (`getOptionalTextPatchValue`), because omitting it
// there would leave the old value in place.

// HTML `required` accepts whitespace-only values, so check the trimmed text.
export function getMissingFields<
  Values extends Record<string, string>,
  Field extends keyof Values & string,
>(values: Values, requiredFields: readonly Field[]): Field[] {
  return requiredFields.filter((field) => values[field].trim() === "");
}

// Create semantics: optional text that is empty after trimming is omitted.
export function normalizeOptionalText(value: string) {
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

// Update semantics: the trimmed text when it differs from the initial value,
// otherwise `undefined` (unchanged). Whitespace-only edits are not changes.
export function getTextPatchValue(initial: string, current: string) {
  const trimmed = current.trim();
  return trimmed === initial.trim() ? undefined : trimmed;
}

// Update semantics for optional text: like `getTextPatchValue`, but an emptied
// field is `null` (clear it). `initial` is null when the field had no value.
export function getOptionalTextPatchValue(
  initial: string | null,
  current: string,
) {
  const trimmed = getTextPatchValue(initial ?? "", current);
  if (trimmed === undefined) return undefined;
  return trimmed === "" ? null : trimmed;
}

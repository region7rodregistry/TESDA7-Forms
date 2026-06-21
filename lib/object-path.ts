/* Tiny dot-path get/set helpers for nested Application objects.
   Paths look like "manpowerProfile.lastName" or "educationalBackground.schools.0.name". */

export function getPath<T = unknown>(obj: unknown, path: string): T | undefined {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc == null) return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj) as T | undefined;
}

/** Immutably set a value at a dot-path, returning a new object. */
export function setPath<T>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const clone: unknown = Array.isArray(obj) ? [...obj] : { ...(obj as object) };
  let cursor = clone as Record<string, unknown>;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const next = cursor[key];
    cursor[key] = Array.isArray(next) ? [...next] : { ...(next as object) };
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[keys[keys.length - 1]] = value;
  return clone as T;
}

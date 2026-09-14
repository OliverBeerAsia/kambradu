/**
 * The path the site is served under. Empty at the root; "/kambradu" on GitHub
 * Pages. next/link and Next's own assets apply it automatically; anything
 * that names a file in public/ by hand must go through withBasePath().
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(path: string): string {
  return `${basePath}${path}`;
}

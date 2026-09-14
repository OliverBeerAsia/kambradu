/**
 * Stand-in for next/link used only when building the Claude Design bundle.
 *
 * Outside a Next.js app there is no router, and next/link reads Next-only
 * environment variables at load time, which throws in a plain browser. In a
 * design built with these components a link is an ordinary anchor, so that is
 * what this renders. The app itself never imports this file.
 */
import type { AnchorHTMLAttributes, ReactNode } from "react";

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string | { pathname?: string };
  children?: ReactNode;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
};

export default function Link({ href, children, prefetch, replace, scroll, ...rest }: LinkProps) {
  const target = typeof href === "string" ? href : href.pathname ?? "#";
  return (
    <a href={target} {...rest}>
      {children}
    </a>
  );
}

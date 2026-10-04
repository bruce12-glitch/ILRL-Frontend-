import { useSyncExternalStore, type ReactNode } from "react";

export type Page = "" | "research" | "publications" | "people";

export interface Route {
  page: Page;
  anchor?: string;
}

const PAGES: Page[] = ["", "research", "publications", "people"];

/** Routes look like "#/research" or "#/research/entroprefill" (page + anchor). */
export function parseRoute(hash: string): Route {
  const clean = hash.replace(/^#\/?/, "").replace(/\/+$/, "");
  const [seg0 = "", seg1] = clean.split("/");
  if (PAGES.includes(seg0 as Page)) return { page: seg0 as Page, anchor: seg1 || undefined };
  // Unknown first segment → treat it as an anchor living on the home page (e.g. "#join")
  return { page: "", anchor: seg0 || undefined };
}

export function routeTo(page: Page | string, anchor?: string): string {
  if (anchor) return page === "" ? `#/${anchor}` : `#/${page}/${anchor}`;
  return page === "" ? "#/" : `#/${page}`;
}

function subscribe(cb: () => void) {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
}

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash);
  return parseRoute(hash);
}

interface LinkProps {
  to: Page | string;
  anchor?: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}

/** Hash-routed anchor — renders a real <a href> so crawlers see the paths. */
export function Link({ to, anchor, className, children, onClick, ariaLabel }: LinkProps) {
  return (
    <a href={routeTo(to, anchor)} className={className} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </a>
  );
}

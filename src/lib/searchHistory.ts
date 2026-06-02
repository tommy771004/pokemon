/**
 * Search history persisted in a first-party cookie.
 *
 * Stores the most recent search queries (most-recent-first, de-duplicated) so
 * the global search overlay can offer quick "recent searches" chips. Kept small
 * and client-only — no PII beyond what the user typed into the search box.
 */
const COOKIE = "pk_search_history";
const MAX_ITEMS = 8;
const MAX_AGE_DAYS = 180;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  const hit = document.cookie.split("; ").find((c) => c.startsWith(prefix));
  return hit ? decodeURIComponent(hit.slice(prefix.length)) : null;
}

function writeCookie(name: string, value: string, maxAgeDays: number) {
  if (typeof document === "undefined") return;
  const maxAge = maxAgeDays * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function getSearchHistory(): string[] {
  const raw = readCookie(COOKIE);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((q): q is string => typeof q === "string") : [];
  } catch {
    return [];
  }
}

/** Add a query to the front, de-duplicate (case-insensitive), cap the list. Returns the new list. */
export function addSearchHistory(query: string): string[] {
  const q = query.trim();
  if (!q) return getSearchHistory();
  const lower = q.toLowerCase();
  const next = [q, ...getSearchHistory().filter((item) => item.toLowerCase() !== lower)].slice(0, MAX_ITEMS);
  writeCookie(COOKIE, JSON.stringify(next), MAX_AGE_DAYS);
  return next;
}

export function clearSearchHistory(): string[] {
  writeCookie(COOKIE, JSON.stringify([]), MAX_AGE_DAYS);
  return [];
}

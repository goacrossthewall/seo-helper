const severityFor = (type, before, after) => {
  if (type === "HTTP_STATUS_CHANGED" && before >= 200 && before < 300 && (after === 404 || after >= 500)) return "CRITICAL";
  if (type === "ROBOTS_CHANGED" && before === "index" && after === "noindex") return "CRITICAL";
  if (["CANONICAL_CHANGED", "TITLE_CHANGED", "META_DESCRIPTION_CHANGED"].includes(type)) return "WARNING";
  return "INFO";
};

const event = (url, type, before, after) => ({ url, type, before, after, severity: severityFor(type, before, after) });

/** Compare two crawl snapshots keyed by normalized URL. */
export function compareSnapshots(previous, current) {
  const beforeByUrl = new Map(previous.map((page) => [page.url, page]));
  const afterByUrl = new Map(current.map((page) => [page.url, page]));
  const changes = [];

  for (const [url, after] of afterByUrl) {
    const before = beforeByUrl.get(url);
    if (!before) { changes.push(event(url, "URL_ADDED", null, url)); continue; }
    if (before.statusCode !== after.statusCode) changes.push(event(url, "HTTP_STATUS_CHANGED", before.statusCode, after.statusCode));
    if (before.robots !== after.robots) changes.push(event(url, "ROBOTS_CHANGED", before.robots, after.robots));
    if (before.canonical !== after.canonical) changes.push(event(url, "CANONICAL_CHANGED", before.canonical, after.canonical));
    if (before.title !== after.title) changes.push(event(url, "TITLE_CHANGED", before.title, after.title));
    if (before.metaDescription !== after.metaDescription) changes.push(event(url, "META_DESCRIPTION_CHANGED", before.metaDescription, after.metaDescription));
    if (before.internalLinksCount !== after.internalLinksCount) changes.push(event(url, "INTERNAL_LINKS_CHANGED", before.internalLinksCount, after.internalLinksCount));
  }
  for (const [url] of beforeByUrl) if (!afterByUrl.has(url)) changes.push(event(url, "URL_REMOVED", url, null));
  return changes;
}

export function summarizeChanges(changes) {
  return changes.reduce((summary, change) => {
    summary.total += 1;
    summary[change.severity.toLowerCase()] += 1;
    summary.byType[change.type] = (summary.byType[change.type] ?? 0) + 1;
    return summary;
  }, { total: 0, critical: 0, warning: 0, info: 0, byType: {} });
}

import test from "node:test";
import assert from "node:assert/strict";
import { assertSafeCrawlUrl, isSameDomain, normalizeUrl } from "../packages/crawler/core.mjs";

test("normalizes paths and removes tracking parameters", () => {
  assert.equal(normalizeUrl("HTTPS://Example.COM/a/?utm_source=x&b=2&a=1#top"), "https://example.com/a?a=1&b=2");
});

test("resolves relative internal links", () => {
  const url = normalizeUrl("../pricing/", "https://example.com/docs/start");
  assert.equal(url, "https://example.com/pricing");
  assert.equal(isSameDomain(url, "https://example.com"), true);
  assert.equal(isSameDomain("https://cdn.example.com/a", "https://example.com"), false);
});

test("blocks private and unsupported crawl targets", () => {
  for (const url of ["http://localhost", "http://127.0.0.1", "http://10.2.3.4", "http://172.16.0.2", "http://192.168.1.2", "ftp://example.com"]) {
    assert.throws(() => assertSafeCrawlUrl(url));
  }
  assert.equal(assertSafeCrawlUrl("https://example.com").hostname, "example.com");
});

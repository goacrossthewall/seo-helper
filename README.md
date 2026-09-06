# Indexly — SEO Change Monitor

A focused MVP for monitoring meaningful technical SEO changes between website crawls.

## Included in V0.1

- Responsive change-monitor dashboard with critical, warning, and resolved states
- Interactive crawl action for validating the primary product flow
- URL normalization and same-domain scope helpers
- Baseline SSRF protection for literal local/private targets
- Snapshot comparison, event severity classification, and summary generation

The crawler helpers deliberately remain small. A production fetch worker must resolve DNS and run the SSRF check against every resolved address, including after each redirect.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Core logic tests do not require third-party packages:

```bash
npm test
```

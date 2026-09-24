# Grounded Portfolio Query experiment

This experiment is intentionally isolated from `main` and from the existing `my.html`.

## Data architecture

There is one human-edited source of truth:

- `content/portfolio.yaml` — readable portfolio knowledge base
- `schema/portfolio.schema.json` — structural validation contract
- `scripts/build-portfolio-data.js` — validate + normalize + flatten public facts
- `generated/portfolio-data.json` — generated runtime data read by the browser
- `portfolio-query-rag.js` — retrieval, conversation state, local composer and sources UI
- `functions/api/ask.js` — Cloudflare Pages Function for the optional grounded LLM layer
- `rag.html` / `rag.css` — experiment UI

Do **not** edit `generated/portfolio-data.json` manually.

## Editing knowledge

1. Edit `content/portfolio.yaml`.
2. Run:

```bash
npm install
npm run build:data
```

3. If schema validation fails, the build exits with a non-zero status and prints the invalid path.
4. Commit both the YAML change and regenerated `generated/portfolio-data.json`.

Only facts with `public: true` are emitted into the runtime file.

Supported confidence values:

- `verified`
- `self-reported`
- `inferred`

## Runtime behavior

1. The browser fetches `generated/portfolio-data.json`.
2. Retrieval selects relevant facts.
3. A deterministic local composer is always available.
4. The browser optionally calls `/api/ask`.
5. If the server LLM is configured, it receives only the retrieved facts and recent conversation.
6. If it is unavailable, the local composer remains functional.
7. Every answer can expose its evidence under **Sources**.

## Cloudflare Pages configuration

The optional endpoint is implemented as a Cloudflare Pages Function at `functions/api/ask.js`, which exposes `/api/ask`. It is provider-agnostic for OpenAI-compatible chat endpoints.

In Cloudflare, configure these environment variables / secrets for the Pages project:

- `LLM_API_URL`
- `LLM_API_KEY`
- `LLM_MODEL`

Keep `LLM_API_KEY` as a secret. The browser never receives it; the request to the LLM provider is made from the Pages Function.

Without all three values, `/api/ask` returns 503 by design and the frontend falls back to the deterministic local composer.

## Rollback safety

The experiment lives on `exp/grounded-portfolio-query`. Existing production files on `main`, including `my.html`, are unchanged.

# Cloudflare Pages deployment

This repository is ready to run on Cloudflare Pages without changing the browser-side Portfolio Query contract.

## Pages Function

`functions/api/ask.js` exposes:

```
POST /api/ask
```

The browser can keep calling `/api/ask`. If the LLM provider is unavailable or not configured, the existing local composer remains the fallback.

## Environment variables

Configure these in Cloudflare Pages project settings as environment variables/secrets:

- `LLM_API_URL`
- `LLM_API_KEY`
- `LLM_MODEL`

Example:

```
LLM_API_URL=https://api.openai.com/v1/chat/completions
LLM_MODEL=gpt-4.1-mini
```

Store `LLM_API_KEY` as a secret. Do not expose it in browser JavaScript or commit it to Git.

For local Pages development, copy `.dev.vars.example` to `.dev.vars` and put real values there.

## Routing

`_routes.json` limits Pages Functions execution to `/api/*`, so static HTML, CSS, JavaScript, JSON and canvas assets remain served directly from Pages/CDN.

## Build

The static site itself needs no framework build step. If the grounded knowledge base is changed, regenerate it with:

```bash
npm install
npm run build:data
```

Then deploy the repository root as the Pages output.

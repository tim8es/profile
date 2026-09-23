# Grounded Portfolio Query experiment

This experiment is intentionally isolated from `main` and from the existing `hybrid.html`.

## Files
- `rag.html` — experimental UI
- `portfolio-data.js` — curated public facts; this is the source of truth
- `portfolio-query-rag.js` — retrieval, conversation state, local composer, sources UI
- `api/ask.js` — optional serverless grounded LLM layer
- `rag.css` — experiment-only styling

## Runtime behavior
1. The browser retrieves relevant curated facts.
2. It immediately has a deterministic local composer fallback.
3. It calls `/api/ask`.
4. If the serverless LLM is configured and available, the answer is generated only from retrieved facts.
5. Otherwise the local composer remains functional.
6. Every answer exposes the facts used under **Sources**.

## Server configuration
The serverless endpoint is provider-agnostic for OpenAI-compatible chat endpoints.

Environment variables:
- `LLM_API_URL`
- `LLM_API_KEY`
- `LLM_MODEL`

Without them, the API returns 503 by design and the frontend falls back locally.

## Important
The current knowledge base is a first public-safe draft for testing the architecture. Content should be reviewed separately before this experiment replaces the current portfolio.

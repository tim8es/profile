export async function onRequestGet({ env }) {
  const llmConfigured = Boolean(
    env.LLM_API_URL &&
    env.LLM_API_KEY &&
    env.LLM_MODEL
  );

  return new Response(
    JSON.stringify({
      mode: llmConfigured ? "llm" : "local",
      llmConfigured
    }),
    {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store"
      }
    }
  );
}

export async function onRequest() {
  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      allow: "GET"
    }
  });
}

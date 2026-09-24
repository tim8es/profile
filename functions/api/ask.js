function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...extraHeaders
    }
  });
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405, { allow: "POST" });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const { question, locale = "en", history = [], facts = [] } = body || {};

  if (!question || !Array.isArray(facts) || facts.length === 0) {
    return json({ error: "question and facts are required" }, 400);
  }

  const apiUrl = env.LLM_API_URL;
  const apiKey = env.LLM_API_KEY;
  const model = env.LLM_MODEL;

  if (!apiUrl || !apiKey || !model) {
    return json({ error: "LLM provider is not configured" }, 503);
  }

  const factBlock = facts
    .slice(0, 18)
    .map((fact, index) => `[${index + 1}] ${fact.text}`)
    .join("\n");

  const language = locale === "ru" ? "Russian" : "English";
  const system = [
    "You are the grounded portfolio assistant for Timur Dautov.",
    "Answer ONLY from the supplied FACTS and recent conversation.",
    "You may combine facts, compare them, summarize them, and derive cautious implications.",
    "Never invent employers, projects, metrics, dates, technologies, achievements, education, salary, personality traits or weaknesses.",
    "If the facts are insufficient, say what is not established.",
    "Keep the answer concise and useful, normally 2-5 sentences.",
    `Answer in ${language}.`,
    "",
    "FACTS:",
    factBlock
  ].join("\n");

  const messages = [
    { role: "system", content: system },
    ...history
      .slice(-6)
      .filter(message =>
        message &&
        ["user", "assistant"].includes(message.role) &&
        typeof message.content === "string"
      ),
    { role: "user", content: question }
  ];

  try {
    const upstream = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.2,
        max_tokens: 220
      })
    });

    if (!upstream.ok) {
      const detail = (await upstream.text()).slice(0, 500);
      return json({ error: "LLM upstream failed", detail }, 502);
    }

    const data = await upstream.json();
    const answer =
      data?.choices?.[0]?.message?.content ??
      data?.output_text ??
      data?.response ??
      null;

    if (!answer || typeof answer !== "string") {
      return json({ error: "No answer returned by upstream" }, 502);
    }

    return json({ answer: answer.trim() });
  } catch (error) {
    return json(
      { error: "LLM request failed", detail: String(error?.message || error) },
      502
    );
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question, locale = "en", history = [], facts = [] } = req.body || {};
  if (!question || !Array.isArray(facts) || facts.length === 0) {
    return res.status(400).json({ error: "question and facts are required" });
  }

  const apiUrl = process.env.LLM_API_URL;
  const apiKey = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL;

  // No provider configured: frontend will use its deterministic local composer.
  if (!apiUrl || !apiKey || !model) {
    return res.status(503).json({ error: "LLM provider is not configured" });
  }

  const factBlock = facts
    .slice(0, 10)
    .map((f, i) => `[${i + 1}] ${f.text}`)
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
    ...history.slice(-6).filter(m => m && ["user","assistant"].includes(m.role) && typeof m.content === "string"),
    { role: "user", content: question }
  ];

  try {
    const upstream = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.2,
        max_tokens: 220
      })
    });

    if (!upstream.ok) {
      const body = await upstream.text();
      return res.status(502).json({ error: "LLM upstream failed", detail: body.slice(0, 500) });
    }

    const data = await upstream.json();
    const answer =
      data?.choices?.[0]?.message?.content ??
      data?.output_text ??
      data?.response ??
      null;

    if (!answer || typeof answer !== "string") {
      return res.status(502).json({ error: "No answer returned by upstream" });
    }

    return res.status(200).json({ answer: answer.trim() });
  } catch (error) {
    return res.status(502).json({ error: "LLM request failed", detail: String(error?.message || error) });
  }
}
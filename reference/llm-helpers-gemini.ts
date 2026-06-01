// Free, no credit card. Get a key at aistudio.google.com. Rate limits: 30 RPM, 1000 RPD.

const INTENT_SYSTEM_PROMPT = `You turn vague research topics into precise Google search queries for a web research Actor.

Interpret the user's intent, identify irrelevant meanings to avoid, and return 2 or 3 Google search queries biased toward recent content.

Return only JSON with this shape:
{
  "interpretedIntent": "string",
  "queries": ["string"]
}

Rules:
- Prefer specific phrases over broad keywords.
- Use Google operators when useful, such as after:YYYY-MM-DD, OR, and -site:reddit.com.
- Prefer recent news, launch, release, update, analysis, report, benchmark, demo, or announcement terms.
- Avoid unrelated meanings of ambiguous topics.`;

function stripJsonFences(text: string): string {
  return text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
}

async function callGeminiJson<T>(apiKey: string, system: string, user: string): Promise<T> {
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gemini-2.5-flash-lite',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini request failed with status ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('Gemini returned no content');
  }

  return JSON.parse(stripJsonFences(text)) as T;
}

export async function interpretTopic(
  topic: string,
  apiKey: string,
): Promise<{ interpretedIntent: string; queries: string[] }> {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const data = await callGeminiJson<{ interpretedIntent?: string; queries?: string[] }>(
      apiKey,
      INTENT_SYSTEM_PROMPT,
      `Topic: ${topic}
Current date: ${today}

Return 2 or 3 search queries.`,
    );

    const queries = Array.isArray(data.queries) ? data.queries.map((query) => String(query).trim()).filter(Boolean) : [];
    return {
      interpretedIntent: data.interpretedIntent || topic,
      queries: queries.length > 0 ? queries.slice(0, 3) : [topic],
    };
  } catch {
    return { interpretedIntent: topic, queries: [topic] };
  }
}

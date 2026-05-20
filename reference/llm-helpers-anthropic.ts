type BasicItem = {
  id: string;
  title: string | null;
  text: string;
};

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

const FILTER_SYSTEM_PROMPT = `You are a strict relevance judge for web research results.

Classify each item against the user's topic.

Labels:
- relevant: directly discusses the intended topic
- borderline: adjacent but still useful
- irrelevant: wrong meaning, spam, or accidental keyword match

Return only JSON with this shape:
{
  "items": [
    { "id": "string", "label": "relevant | borderline | irrelevant", "reason": "string" }
  ]
}`;

function stripJsonFences(text: string): string {
  return text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
}

async function callAnthropicJson<T>(apiKey: string, system: string, user: string): Promise<T> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1200,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic request failed with status ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text;
  if (!text) {
    throw new Error('Anthropic returned no content');
  }

  return JSON.parse(stripJsonFences(text)) as T;
}

export async function interpretTopic(
  topic: string,
  apiKey: string,
): Promise<{ interpretedIntent: string; queries: string[] }> {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const data = await callAnthropicJson<{ interpretedIntent?: string; queries?: string[] }>(
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

export async function filterResults<T extends BasicItem>(items: T[], topic: string, apiKey: string): Promise<T[]> {
  try {
    const compactItems = items.map((item) => ({
      id: item.id,
      title: item.title,
      text: item.text.replace(/\s+/g, ' ').trim().slice(0, 200),
    }));

    const data = await callAnthropicJson<{ items?: Array<{ id?: string; label?: string }> }>(
      apiKey,
      FILTER_SYSTEM_PROMPT,
      `Topic: ${topic}

Items:
${JSON.stringify(compactItems, null, 2)}`,
    );

    const keepIds = new Set(
      (data.items || [])
        .filter((decision) => decision.label === 'relevant' || decision.label === 'borderline')
        .map((decision) => decision.id)
        .filter(Boolean),
    );

    return keepIds.size > 0 ? items.filter((item) => keepIds.has(item.id)) : items;
  } catch {
    return items;
  }
}

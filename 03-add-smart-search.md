# Lesson 3: Add Smart Search

Goal: Use an LLM to turn a vague topic into better Google search queries.

This lesson requires an LLM API key. If you don't have one, skip to [Lesson 5](./05-deploy.md). Your actor works fine without this. It just searches your literal topic text.

## The problem

If someone searches:

```text
agents
```

RAG Web Browser might return pages about real estate agents, travel agents, sports agents, or AI agents.

We want the actor to understand the intent and search with better queries like:

```text
AI coding agents latest developments
agentic AI release update after:2026-05-13
AI agent frameworks announcement report
```

## Step 1: Pick your LLM provider

| Provider | Cost | Get a key |
|----------|------|-----------|
| OpenAI | $5 min prepaid | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| Anthropic | Paid or included with Claude Code | [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) |
| Gemini | Free, no credit card | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |

## Step 2: Copy the helper function

Open the `reference/` folder in this workshop repo.

Find the file for your provider:

- `reference/llm-helpers-openai.ts`
- `reference/llm-helpers-anthropic.ts`
- `reference/llm-helpers-gemini.ts`

Copy the `interpretTopic` function from that file into your actor project.

You can put it in a new file:

```bash
touch src/llm.ts
```

Or paste it directly into `src/main.ts`.

## Step 3: Wire it in

Give this to your coding agent:

```text
I added an interpretTopic function to my project from the workshop reference file.

Wire it into src/main.ts:

1. Before calling RAG Web Browser, call interpretTopic(topic, apiKey)
   - Read the API key from process.env.OPENAI_API_KEY if using OpenAI
   - Read the API key from process.env.ANTHROPIC_API_KEY if using Anthropic
   - Read the API key from process.env.GEMINI_API_KEY if using Gemini
2. interpretTopic returns { interpretedIntent: string, queries: string[] }
3. Instead of making one RAG Web Browser call with the raw topic, make one call per query from the queries array
4. Run the queries sequentially, one after another, not Promise.all
5. Each RAG Web Browser call should use maxResults: 3
6. Preserve searchRank across all queries:
   - query 1 result 1 should be searchRank 1
   - query 1 result 2 should be searchRank 2
   - query 2 result 1 should continue after that
7. Merge all the raw results into one array before normalizing and deduplicating
8. Log the generated search queries
9. If interpretTopic throws an error or no API key is set, fall back to using the literal topic as the only query
```

Your RAG call should still use the helper from Lesson 2:

```ts
const run = await client.actor('apify/rag-web-browser').call(
  createRagWebBrowserInput(query, 3),
);
```

## Step 4: Set your key and test

For OpenAI:

```bash
export OPENAI_API_KEY=your-key-here
```

For Anthropic:

```bash
export ANTHROPIC_API_KEY=your-key-here
```

For Gemini:

```bash
export GEMINI_API_KEY=your-key-here
```

Run:

```bash
apify run
```

Check the logs. You should see generated search queries.

Check the dataset:

```bash
ls storage/datasets/default
```

You should see more results than before. Usually 2 or 3 queries times 3 results each, minus duplicates.

If you see `401` or `invalid_api_key`, check your API key.

If you see the same literal query as before, check that your environment variable name matches your provider.

Your actor now understands what you actually mean and searches smarter. Next, we'll filter out the noise.

# Lesson 2: Build Your Actor

Goal: Create a new Apify Actor that calls RAG Web Browser and returns clean, normalized results.

## Step 1: Scaffold the project

Run:

```bash
apify create catch-me-up-actor
```

The CLI wizard will open.

First, choose the programming language:

```text
TypeScript
```

Then choose the template:

```text
Empty TypeScript project
```

Then enter the new project folder:

```bash
cd catch-me-up-actor
```

Install the Apify API client:

```bash
npm install apify-client
```

`apify create` gives you a starter Actor project. We're using the empty TypeScript template because we do not need a crawler. We're building a wrapper around another Actor.

`apify-client` lets one Actor call another Actor.

## Step 2: Build the core actor

Copy the prompt below and give it to your coding agent. Paste it into Claude Code, Cursor, Codex, or whatever you're using.

```text
Replace the contents of src/main.ts with a new Apify Actor. Here's what it should do:

INPUT (read with Actor.getInput()):
{
  topic: string       // required, the thing to research
  timeRange: string   // optional, "day" | "week" | "month", default "week"
  maxResults: number  // optional, 1-20, default 5
}

BEHAVIOR:
1. Call Actor.init() at the start
2. Read and validate input. If no topic, throw an error.
3. Create an ApifyClient instance using this token fallback:

   const env = Actor.getEnv();
   const token = process.env.APIFY_API_TOKEN || env.token || process.env.APIFY_TOKEN;
   const client = new ApifyClient({ token });

4. Call the "apify/rag-web-browser" marketplace Actor using the client:

   const run = await client.actor('apify/rag-web-browser').call({
     query: topic,
     maxResults: maxResults,
     outputFormats: ['markdown'],
     requestTimeoutSecs: 40,
     scrapingTool: 'raw-http',
   });

5. Fetch the results from the run's dataset:

   const { items } = await client.dataset(run.defaultDatasetId).listItems();

6. Normalize each result into this shape:

   {
     id: item.metadata?.url || item.searchResult?.url,
     platform: 'web',
     url: item.metadata?.url || item.searchResult?.url,
     title: item.metadata?.title || item.searchResult?.title || null,
     text: item.markdown ? item.markdown.slice(0, 2000) : (item.searchResult?.description || ''),
     author: null,
     authorUrl: null,
     publishedAt: null,
     engagementScore: 0,
     searchRank: index + 1,
   }

7. Deduplicate by URL. If two items have the same URL, keep the first one.
8. Push all normalized items to the dataset with Actor.pushData()
9. Call Actor.exit()

ERROR HANDLING:
- Import log from 'apify' and use log.info(), log.warning(), and log.error()
- Do not use Actor.log. It is undefined in this SDK version.
- Do not use process.exit(). Return cleanly and let Actor.exit() run.
- If the RAG Web Browser call fails, log the error with log.error() and exit gracefully
- Use try/catch around the main logic
- Use finally { await Actor.exit(); } so Actor.exit() always runs exactly once

IMPORTS:
- Actor and log from 'apify'
- ApifyClient from 'apify-client'
```

## Step 3: Update the input schema

Also give your agent this:

```text
Update .actor/INPUT_SCHEMA.json to define these input fields:
- topic: string, required, title "Topic", editor textfield, description "The topic to research"
- timeRange: string, enum ["day", "week", "month"], default "week", title "Time Range"
- maxResults: integer, default 5, minimum 1, maximum 20, title "Max Results"
```

## Step 4: Test it

Create a local input file:

```bash
mkdir -p storage/key_value_stores/default
echo '{"topic": "AI agents", "maxResults": 3}' > storage/key_value_stores/default/INPUT.json
```

Optional but useful: run a TypeScript build before running the Actor.

```bash
npm run build
```

Run your actor:

```bash
apify run
```

Check the local dataset:

```bash
ls storage/datasets/default
```

Open one result:

```bash
cat storage/datasets/default/000000001.json
```

You should see 3 items. Each item should have:

```text
id
platform
url
title
text
searchRank
```

If you see API token errors, run:

```bash
apify login
```

Then run:

```bash
apify info
```

If you see `Actor not found`, check the Actor name:

```text
apify/rag-web-browser
```

If you see TypeScript errors, paste them into your coding agent and ask it to fix them.

You just built an Actor that wraps a marketplace tool. Next we'll make it smarter.

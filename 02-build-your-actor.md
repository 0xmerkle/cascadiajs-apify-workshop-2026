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

Now copy the RAG Web Browser input helper into your Actor project.

1. Open [`reference/rag-web-browser-input.ts`](./reference/rag-web-browser-input.ts) from these workshop materials.
2. Create a new file in your Actor project at `src/rag-web-browser-input.ts`.
3. Copy the full contents of `reference/rag-web-browser-input.ts` into that new file.

If you are working from a local copy of these workshop materials, this command may also work:

```bash
cp ../reference/rag-web-browser-input.ts src/rag-web-browser-input.ts
```

This helper gives your coding agent the exact RAG Web Browser settings to use. The point of the workshop is not to guess the right scraping options. The point is to wrap an existing Actor and add your own logic around it.

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

4. Import createRagWebBrowserInput from './rag-web-browser-input.js'.

5. Call the "apify/rag-web-browser" marketplace Actor using the helper:

   const ragMaxResults = Math.max(maxResults * 2, 10);
   const run = await client.actor('apify/rag-web-browser').call(
     createRagWebBrowserInput(topic, ragMaxResults),
   );

   Do not invent a different RAG Web Browser input object. Use the helper.

   The actor input maxResults is the final number of clean results to return.
   ragMaxResults is the number of raw pages to fetch. Fetch extra pages because some pages fail, duplicate, or get filtered out.

6. Fetch the results from the run's dataset:

   const { items } = await client.dataset(run.defaultDatasetId).listItems();

7. Normalize each result.

   RAG Web Browser results are useful, but raw. Some pages load cleanly and have markdown. Some pages fail to load but still have a useful Google searchResult. Some pages have markdown full of nav links or forms.

   Do not just return the first 2000 characters of raw markdown. That often gives you navigation, form fields, country dropdowns, or YouTube footer links.

   Add a helper called cleanText(value: string): string that:

   - Splits text into lines
   - Trims each line
   - Removes empty lines
   - Removes markdown image lines that start with ![
   - Removes lines that are just links, like [About](...)
   - Removes lines with common form labels: First name, Last name, Business email, Phone, Country, State, Download, Sign in, Subscribe
   - Removes exact duplicate lines
   - Joins the remaining lines with spaces
   - Collapses repeated whitespace

   For each raw item:

   - Get the URL from item.metadata?.url || item.searchResult?.url
   - Skip the item if there is no URL
   - Skip URLs from youtube.com, reddit.com, and medium.com unless the user's topic explicitly asks for those sites
   - Get the title from item.metadata?.title || item.searchResult?.title || null
   - Build text from the best available evidence, in this order:
     1. item.searchResult?.description
     2. item.metadata?.description
     3. cleanText(item.markdown || '')
   - Join those parts into one string
   - Trim it to 2000 characters
   - Skip the item if text is empty after trimming

   Return this shape:

   {
     id: item.metadata?.url || item.searchResult?.url,
     platform: 'web',
     url: item.metadata?.url || item.searchResult?.url,
     title: item.metadata?.title || item.searchResult?.title || null,
     text,
     author: null,
     authorUrl: null,
     publishedAt: null,
     engagementScore: 0,
     searchRank: index + 1,
   }

8. Deduplicate by URL. If two items have the same URL, keep the first one.
9. Keep only the first maxResults normalized items after deduplication.
10. Push all normalized items to the dataset with Actor.pushData()
11. Call Actor.exit()

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
- createRagWebBrowserInput from './rag-web-browser-input.js'
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

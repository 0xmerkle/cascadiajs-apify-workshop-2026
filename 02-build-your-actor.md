# Lesson 2: Build Your Actor

Goal: Create a new Apify Actor that calls RAG Web Browser and returns clean, normalized results.

## Step 1: Scaffold the project

Make sure you installed the Apify CLI before continuing:

```bash
apify --version
```

If that command fails, install it:

```bash
npm install -g apify-cli
```

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

Open your coding agent from inside this Actor project folder. The generated project includes an `AGENTS.md` file with Apify-specific guidance. Your agent should read that file before changing code.

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

This helper gives your coding agent the exact RAG Web Browser settings to use. The point of the workshop is not to guess the right scraping options. The point is to wrap an existing Actor and add your own logic around it.

## Step 2: Build the core actor

Build this in stages. After each prompt, skim the code your agent wrote before moving on.

### 2.1 Create the Actor shell

This gives the Actor its input handling, API client setup, and lifecycle.

```text
Read the AGENTS.md file in this project first. Follow its Apify Actor guidance while implementing this.

Replace the contents of src/main.ts with a new Apify Actor shell.

INPUT (read with Actor.getInput()):
{
  topic: string       // required, the thing to research
  maxResults: number  // optional, 1-20, default 5
}

BEHAVIOR:
1. Wrap the actor logic in Actor.main(async () => { ... }).
   Actor.main handles Actor.init() and Actor.exit() for you.
2. Do not call Actor.init() or Actor.exit() manually if you use Actor.main.
3. Read and validate input inside the Actor.main callback. If no topic, throw an error.
4. Create an ApifyClient instance using this token fallback:

   const env = Actor.getEnv();
   const token = process.env.APIFY_API_TOKEN || env.token || process.env.APIFY_TOKEN;
   const client = new ApifyClient({ token });

5. For now, log the validated input and confirm the client was created.

INPUT RULES:
- maxResults should default to 5 and be clamped between 1 and 20.
- topic should be trimmed before use.

ERROR HANDLING:
- Import log from 'apify' and use log.info(), log.warning(), and log.error()
- Do not use Actor.log. It is undefined in this SDK version.
- Do not use process.exit().
- Do not put return statements at the top level of the file.
- Use try/catch around the main logic

IMPORTS:
- Actor and log from 'apify'
- ApifyClient from 'apify-client'
```

### 2.2 Call RAG Web Browser

Now your Actor calls another Actor and fetches that run's dataset.

```text
Update src/main.ts so it calls the "apify/rag-web-browser" marketplace Actor.

1. Import createRagWebBrowserInput from './rag-web-browser-input.js'.

2. Call RAG Web Browser with the helper:

   const ragMaxResults = Math.max(maxResults * 2, 10);
   const run = await client.actor('apify/rag-web-browser').call(
     createRagWebBrowserInput(topic, ragMaxResults),
   );

   Do not invent a different RAG Web Browser input object. Use the helper.

   The actor input maxResults is the final number of clean results to return.
   ragMaxResults is the number of raw pages to fetch. Fetch extra pages because some pages fail, duplicate, or get filtered out.

3. Fetch the results from the run's dataset:

   const { items } = await client.dataset(run.defaultDatasetId).listItems();

4. Log how many raw items came back.

5. If the RAG Web Browser call fails, log the error with log.error() and return from the Actor.main callback.
   Do not call process.exit().
   Do not put a bare return at the top level of the file.

IMPORTS:
- createRagWebBrowserInput from './rag-web-browser-input.js'
```

### 2.3 Normalize results

RAG Web Browser output is raw. Normalize it into the shape your API caller and agent skill will expect.

```text
Add a normalizeItem helper to src/main.ts.

Define normalizeItem as a local function inside src/main.ts.
Do not create a new file for it.
Do not import normalizeItem from another module.

RAG Web Browser results are useful, but raw. Some pages load cleanly and have markdown. Some pages fail to load but still have a useful Google searchResult. Some pages have markdown full of nav links or forms.

For each raw item:

- Get the URL from item.metadata?.url || item.searchResult?.url
- Skip the item if there is no URL
- Skip URLs from youtube.com, reddit.com, and medium.com unless the user's topic explicitly asks for those sites
- Get the title from item.metadata?.title || item.searchResult?.title || null
- Build text from these parts:
  1. item.searchResult?.description
  2. item.metadata?.description
  3. item.markdown
- Join those parts into one string
- Collapse repeated whitespace
- Trim text to 4000 characters
- Add rawMarkdown: item.markdown ? item.markdown.slice(0, 30000) : null
- Skip the item if both text and rawMarkdown are empty after trimming

Return this shape:

{
  id: item.metadata?.url || item.searchResult?.url,
  platform: 'web',
  url: item.metadata?.url || item.searchResult?.url,
  title: item.metadata?.title || item.searchResult?.title || null,
  text,
  rawMarkdown: item.markdown ? item.markdown.slice(0, 30000) : null,
  author: null,
  authorUrl: null,
  publishedAt: null,
  engagementScore: 0,
  searchRank: index + 1,
}
```

### 2.4 Dedupe and push results

Now remove duplicate URLs, limit the result count, and write clean items to the default dataset.

```text
Update src/main.ts to use the normalizeItem helper that is already defined locally in src/main.ts.

Do not add an import for normalizeItem.
Do not create a separate normalizeItem file.

Then:

1. Deduplicate by URL. If two items have the same URL, keep the first one.
2. Keep only the first maxResults normalized items after deduplication.
3. Push all normalized items to the dataset with Actor.pushData().
4. Log how many items were pushed.
```

### 2.5 Review the implementation

Ask your agent to check the final code before you run it.

```text
Review src/main.ts for these details:

- The actor logic should be wrapped in Actor.main(async () => { ... }).
- Do not call Actor.init() or Actor.exit() manually when using Actor.main.
- There should be no process.exit().
- There should be no return statement at the top level of the file.
- The actor should still return cleanly if the RAG Web Browser call fails.
- TypeScript should build without errors.
```

## Step 3: Update the input schema

Also give your agent this:

```text
Update .actor/INPUT_SCHEMA.json to define these input fields:
- topic: string, required, title "Topic", editor textfield, description "The topic to research"
- maxResults: integer, default 5, minimum 1, maximum 20, title "Max Results"
```

## Step 4: Update the Actor details

Your Actor name, title, and description will appear in Apify Console after you deploy. Give your agent this:

```text
Update .actor/actor.json with these Actor details:

- actorSpecification: 1
- name: "catch-me-up"
- title: "Catch Me Up"
- description: "Search the live web for recent information about a topic using smarter LLM-generated queries."

Keep the existing Dockerfile and input schema references.
Do not remove other required actor.json fields from the generated project.
```

## Step 5: Test it

Create a local input file:

```bash
mkdir -p storage/key_value_stores/default
echo '{"topic": "AI agents", "maxResults": 8}' > storage/key_value_stores/default/INPUT.json
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

You should see up to 8 JSON files. Each file contains one dataset item.

Open one result:

```bash
cat storage/datasets/default/000000001.json
```

That JSON file should contain one item with:

```text
id
platform
url
title
text
rawMarkdown
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

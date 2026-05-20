# Lesson 1: Set Up and Explore RAG Web Browser

Goal: Make sure your environment works and see what RAG Web Browser does.

## Part 1: Verify your setup

Run each command:

```bash
node --version
```

```bash
npm --version
```

```bash
apify --version
```

```bash
apify info
```

You should see version numbers for Node, npm, and Apify CLI. `apify info` should show your Apify account and CLI configuration.

If `apify info` says you are not logged in, run:

```bash
apify login
```

If anything else fails, raise your hand.

## Part 2: Explore RAG Web Browser

RAG Web Browser is an Apify marketplace Actor. It searches Google, opens the top results, extracts page content, and returns clean Markdown.

1. Open [RAG Web Browser in Apify Console](https://console.apify.com/actors/3ox4R101TgZz67sLr/input).
2. Set the input:

```json
{
  "query": "latest AI agent developments",
  "maxResults": 3,
  "outputFormats": ["markdown"],
  "removeCookieWarnings": true,
  "requestTimeoutSecs": 40,
  "serpProxyGroup": "GOOGLE_SERP",
  "serpMaxRetries": 2,
  "proxyConfiguration": {
    "useApifyProxy": true
  },
  "scrapingTool": "raw-http",
  "removeElementsCssSelector": "nav, footer, script, style, noscript, svg, img[src^='data:'],\n[role=\"alert\"],\n[role=\"banner\"],\n[role=\"dialog\"],\n[role=\"alertdialog\"],\n[role=\"region\"][aria-label*=\"skip\" i],\n[aria-modal=\"true\"]",
  "htmlTransformer": "none",
  "desiredConcurrency": 5,
  "maxRequestRetries": 1,
  "dynamicContentWaitSecs": 10,
  "debugMode": false
}
```

3. These settings are also included in `reference/rag-web-browser-input.ts`.
4. Click **Start**.
5. Wait about 30 seconds.
6. Open the **Dataset** tab.

Each result has three important parts:

- `searchResult`: what Google showed, including title, description, and URL
- `metadata`: what the page itself says, including actual page title and meta description
- `markdown`: the page content converted into Markdown

You may also see fields like `crawl`, `query`, or `text`.

`crawl` tells you whether the page loaded. Sometimes a page is blocked or times out. That is normal on the web.

Even failed page loads can still be useful because `searchResult` usually has the Google title, description, and URL. Your actor can use that as a fallback.

The raw `markdown` can be messy. It may include navigation, forms, cookie banners, or page footer links. That is why we do not return the raw RAG Web Browser output directly.

Our actor will turn this:

```text
searchResult + metadata + markdown + crawl details
```

into this:

```text
id, url, title, text, searchRank
```

This is the tool we'll wrap. Your actor will call RAG Web Browser, get these results back, and add your own logic on top.

Try 2 or 3 more queries:

```text
latest React framework updates
new JavaScript runtime releases
AI coding agents this week
```

Now you know what RAG Web Browser returns. Let's build an Actor around it.

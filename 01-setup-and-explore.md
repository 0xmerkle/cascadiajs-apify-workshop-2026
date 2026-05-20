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
apify whoami
```

You should see version numbers for Node, npm, and Apify CLI. `apify whoami` should show your Apify username.

If `apify whoami` says you are not logged in, run:

```bash
apify login
```

If anything else fails, raise your hand.

## Part 2: Explore RAG Web Browser

RAG Web Browser is an Apify marketplace Actor. It searches Google, opens the top results, extracts page content, and returns clean Markdown.

1. Open [console.apify.com](https://console.apify.com).
2. Go to Store.
3. Search for `RAG Web Browser`.
4. Open `apify/rag-web-browser`.
5. Click **Start**.
6. Set the input:

```json
{
  "query": "latest AI agent developments",
  "maxResults": 3,
  "outputFormats": ["markdown"]
}
```

7. Leave everything else as default.
8. Click **Start**.
9. Wait about 30 seconds.
10. Open the **Dataset** tab.

Each result has three important parts:

- `searchResult`: what Google showed, including title, description, and URL
- `metadata`: what the page itself says, including actual page title and meta description
- `markdown`: the page content converted into Markdown

This is the tool we'll wrap. Your actor will call RAG Web Browser, get these results back, and add your own logic on top.

Try 2 or 3 more queries:

```text
latest React framework updates
new JavaScript runtime releases
AI coding agents this week
```

Now you know what RAG Web Browser returns. Let's build an Actor around it.

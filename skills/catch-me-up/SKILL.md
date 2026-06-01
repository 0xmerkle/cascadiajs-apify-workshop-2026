---
name: catch-me-up
description: Use when the user asks for recent, latest, current, or web-based information about a topic using their private Apify catch-me-up Actor.
---

# Catch Me Up

Use this skill when the user asks for recent, current, latest, or web-based information about a topic.

Do not use this skill for timeless knowledge, local codebase questions, or tasks that do not need live web research.

## Requirements

This skill calls a private Apify Actor through the bundled script at `scripts/catch-me-up.js`.

The script reads these environment variables at runtime:

- `APIFY_API_TOKEN`: Apify API token with access to the private Actor
- `APIFY_ACTOR_ID`: Actor ID, usually `USERNAME~catch-me-up`

Do not ask the user to paste their Apify token into chat. If either environment variable is missing, tell the user which one to set.

## Usage

Run the bundled script with Node.js, resolving the script path relative to this `SKILL.md` file:

```bash
node scripts/catch-me-up.js "TOPIC_HERE"
```

Optional flags:

```bash
node scripts/catch-me-up.js "TOPIC_HERE" --max-results 5 --time-range week
```

Use:

- `topic`: the user's topic
- `--max-results`: usually `5`
- `--time-range`: `day`, `week`, or `month`

## How To Use Results

The script returns JSON with:

- `topic`: the researched topic
- `actorId`: the Apify Actor ID
- `resultCount`: number of returned results
- `results`: dataset items returned by the Actor

Each result usually includes:

- `title`: source title
- `url`: source URL
- `text`: normalized source text from the Actor
- `rawMarkdown`: capped extracted source markdown for verification
- `searchRank`: source rank from search

Use `text` first. Use `rawMarkdown` only to verify details or inspect source context.

## Response Style

When answering the user:

- Summarize the main developments first.
- Cite source URLs inline.
- Mention uncertainty if sources are thin, stale, or disagree.
- Prefer recent, specific facts over general background.
- Do not claim the search is exhaustive.

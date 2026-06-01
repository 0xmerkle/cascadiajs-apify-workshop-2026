# Build Better Agent Tools with Apify

CascadiaJS 2026 Workshop

AI agents can write code but they can't see what's happening on the live web. In this workshop you'll build and deploy a cloud tool that wraps Apify's RAG Web Browser with your own custom logic, giving any coding agent the ability to research topics using real-time web data.

## What you'll learn

- How Apify Actors work
- How to call an existing marketplace Actor from inside your own Actor
- How to add custom logic, like LLM-powered search planning, on top
- How to deploy to the cloud

## What you'll need

### Accounts

- Apify account at [console.apify.com](https://console.apify.com). Free tier. We're providing credits for all attendees.
- For Lesson 3: an LLM API key. Pick one:
  - OpenAI: [platform.openai.com](https://platform.openai.com). Paid, $5 minimum.
  - Anthropic: [console.anthropic.com](https://console.anthropic.com). Paid, or comes with Claude Code subscription.
  - Google Gemini: [aistudio.google.com](https://aistudio.google.com). Completely free, no credit card.
  - Or skip Lesson 3. The actor works without LLM features.

### Software

#### Git and GitHub

This workshop assumes you already have Git installed and know how to work in a local project folder.

You do not need to clone this workshop during the exercises, but you should have GitHub access available for saving or sharing your work.

```bash
git --version
```

#### Node.js

Use Node.js 18 or higher. Node 22 recommended.

```bash
node --version
```

Use npm 9 or higher.

```bash
npm --version
```

#### Apify CLI

Install:

```bash
npm install -g apify-cli
```

Log in:

```bash
apify login
```

Verify:

```bash
apify --version
apify info
```

#### Coding agent

You need access to a coding agent such as Claude Code, Cursor, Codex CLI, or similar. The exercises include prompts that you will give to your agent while building the Actor.

### Windows note

Claude Code requires WSL2. Install everything inside WSL.

### Preflight check

Run all of these before the workshop:

```bash
git --version
node --version
npm --version
apify --version
apify info
```

If any command fails, fix it before the workshop or raise your hand when you arrive.

## Lessons

| Lesson | What you'll do | Time |
|--------|---------------|------|
| [01](./01-setup-and-explore.md) | Set up and explore RAG Web Browser | ~10 min |
| [02](./02-build-your-actor.md) | Build your Actor | ~30 min |
| [03](./03-add-smart-search.md) | Add smart search with an LLM | ~15 min |
| [04](./04-deploy.md) | Deploy to Apify cloud | ~10 min |
| [05](./05-bonus-agent-skill.md) | Bonus: install an agent skill | ~10 min |

The `reference/` folder contains copy-paste helpers for parts that should be exact, including the RAG Web Browser input settings and LLM calls. The `skills/` folder contains a cross-agent skill for calling your deployed Actor.

Stuck? Raise your hand.

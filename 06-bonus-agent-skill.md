# Lesson 6: Bonus Agent Skill

Goal: Install a skill so your coding agent knows how to call your private Actor.

Your Actor can stay private. The skill uses your Apify API token at runtime, so only agents running in your environment can call it.

## Step 1: Set environment variables

Get your Apify token from:

```text
console.apify.com/settings/integrations
```

Then set:

```bash
export APIFY_API_TOKEN=your-token-here
export APIFY_ACTOR_ID=your-username~catch-me-up
```

Use the Actor ID from your deployed Actor page. It usually looks like:

```text
username~catch-me-up
```

Do not paste your token into your coding agent chat.

## Step 2: Install the skill

This workshop repo includes a skill at:

```text
skills/catch-me-up
```

Install it with:

```bash
npx skills add 0xmerkle/cascadiajs-apify-workshop-2026 --skill catch-me-up
```

The installer will ask which coding agent you want to install into. Pick the agent you use, such as Claude Code, Codex, Cursor, Gemini CLI, or GitHub Copilot.

For a global install across projects:

```bash
npx skills add 0xmerkle/cascadiajs-apify-workshop-2026 --skill catch-me-up -g
```

### Install for a specific agent

If the wizard does not install into the agent you want, use `--agent`.

Claude Code:

```bash
npx skills add 0xmerkle/cascadiajs-apify-workshop-2026 --skill catch-me-up --agent claude-code
```

Codex:

```bash
npx skills add 0xmerkle/cascadiajs-apify-workshop-2026 --skill catch-me-up --agent codex
```

Cursor:

```bash
npx skills add 0xmerkle/cascadiajs-apify-workshop-2026 --skill catch-me-up --agent cursor
```

Gemini CLI:

```bash
npx skills add 0xmerkle/cascadiajs-apify-workshop-2026 --skill catch-me-up --agent gemini-cli
```

Use `-g` with any of those commands if you want a global install:

```bash
npx skills add 0xmerkle/cascadiajs-apify-workshop-2026 --skill catch-me-up --agent claude-code -g
```

### If Claude Code does not see the skill

Try installing explicitly:

```bash
npx skills add 0xmerkle/cascadiajs-apify-workshop-2026 --skill catch-me-up --agent claude-code
```

Then restart Claude Code from the same project folder.

Check that the skill exists:

```bash
ls .claude/skills/catch-me-up
```

If you installed globally, check:

```bash
ls ~/.claude/skills/catch-me-up
```

## Step 3: Ask your agent

Try:

```text
Catch me up on the latest in AI coding agents.
```

Or:

```text
Use the catch-me-up skill to find recent news about React server components.
```

The skill tells your agent when to use the Actor, how to run the bundled script, and how to interpret the returned summaries and source markdown.

You now have a private cloud research tool your coding agent can call on demand.

# Lesson 5: Deploy to Apify Cloud

Goal: Push the Actor to the cloud so it can be called from anywhere.

## Step 1: Set up secrets

If you added LLM features in Lesson 3 or Lesson 4, store your key as an Apify secret.

For OpenAI:

```bash
apify secrets add openAiApiKey "your-key-here"
```

For Anthropic:

```bash
apify secrets add anthropicApiKey "your-key-here"
```

For Gemini:

```bash
apify secrets add geminiApiKey "your-key-here"
```

Then tell your coding agent to map the secret into the Actor environment.

For OpenAI:

```text
Add environmentVariables to .actor/actor.json so the deployed Actor gets OPENAI_API_KEY from the Apify secret:

"environmentVariables": {
  "OPENAI_API_KEY": "@openAiApiKey"
}
```

For Anthropic:

```text
Add environmentVariables to .actor/actor.json so the deployed Actor gets ANTHROPIC_API_KEY from the Apify secret:

"environmentVariables": {
  "ANTHROPIC_API_KEY": "@anthropicApiKey"
}
```

For Gemini:

```text
Add environmentVariables to .actor/actor.json so the deployed Actor gets GEMINI_API_KEY from the Apify secret:

"environmentVariables": {
  "GEMINI_API_KEY": "@geminiApiKey"
}
```

If you didn't add LLM features, skip this step.

## Step 2: Deploy

Run:

```bash
apify push
```

If the CLI asks for an Actor name, use:

```text
catch-me-up
```

If you see a TypeScript build error, fix it locally first:

```bash
npm run build
```

Then push again:

```bash
apify push
```

## Step 3: Test in the Console

1. Open [console.apify.com](https://console.apify.com).
2. Go to **Actors**.
3. Open `catch-me-up`.
4. Click **Start**.
5. Enter:

```json
{
  "topic": "AI agents",
  "maxResults": 5,
  "timeRange": "week"
}
```

6. Click **Start**.
7. Open the **Dataset** tab.

You should see normalized web results.

## Step 4: Try the API

Get your Apify token from:

```text
console.apify.com/settings/integrations
```

Call your Actor:

```bash
curl -X POST "https://api.apify.com/v2/acts/YOUR_USERNAME~catch-me-up/runs" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_APIFY_TOKEN" \
  -d '{"topic": "AI agents", "maxResults": 5}'
```

That starts a run. It returns run metadata.

If you want to wait for results directly, use the sync dataset endpoint:

```bash
curl -X POST "https://api.apify.com/v2/acts/YOUR_USERNAME~catch-me-up/run-sync-get-dataset-items?token=YOUR_APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"topic": "AI agents", "maxResults": 5}'
```

Your tool is live. Any agent, script, or automation can call it. You went from zero to deployed cloud tool.

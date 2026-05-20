# Lesson 4: Add Filtering and Summaries

Goal: Use the LLM to drop irrelevant results and summarize the useful ones.

This lesson requires an LLM API key. If you skipped Lesson 3, skip this one too.

## Why filter and summarize?

Even with better queries, some results won't be relevant.

The LLM can look at each normalized result and decide:

```text
relevant
borderline
irrelevant
```

Then your actor can keep the useful items and drop the noise.

The LLM can also turn messy raw markdown into a short useful summary. The final output keeps both:

- `text`: the LLM summary your agent can read quickly
- `rawMarkdown`: the capped source markdown for reference and verification

## Step 1: Copy the LLM functions

From the same reference file you used in Lesson 3, copy the `filterResults` and `summarizeResults` functions into your project.

Use one of these:

- `reference/llm-helpers-openai.ts`
- `reference/llm-helpers-anthropic.ts`
- `reference/llm-helpers-gemini.ts`

Put them next to `interpretTopic`, either in `src/llm.ts` or directly in `src/main.ts`.

## Step 2: Wire it in

Give this to your coding agent:

```text
I added filterResults and summarizeResults functions to my project from the workshop reference file.

Wire it into src/main.ts:

1. After normalizing and deduplicating the results, call filterResults(normalizedItems, topic, apiKey)
2. Use the same API key environment variable as Lesson 3
3. filterResults returns a filtered array containing only relevant and borderline items
4. After filtering, call summarizeResults(filteredItems, topic, apiKey)
5. summarizeResults returns the same items, but with item.text replaced by an LLM summary
6. Apply the final maxResults limit after filtering and summarizing
7. Push the final items to the dataset
8. If there is already a slice(0, maxResults) before filtering, move it to after summarizing
9. If filterResults throws an error or no API key is set, skip filtering and keep all normalized items
10. If summarizeResults throws an error or no API key is set, skip summarizing and keep the existing text fallback
11. Keep rawMarkdown in the final dataset item so users can inspect the source content
12. Log whether filtering and summarizing were used, how many items were kept, and how many items were summarized
```

The flow should now look like this:

```text
input topic
  -> interpret topic into queries
  -> call RAG Web Browser for each query
  -> normalize
  -> dedupe
  -> filter with LLM
  -> summarize with LLM
  -> push dataset items
```

## Step 3: Test

Run:

```bash
apify run
```

Check the output count:

```bash
ls storage/datasets/default
```

Compare the results to Lesson 3. You should usually see fewer results, and the remaining ones should be more on-topic.

Open one result:

```bash
cat storage/datasets/default/000000001.json
```

The `text` field should now be a concise summary, not raw page content. The `rawMarkdown` field should still be present for reference.

If all results disappeared, your filter may be too strict. Tell your agent:

```text
Make the relevance filter keep both "relevant" and "borderline" items. Only drop "irrelevant" items.
```

If filtering or summarizing fails, your actor should still return normalized results. Do not let an LLM error break the actor.

Your actor now interprets topics, searches smart, filters noise, and summarizes useful source material. Let's deploy it.

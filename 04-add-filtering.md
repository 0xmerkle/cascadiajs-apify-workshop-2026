# Lesson 4: Add Relevance Filtering

Goal: Use the LLM to classify each result and drop the irrelevant ones.

This lesson requires an LLM API key. If you skipped Lesson 3, skip this one too.

## Why filter?

Even with better queries, some results won't be relevant.

The LLM can look at each normalized result and decide:

```text
relevant
borderline
irrelevant
```

Then your actor can keep the useful items and drop the noise before writing to the dataset.

## Step 1: Copy the filter function

From the same reference file you used in Lesson 3, copy the `filterResults` function into your project.

Use one of these:

- `reference/llm-helpers-openai.ts`
- `reference/llm-helpers-anthropic.ts`
- `reference/llm-helpers-gemini.ts`

Put it next to `interpretTopic`, either in `src/llm.ts` or directly in `src/main.ts`.

## Step 2: Wire it in

Give this to your coding agent:

```text
I added a filterResults function to my project from the workshop reference file.

Wire it into src/main.ts:

1. After normalizing and deduplicating the results, call filterResults(normalizedItems, topic, apiKey)
2. Use the same API key environment variable as Lesson 3
3. filterResults returns a filtered array containing only relevant and borderline items
4. Push only the filtered items to the dataset
5. If filterResults throws an error or no API key is set, skip filtering and push all normalized items
6. Log whether filtering was used and how many items were kept
```

The flow should now look like this:

```text
input topic
  -> interpret topic into queries
  -> call RAG Web Browser for each query
  -> normalize
  -> dedupe
  -> filter with LLM
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

If all results disappeared, your filter may be too strict. Tell your agent:

```text
Make the relevance filter keep both "relevant" and "borderline" items. Only drop "irrelevant" items.
```

If filtering fails, your actor should still return all normalized results. Do not let an LLM error break the actor.

Your actor now interprets topics, searches smart, and filters noise. Let's deploy it.

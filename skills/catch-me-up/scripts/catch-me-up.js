#!/usr/bin/env node

function printUsage() {
    console.error('Usage: node catch-me-up.js "topic" [--max-results 5] [--time-range week]');
}

function readFlag(name, fallback) {
    const index = process.argv.indexOf(name);
    return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const topic = process.argv[2];

if (!topic || topic.startsWith('--')) {
    printUsage();
    process.exit(1);
}

const token = process.env.APIFY_API_TOKEN;
const actorId = process.env.APIFY_ACTOR_ID;

if (!token) {
    console.error('Missing APIFY_API_TOKEN environment variable.');
    process.exit(1);
}

if (!actorId) {
    console.error('Missing APIFY_ACTOR_ID environment variable, for example USERNAME~catch-me-up.');
    process.exit(1);
}

const maxResults = Number(readFlag('--max-results', '5'));
const timeRange = readFlag('--time-range', 'week');

if (!Number.isInteger(maxResults) || maxResults < 1 || maxResults > 20) {
    console.error('Invalid --max-results value. Use an integer from 1 to 20.');
    process.exit(1);
}

if (!['day', 'week', 'month'].includes(timeRange)) {
    console.error('Invalid --time-range value. Use day, week, or month.');
    process.exit(1);
}

const url = `https://api.apify.com/v2/acts/${encodeURIComponent(actorId)}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}`;

const response = await fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        topic,
        maxResults,
        timeRange,
    }),
});

if (!response.ok) {
    const body = await response.text();
    console.error(`Apify request failed with status ${response.status}: ${body}`);
    process.exit(1);
}

const items = await response.json();

console.log(JSON.stringify({
    topic,
    actorId,
    resultCount: Array.isArray(items) ? items.length : 0,
    results: items,
}, null, 2));

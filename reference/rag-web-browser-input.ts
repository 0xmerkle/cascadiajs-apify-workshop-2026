export function createRagWebBrowserInput(query: string, maxResults: number) {
    return {
        debugMode: false,
        maxResults,
        outputFormats: ['markdown'],
        query,
        removeCookieWarnings: true,
        requestTimeoutSecs: 40,
        serpProxyGroup: 'GOOGLE_SERP',
        serpMaxRetries: 2,
        proxyConfiguration: {
            useApifyProxy: true,
        },
        scrapingTool: 'raw-http',
        removeElementsCssSelector: `nav, footer, script, style, noscript, svg, img[src^='data:'],
[role="alert"],
[role="banner"],
[role="dialog"],
[role="alertdialog"],
[role="region"][aria-label*="skip" i],
[aria-modal="true"]`,
        htmlTransformer: 'none',
        desiredConcurrency: 5,
        maxRequestRetries: 1,
        dynamicContentWaitSecs: 10,
    };
}

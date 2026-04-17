const lcjs = require('@lightningchart/lcjs')

const { lightningChart, Themes } = lcjs

const chart = lightningChart({
            resourcesBaseUrl: new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'resources/',
        })
    .TreeMapChart({
        legend: { visible: false },
        theme: (() => {
    const t = Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined
    const smallView = window.devicePixelRatio >= 2
    if (!window.__lcjsDebugOverlay) {
        window.__lcjsDebugOverlay = document.createElement('div')
        window.__lcjsDebugOverlay.style.cssText = 'position:fixed;top:0;left:0;background:rgba(0,0,0,0.7);color:#fff;padding:4px 8px;z-index:99999;font:12px monospace;pointer-events:none'
        if (document.body) document.body.appendChild(window.__lcjsDebugOverlay)
        setInterval(() => {
            if (!window.__lcjsDebugOverlay.parentNode && document.body) document.body.appendChild(window.__lcjsDebugOverlay)
            window.__lcjsDebugOverlay.textContent = window.innerWidth + 'x' + window.innerHeight + ' dpr=' + window.devicePixelRatio + ' small=' + (window.devicePixelRatio >= 2)
        }, 500)
    }
    return t && smallView ? lcjs.scaleTheme(t, 0.5) : t
})(),
textRenderer: window.devicePixelRatio >= 2 ? lcjs.htmlTextRenderer : undefined,
    })
    .setTitle('Python installation file sizes - Click on Node to drilldown')
    .setCursorFormatting((_, hit) => {
        return [
            [{ text: hit.name, rowFillStyle: chart.getTheme().cursorResultTableHeaderBackgroundFillStyle }],
            hit.value < 2000
                ? [hit.value.toFixed(0), 'B']
                : hit.value < 2000_000
                ? [(hit.value / 1000).toFixed(0), 'KB']
                : [(hit.value / 1000_000).toFixed(0), 'MB'],
        ]
    })

fetch(new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'examples/assets/1505/file-sizes.json')
    .then((r) => r.json())
    .then((fileSizes) => {
        chart.setData(fileSizes)
    })

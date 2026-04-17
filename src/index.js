window.lcjsSmallView = window.devicePixelRatio >= 2
if (!window.__lcjsDebugOverlay) {
    window.__lcjsDebugOverlay = document.createElement('div')
    window.__lcjsDebugOverlay.style.cssText = 'position:fixed;top:10px;left:10px;background:rgba(0,0,0,0.7);color:#fff;padding:4px 8px;z-index:99999;font:12px monospace;pointer-events:none'
    const attach = () => { if (document.body && !window.__lcjsDebugOverlay.parentNode) document.body.appendChild(window.__lcjsDebugOverlay) }
    attach()
    setInterval(() => {
        attach()
        window.__lcjsDebugOverlay.textContent = window.innerWidth + 'x' + window.innerHeight + ' dpr=' + window.devicePixelRatio + ' small=' + window.lcjsSmallView
    }, 500)
}
const lcjs = require('@lightningchart/lcjs')

const { lightningChart, Themes } = lcjs

const chart = lightningChart({
            resourcesBaseUrl: new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'resources/',
        })
    .TreeMapChart({
        legend: { visible: false },
        theme: (() => {
    const t = Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined
    return t && window.lcjsSmallView ? lcjs.scaleTheme(t, 0.5) : t
})(),
textRenderer: window.lcjsSmallView ? lcjs.htmlTextRenderer : undefined,
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

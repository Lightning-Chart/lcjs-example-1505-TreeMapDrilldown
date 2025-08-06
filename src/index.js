const lcjs = require('@lightningchart/lcjs')

const { lightningChart, Themes } = lcjs

const chart = lightningChart({
            resourcesBaseUrl: new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'resources/',
        })
    .TreeMapChart({
        legend: { visible: false },
        theme: Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined,
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

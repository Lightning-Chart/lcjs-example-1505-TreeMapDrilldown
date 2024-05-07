const lcjs = require('@arction/lcjs')

const { lightningChart, Themes } = lcjs

const chart = lightningChart({
            resourcesBaseUrl: new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'resources/',
        })
    .TreeMapChart({
        theme: Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined,
    })
    .setTitle('Python installation file sizes - Click on Node to drilldown')
    .setCursorResultTableFormatter((builder, node) => {
        builder.addRow(node.name)
        if (node.value < 2_000) builder.addRow(node.value.toFixed(0), 'B')
        else if (node.value < 2_000_000) builder.addRow((node.value / 1000).toFixed(1), 'KB')
        else if (node.value < 2_000_000_000) builder.addRow((node.value / 1000_000).toFixed(1), 'MB')
        return builder
    })

fetch(new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'examples/assets/1505/file-sizes.json')
    .then((r) => r.json())
    .then((fileSizes) => {
        chart.setData(fileSizes)
    })

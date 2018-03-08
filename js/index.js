// index.js
import * as d3 from 'd3';

console.log('index.js loaded')

// global data and image paths
const dataDirName = 'lesmis'
// const dataDirName = 'moreno_names'
// const dataDirName = 'astroph'

export const dataPath = 'data/' + dataDirName + '/'
export const dataPathJSON = 'data/' + dataDirName + '/' + dataDirName + '.json'

export function dataPathLayerJSON(peel) {
    return 'data/' + dataDirName + '/' + dataDirName + '-layer-' + peel + '.json'
}
export function imagePathLayerOrg(peel) {
    return 'data/' + dataDirName + '/images/' + 'layer' + peel + '.png'
}
export function imagePathLayerFD(peel) {
    return 'data/' + dataDirName + '/images/' + 'layer-' + peel + '.png'
}
export function imagePathLayerContour(peel) {
    return 'data/' + dataDirName + '/images/' + 'contour-shaded-layer-' + peel + '.png'
}
export function imagePathOverview2DBackground() {
    return 'data/' + dataDirName + '/images/' + dataDirName + '-bw.png'
}

window.d3 = d3;
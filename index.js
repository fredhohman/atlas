// index.js
import * as d3 from 'd3';

console.log('index.js loaded')

// global data path
const dataDirName = 'moreno_names'
export const dataPath = 'data/' + dataDirName + '/'
export const dataPathJSON = 'data/' + dataDirName + '/' + dataDirName + '.json'
export function dataPathLayerJSON(peel) {
    return 'data/' + dataDirName + '/' + dataDirName + '-layer-' + peel + '-data.json'
}
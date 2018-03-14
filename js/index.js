import * as d3 from "d3";

// global data and image paths
// const dataDirName = 'lesmis' // good but small
// const dataDirName = 'moreno_names' //good but small
const dataDirName = "astroph"; //good
// const dataDirName = 'stackexchange' // bad
// const dataDirName = 'dblp' // bad
// const dataDirName = 'patentcite' // good and medium/big

export const dataPath = "data/" + dataDirName + "/";
export const dataPathJSON = "data/" + dataDirName + "/" + dataDirName + ".json";

export function dataPathLayerJSON(peel) {
  return "data/" + dataDirName + "/" + dataDirName + "-layer-" + peel + ".json";
}
export function imagePathLayerOrg(peel) {
  return "data/" + dataDirName + "/images/" + "layer" + peel + ".png";
}
export function imagePathLayerFD(peel) {
  return "data/" + dataDirName + "/images/" + "layer-" + peel + ".png";
}
export function imagePathLayerContour(peel) {
  return (
    "data/" + dataDirName + "/images/" + "contour-shaded-layer-" + peel + ".png"
  );
}
export function imagePathOverview2DBackground() {
  return "data/" + dataDirName + "/images/" + dataDirName + "-bw.png";
}

window.d3 = d3;

function reloadPage() {
  window.location.reload();
}

d3.select("#header-text-span").on("click", reloadPage);
// .style("cursor", "pointer");

d3.json(dataPathJSON, function(error, data) {
  if (error) {
    return console.error(error);
  }
  
  // set nav data
  var navNumFormat = d3.format(",");
  d3.select("#graph-value").text(data.name);
  d3.select("#vertices-value").text(navNumFormat(data.vertices));
  d3.select("#edges-value").text(navNumFormat(data.edges));
  d3.select("#graph-description").text(data.description);
});

d3
  .select("#header-icon-link")
  .attr("href", "https://github.com/fredhohman/graph-playground");
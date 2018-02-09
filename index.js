// index.js
import * as contour from 'd3-contour';
import * as d3 from 'd3';
import $ from "jquery";
import { geoStereographic } from 'd3';


let numOfCardsUp = 0;
window.numOfCardsUp = numOfCardsUp;

d3.json('data/moreno_names.json', function (error, data) {

    if (error) {
        return console.error(error);
    }

    // some globals for console debugging
    console.log(data)
    window.data = data
    window.d3 = d3


    // set nav data
    var navNumFormat = d3.format(',');
    d3.select("#graph-name").text(data.name);
    d3.select("#vertices-value").text(navNumFormat(data.vertices));
    d3.select("#edges-value").text(navNumFormat(data.edges));
    d3.select("#graph-description").text(data.description);
})

function reloadPage() {
    window.location.reload();
}

d3.select('#header-text-span')
  .on('click', reloadPage)
  .style('cursor', 'pointer')

export default function addCard(d) {
    console.log('add card', d)
    numOfCardsUp += 1;
    cardMessage();

    var layers = d3.select('#layers')
                   .append('div')
                   .attr('class', 'card-border-wrapper')
                   .attr('id', 'card-' + d.peel)
                   .append('div')
                   .attr('class', 'card')
                   .style('border-left', function() { return '5px solid ' + ribbonColor(d.peel) })

    var cardTop = layers.append('div').attr('class', 'card-top-wrapper')

    cardTop.append('div')
          .attr('class', 'card-title-wrapper')
          .append('h3')
          .attr('class', 'card-title')
          .text('Layer ' + d.peel)

    cardTop.append('div')
          .attr('class', 'card-tabs-wrapper')
          .append('h3')
          .attr('class', 'card-tabs')
          .text('Tabs')

    cardTop.append('div')
          .attr('class', 'card-icon-wrapper')
          .append("i")
          .attr('class', 'material-icons md-dark')
          .text('close')
          .style('cursor', 'pointer')
          .on('click', function() { closeCard(d) } )

    var cardTextValueFormat = d3.format(",.3f")

    var cardBottom = layers.append('div').attr('class', 'card-bottom-wrapper')

    var cardText = cardBottom.append('div')
                         .attr('class', 'card-text-wrapper')

    cardText.append('span')
            .attr('class', 'card-text-item')
            .text('vertices: ')
            .append('span')
            .attr('class', 'card-text-item-value')
            .text(d.vertices)

    cardText.append('span')
            .attr('class', 'card-text-item')
            .text('edges: ')
            .append('span')
            .attr('class', 'card-text-item-value')
            .text(d.edges)

    cardText.append('span')
            .attr('class', 'card-text-item')
            .text('components: ')
            .append('span')
            .attr('class', 'card-text-item-value')
            .text(d.components)

    cardText.append('span')
            .attr('class', 'card-text-item')
            .text('clustering: ')
            .append('span')
            .attr('class', 'card-text-item-value')
            .text(cardTextValueFormat(d.clustering))

    cardText.append('span')
            .attr('class', 'card-text-item')
            .text('clones: ')
            .append('span')
            .attr('class', 'card-text-item-value')
            .text(cardTextValueFormat(d.clones))

    cardBottom.append('div')
        .attr('class', 'card-image-wrapper')
        .append('img')
        .attr('src', 'images/moreno_names/layer' + d.peel + '.png')
        //   .attr('width', '100%')
        .style('display', 'block')
        .style('max-height', '100%')
        .style('margin', 'auto')

}

function closeCard(d) {
    console.log('close card')
    numOfCardsUp -= 1;
    d3.select('#card-' + d.peel).remove();
    cardMessage();
}

function cardMessage() {
    console.log('card message', numOfCardsUp)
    if (numOfCardsUp === 0) {
        d3.select('#no-card-message').style('display', 'flex')
    } else {
        d3.select('#no-card-message').style('display', 'none')
    }
}








//  single layer
// var layer = 6;

// bible 
// var layers = [1,2,3,4,5,6,7,8,9,10,12,15];

// names
// var layers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15];

// var layers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,32,35,36,37,38,39,40,41,42,43,45,46,48,51,52,55,56]

// jazz
// var layers = [1, 2, 3, 4, 5, 10, 20, 29];

// console.log(d3.select("#layer-select"))

// d3.select("#layer-select")
//     .selectAll("option")
//     .data(layers)
//     .enter()
//     .append("option")
//     .attr("value", function(d) { return d })
//     .text(function (d) { return String(d) })

// d3.select("#layer-select").on('change', changeLayer)

// var colors = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(1, 10));

// var svg = d3.select("svg"),
//     width = +svg.attr("width"),
//     height = +svg.attr("height"),
//     margin = { top: 50, right: 50, bottom: 50, left: 50 };

// var x = d3.scaleLinear()
//     .rangeRound([margin.left, width - margin.right]);

// var y = d3.scaleLinear()
//     .rangeRound([height - margin.bottom, margin.top]);

// function changeLayer() {

//     svg.selectAll("*").remove();

//     var layer = d3.select('#layer-select').property('value')
//     console.log(layer)

//     d3.json("data/bible-l" + String(layer) + "-preprocessed.json", function (error, data) {
//     // d3.json("data/facebook-nips-preprocessed.json", function (error, data) {
//         if (error) throw error;

//         console.log(data.nodes.length);

//         x.domain(d3.extent(data.nodes, function (d) { return d.location[0]; })).nice();
//         y.domain(d3.extent(data.nodes, function (d) { return d.location[1]; })).nice();

//         svg.append("g")
//             .attr("stroke", "white")
//             .attr("stroke-width", 0.5)
//             .selectAll("circle")
//             .data(data.nodes.filter(function (d) {
//                 // return +d.id.split('_')[1] === layer
//                 return d
//             }))
//             .enter().append("circle")
//             .attr("cx", function (d) { return x(d.location[0]); })
//             .attr("cy", function (d) { return y(d.location[1]); })
//             .attr("r", 2)
//             .attr("opacity", 1.0)
//             .attr("fill", function (d) { return '#' + d.color.split('x')[1] });

//         svg.insert("g", "g")
//             .attr("fill", "none")
//             .attr("opacity", 0.8)
//             .attr("stroke", function () {
//                 // return colors(layer)
//                 return d3.select("circle").attr("fill")
//             })
//             .attr("stroke-linejoin", "round")
//             .selectAll("path")
//             .data(contour.contourDensity()
//                 .x(function (d) { return x(d.location[0]); })
//                 .y(function (d) { return y(d.location[1]); })
//                 .size([width, height])
//                 .bandwidth(60)
//                 (data.nodes.filter(function (d) {
//                     // return +d.id.split('_')[1] === layer })
//                     return d
//                 })
//                 ))
//             .enter().append("path")
//             .attr("d", d3.geoPath());

//         svg.append("g")
//             .attr("transform", "translate(0," + (height - margin.bottom) + ")")
//             .call(d3.axisBottom(x))
//             .select(".tick:last-of-type text")
//             .select(function () { return this.parentNode.appendChild(this.cloneNode()); })
//             .attr("y", -3)
//             .attr("dy", null)
//             .attr("font-weight", "bold")
//             .text("x");

//         svg.append("g")
//             .attr("transform", "translate(" + margin.left + ",0)")
//             .call(d3.axisLeft(y))
//             .select(".tick:last-of-type text")
//             .select(function () { return this.parentNode.appendChild(this.cloneNode()); })
//             .attr("x", 3)
//             .attr("text-anchor", "start")
//             .attr("font-weight", "bold")
//             .text("y");
//     });

// }



    
// multiple backgrounds, but kills performance
// var overviewImage = ''
// for (var layer in layers.reverse()) {
//     overviewImage += 'url(images/layer' + String(layers[layer]) + '.png), '
// }
// console.log(overviewImage)
// overviewImage = overviewImage.substring(0, overviewImage.length - 2);
// d3.select("#overview-image")
//     .style('background-image', overviewImage)


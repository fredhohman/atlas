// index.js
import * as contour from 'd3-contour';
import * as d3 from 'd3';

var layer = 1;
var layers = [1,2,3];

var colors = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(1, 10));

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    margin = { top: 50, right: 50, bottom: 50, left: 50 };

var x = d3.scaleLinear()
    .rangeRound([margin.left, width - margin.right]);

var y = d3.scaleLinear()
    .rangeRound([height - margin.bottom, margin.top]);

d3.json("data/facebook-nips-preprocessed.json", function (error, data) {
    if (error) throw error;

    // console.log(data.nodes);

    x.domain(d3.extent(data.nodes, function (d) { return d.location[0]; })).nice();
    y.domain(d3.extent(data.nodes, function (d) { return d.location[1]; })).nice();

    svg.insert("g", "g")
        .attr("fill", "none")
        .attr("stroke", function(){ return colors(layer) })
        .attr("stroke-linejoin", "round")
        .selectAll("path")
        .data(contour.contourDensity()
            .x(function (d) { return x(d.location[0]); })
            .y(function (d) { return y(d.location[1]); })
            .size([width, height])
            .bandwidth(20)
            (data.nodes.filter(function (d) { 
                return +d.id.split('_')[1] === layer })
            ))
        .enter().append("path")
        .attr("d", d3.geoPath());

    svg.append("g")
        .attr("stroke", "white")
        .attr("stroke-width", 0.5)
        .selectAll("circle")
        .data(data.nodes.filter(function (d) { return +d.id.split('_')[1] === layer }))
        .enter().append("circle")
        .attr("cx", function (d) { return x(d.location[0]); })
        .attr("cy", function (d) { return y(d.location[1]); })
        .attr("r", 2)
        .attr("opacity", 0.5)
        .attr("fill", function(d){ return '#' + d.color.split('x')[1] });

    svg.append("g")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(d3.axisBottom(x))
        .select(".tick:last-of-type text")
        .select(function () { return this.parentNode.appendChild(this.cloneNode()); })
        .attr("y", -3)
        .attr("dy", null)
        .attr("font-weight", "bold")
        .text("x");

    svg.append("g")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(y))
        .select(".tick:last-of-type text")
        .select(function () { return this.parentNode.appendChild(this.cloneNode()); })
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("y");
});
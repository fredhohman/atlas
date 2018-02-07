import * as d3 from 'd3';

// draggable ribbon 
console.log('draggable-ribbon')

d3.json('data/moreno_names.json', function(error, data) {

    if (error) {
        return console.error(error);        
    }
    
    // some globals for console debugging
    console.log(data)
    window.data = data
    window.d3 = d3

    // set nav data
    var navFormat = d3.format(',')
    d3.select("#vertices-value").text(navFormat(data.vertices))
    d3.select("#edges-value").text(navFormat(data.edges))

    var ribbonMargin = { top: 20, right: 10, bottom: 60, left: 35 };
    var ribbonWidth = document.getElementById("ribbon").offsetWidth - ribbonMargin.left - ribbonMargin.right
    var ribbonHeight = document.getElementById("ribbon").offsetHeight - ribbonMargin.top - ribbonMargin.bottom
    // var aspectRatio = '32:2';
    // var viewBox = '0 0 ' + aspectRatio.split(':').join(' ');

    var ribbon = d3.select("#ribbon").append("svg")
        .attr("width", ribbonWidth + ribbonMargin.left + ribbonMargin.right)
        .attr("height", ribbonHeight + ribbonMargin.top + ribbonMargin.bottom)
        .append("g")
        .attr("transform", "translate(" + ribbonMargin.left + "," + ribbonMargin.top + ")");

    // background for debugging
    // ribbon.append('rect')
    //         .attr('width', ribbonWidth)
    //         .attr('height', ribbonHeight)
    //         .style('fill', '#eeeeee');

    var ribbonTextColor = '#222222'
    var x = d3.scaleLinear().range([0, ribbonWidth]);
    var y = d3.scaleBand().range([ribbonHeight, 0]).padding(0.3);
    var ribbonColor = d3.scaleLinear()
                        .domain(d3.extent(data.layers, function(d) { return d.peel }))
                        .interpolate(d3.interpolateHcl)
                        .range([d3.rgb("#0000ff"), d3.rgb('#00ff80')]);

    x.domain([0, d3.max(data.layers, function(d) { return d.edges })])
    y.domain(data.layers.map(function(d){ return d.peel }))
    y.domain(Array.from(new Array(d3.max(data.layers, function(d) { return d.peel })), (x, i) => i+1))

    ribbon.selectAll('.bar')
          .data(data.layers)
        .enter().append('rect')
          .attr('class', "bar")
          .attr('width', function (d) { return x(d.edges) })
          .attr('y', function(d) { return y(d.peel) })
          .attr('height', y.bandwidth())
          .style('fill', function(d) { return ribbonColor(d.peel) })
          .on('click', function(d) {console.log(d) });

    ribbon.append('g')
          .attr('transform', "translate(0," + ribbonHeight + ")")
          .attr('class', 'x-axis')
          .call(d3.axisBottom(x).ticks(3))

    ribbon.append("text")
          .attr("transform", "translate(" + ((ribbonWidth/ 2) - ribbonMargin.right) + " ," + (ribbonHeight + ribbonMargin.top + 20) + ")")
          .style("text-anchor", "middle")
          .text('edges')
          .attr('id', 'ribbonDrag')

    ribbon.append('g')
          .attr('class', 'y-axis')
          .call(d3.axisLeft(y))
          .selectAll('.tick text')
          .style('fill', function (d) {return data.peels.includes(d) ? '#222222' : '#cccccc' })
          .style('opacity', function (d) { return data.peels.includes(d) ? '1' : '0' })

    // draggable ribbon
    let startX = 0, startWidth;

    var ribbonDrag = document.getElementById('ribbonDrag');
    var glass = document.getElementById('glass');
    ribbonDrag.addEventListener('mousedown', startDrag, false);
    glass.addEventListener('mouseup', endDrag, false);

    function startDrag() {
        console.log('ribbon down')

        var layersDiv = document.getElementById('layers');

        startWidth = layersDiv.offsetWidth;
        layersDiv.style.flex = 'none';
        layersDiv.style.width = startWidth + 'px';
        startX = event.clientX;

        glass.style = 'display: block;';
        glass.addEventListener('mousemove', drag, false);
    }

    function endDrag() {
        console.log('ribbon up')

        glass.removeEventListener('mousemove', drag, false);
        glass.style = '';
    }

    function drag(event) {
        var layersDiv = document.getElementById('layers');
        var delta = event.clientX - startX;
        layersDiv.style.width = (startWidth - delta) + "px";
    }

})


import * as d3 from 'd3';
import tip from 'd3-tip';
import addCard from './index.js';


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
    
    var ribbonMargin = { top: 60, right: 10, bottom: 0, left: 35 };
    var ribbonWidth = document.getElementById("ribbon").clientWidth - ribbonMargin.left - ribbonMargin.right
    var ribbonHeight = document.getElementById("ribbon").clientHeight - ribbonMargin.top - ribbonMargin.bottom - 55 // negative last term is a "bug", shrinks svg so scroll bar doesn't appear
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
    // var xInner = d3.scaleLinear().range([0, ribbonWidth]);
    var y = d3.scaleBand().range([ribbonHeight, 0]).padding(0.3);

    x.domain([0, d3.max(data.layers, function(d) { return d.edges })])
    // xInner.domain([0, d3.max(data.layers, function(d) { return d.nodes })])
    // y.domain(data.layers.map(function (d) { return d.peel })) // no spaces in ribbon y-axis
    y.domain(Array.from(new Array(d3.max(data.layers, function(d) { return d.peel })), (x, i) => i+1)) // spaces in ribbon y-axis
    var ribbonColor = d3.scaleLinear()
        .domain(d3.extent(data.layers, function (d) { return d.peel }))
        .interpolate(d3.interpolateHcl)
        .range([d3.rgb("#0000ff"), d3.rgb('#00ff80')]);

    // save color palette from data once and bind to window, little cheeky
    window.ribbonColor = ribbonColor;


    function addRibbonSVG() {
        // is this a good idea...
    }
    // addRibbonSVG();

    var bulletTooltip = tip().attr('class', 'd3-tip').direction('e').offset([0, 10]).html(function (d) { return d.edges; });
    ribbon.call(bulletTooltip)

    var bulletInnerTooltip = tip().attr('class', 'd3-tip').direction('e').offset([0, 10]).html(function (d) { return d.vertices; });
    ribbon.call(bulletInnerTooltip)

    // convert clone percentage to actual count
    var bulletTick = tip().attr('class', 'd3-tip').direction('e').offset([0, 10]).html(function (d) { return Math.round(d.vertices * d.clones); });
    ribbon.call(bulletTick)

    ribbon.selectAll('.bullet')
          .data(data.layers)
        .enter().append('rect')
          .attr('class', "bullet")
          .attr('width', function (d) { return x(d.edges) })
          .attr('y', function(d) { return y(d.peel) })
          .attr('height', y.bandwidth())
          .style('fill', function(d) { return ribbonColor(d.peel) })
          .on('mouseover', function (d) { bulletTooltip.show(d); showLayerInOverview(d) } )
          .on('mouseout', function (d) { bulletTooltip.hide(); hideLayerInOverview() })
          .on('click', function(d) { return addCard(d) })

    ribbon.selectAll('.bullet-inner')
          .data(data.layers)
        .enter().append('rect')
          .attr('class', 'bullet-inner')
          .attr('width', function(d) { return x(d.vertices) })
          .attr('y', function(d) { return y(d.peel) + (y.bandwidth()/3) })
          .attr('height', y.bandwidth()/3)
          .style('fill', '#222222')
          .on('mouseover', function (d) { bulletInnerTooltip.show(d); showLayerInOverview(d) })
          .on('mouseout', function (d) { bulletInnerTooltip.hide(); hideLayerInOverview() })
          .on('click', function (d) { return addCard(d) })

    var tickOffset = 10;
    ribbon.selectAll('.bullet-tick')
          .data(data.layers)
        .enter().append('rect')
          .attr('class', 'bullet-tick')
          .attr('width', '2px')
        .attr('y', function (d) { return y(d.peel) + (y.bandwidth() / 3) - tickOffset/2 })
           // convert clone percentage to actual count
          .attr('x', function (d) { return x(Math.round(d.vertices * d.clones)) })
          .attr('height', y.bandwidth()/3 + tickOffset)
          .style('fill', '#222222')
          .on('mouseover', function (d) { bulletTick.show(d); showLayerInOverview(d) })
          .on('mouseout', function (d) { bulletTick.hide(); hideLayerInOverview() })
          .on('click', function (d) { return addCard(d) })



    ribbon.append('g')
          .attr('transform', "translate(0," + 0 + ")")
          .attr('class', 'x-axis')
          .call(d3.axisTop(x).ticks(3))

    ribbon.append("text")
          .attr("transform", "translate(" + ((ribbonWidth/ 2) - ribbonMargin.right) + " ," + (-1 * ribbonMargin.top/2) + ")")
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

        // fix bug here where dragging ribbon more left causes right div to keep growing
        // if (document.getElementById('overview').clientWidth > 250) {
        //     console.log('good')
        //     layersDiv.style.width = (startWidth - delta) + "px";
        // } else {
        //     console.log('wall')
        //     // layersDiv.style.width = layersDiv.style.width;
        // }
    }

    // add another ribbon chart
    d3.select('#ribbon')
      .append('div')
      .attr('class', 'add-ribbon-icon-wrapper')
        .append("i").attr('class', 'material-icons md-36 md-dark')
      .text('add_circle')
      .style('cursor', 'pointer')
      .on('click', addRibbon)
      
    // ribbon.append('circle')
    //       .attr('cx', (ribbonWidth / 2) - ribbonMargin.right)
    //       .attr('cy', ribbonHeight + 10)
    //       .attr('r', 10)
    //       .attr('stroke-width', 3)
    //       .style('stroke', ribbonTextColor)
    //       .attr('fill', 'red')
    //       .on('click', addRibbon);

    function addRibbon() {
        console.log('add ribbon')
        var ribbonDivWidth = document.getElementById('ribbon').clientWidth

        d3.select('#ribbon')
          .style('flex-basis', 2*ribbonDivWidth + 'px')

    }

})

function showLayerInOverview(d) {
    console.log('show layer in overview')
    d3.select('#overview')
      .style('background-image', "url(images/moreno_names/layer" + d.peel + ".png), " + "url(images/moreno_names/moreno_names-bw.png")
}

function hideLayerInOverview(d) {
    console.log('hide layer in overview')
    d3.select('#overview')
        .style('background-image', "url(images/moreno_names/moreno_names-bw.png")
}
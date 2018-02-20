import * as d3 from 'd3';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
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
    
    var ribbonMargin = { top: 30, right: 45, bottom: 0, left: 45 };
    var ribbonWidth = document.getElementById("ribbon").clientWidth - ribbonMargin.left - ribbonMargin.right
    var ribbonHeight = document.getElementById("ribbon").clientHeight - ribbonMargin.top - ribbonMargin.bottom
                     - document.getElementsByClassName('ribbon-title')[0].clientHeight - 20 
                     // negative last term is a "bug", shrinks svg so scroll bar doesn't appear
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

    x.domain([0, d3.max(data.layers, function(d) { return d.edges })])
    // y.domain(data.layers.map(function (d) { return d.peel })) // no spaces in ribbon y-axis
    y.domain(Array.from(new Array(d3.max(data.layers, function(d) { return d.peel })), (x, i) => i+1)) // spaces in ribbon y-axis
    // color bullet by graph layer
    var ribbonColorPeel = d3.scaleLinear()
        .domain(d3.extent(data.layers, function (d) { return d.peel }))
        .interpolate(d3.interpolateHcl)
        .range([d3.rgb("#0000ff"), d3.rgb('#00ff80')]);

    // color bullet by clustering coefficient
    var ribbonColorClustering = d3.scaleSequential(d3ScaleChromatic.interpolateBlues)
        .domain([0,1])

    // save color palette from data once and bind to window, little cheeky
    window.ribbonColorPeel = ribbonColorPeel;


    function addRibbonSVG() {
        // is this a good idea...
    }
    // addRibbonSVG();

    var bulletTooltip = tip().attr('class', 'd3-tip').direction('e').offset([0, 10]).html(function (d) {
        return 'e: <span class="tooltip-number">' + d.edges + '</span></br>'
        + 'v: <span class="tooltip-number">' + d.vertices + '</span></br>'
        + 'c: <span class="tooltip-number">' + Math.round(d.vertices * d.clones) + '</span>';
    });
    ribbon.call(bulletTooltip)

    // var bulletInnerTooltip = tip().attr('class', 'd3-tip').direction('e').offset([0, 10]).html(function (d) { return d.vertices; });
    // ribbon.call(bulletInnerTooltip)

    // // convert clone percentage to actual count
    // var bulletTick = tip().attr('class', 'd3-tip').direction('e').offset([0, 10]).html(function (d) { return Math.round(d.vertices * d.clones); });
    // ribbon.call(bulletTick)

    ribbon.selectAll('.bullet')
          .data(data.layers)
        .enter().append('rect')
          .attr('class', "bullet")
          .attr('width', function (d) { return x(d.edges) })
          .attr('y', function(d) { return y(d.peel) })
          .attr('height', y.bandwidth())
          .style('fill', function(d) { return ribbonColorPeel(d.peel) })
          .style('fill', function (d) { return ribbonColorClustering(d.clustering) })
        //   .on('mouseover', function (d) { bulletTooltip.show(d); showLayerInOverview(d) } )
          .on('mouseout', function (d) { bulletTooltip.hide(); hideLayerInOverview() })
          .on('click', function(d) { return addCard(d) })

    ribbon.selectAll('.bullet-inner')
          .data(data.layers)
        .enter().append('rect')
          .attr('class', 'bullet-inner')
          .attr('width', function(d) { return x(d.vertices) })
          .attr('y', function(d) { return y(d.peel) + (y.bandwidth()/3) })
          .attr('height', y.bandwidth()/3)
          .style('fill', '#444444')
        //   .style('stroke', '#ffffff')
        //   .style('stroke-width', '1')
          .on('mouseover', function (d) { bulletTooltip.show(d); showLayerInOverview(d) })
          .on('mouseout', function (d) { bulletTooltip.hide(); hideLayerInOverview() })
          .on('click', function (d) { return addCard(d) })

    var tickOffset = 10;
    ribbon.selectAll('.bullet-tick')
          .data(data.layers)
        .enter().append('rect')
          .attr('class', 'bullet-tick')
          .attr('width', '2')
        .attr('y', function (d) { return y(d.peel) + (y.bandwidth() / 3) - tickOffset/2 })
           // convert clone percentage to actual count
          .attr('x', function (d) { return x(Math.round(d.vertices * d.clones)) })
          .attr('height', y.bandwidth()/3 + tickOffset)
          .style('fill', '#444444')
        //   .style('stroke', '#ffffff')
        //   .style('stroke-width', '1')
          .on('mouseover', function (d) { bulletTooltip.show(d); showLayerInOverview(d) })
          .on('mouseout', function (d) { bulletTooltip.hide(); hideLayerInOverview() })
          .on('click', function (d) { return addCard(d) })

    ribbon.append('g')
          .attr('transform', "translate(0," + 0 + ")")
          .attr('class', 'x-axis')
          .call(d3.axisTop(x).ticks(3))

    // ribbon.append("text")
    //       .attr("transform", "translate(" + ((ribbonWidth/ 2)) + " ," + (-1 * ribbonMargin.top/2) + ")")
    //       .style("text-anchor", "middle")
    //       .text('edges')
    //       .attr('id', 'ribbonDrag')

    // d3.select('.ribbon-title').attr('id', 'ribbonDrag')
    d3.select('.drag-left').attr('id', 'ribbonDragLeft')
    d3.select('.drag-right').attr('id', 'ribbonDragRight')

    ribbon.append('g')
          .attr('class', 'y-axis')
          .call(d3.axisLeft(y))
          .selectAll('.tick text')
          .style('fill', function (d) {return data.peels.includes(d) ? '#222222' : '#cccccc' })
          .style('opacity', function (d) { return data.peels.includes(d) ? '1' : '0' })

    d3.select('.y-axis').selectAll(".tick text").on("click", function (d, i) {
        console.log('tick clicked', d, i)

        // d3.select(this).style('fill', 'red')
        var obj = data.layers.find(function (obj) { return obj.peel === d; });
        addCard(obj);
    });

    var componentsData = {}
    for (const layer in data.layers) {
        if (data.layers.hasOwnProperty(layer)) {
            componentsData[data.layers[layer].peel] = data.layers[layer].components                       
        }
    }

    ribbon.append('g')
        .attr('class', 'component-axis')
        .attr("transform", "translate(" + ribbonWidth + " ,0)")
        .call(d3.axisRight(y))
        .selectAll('.tick text')
        .style('fill', function (d) { return data.peels.includes(d) ? '#222222' : '#cccccc' })
        .style('opacity', function (d) { return data.peels.includes(d) ? '1' : '0' })
        // .attr('text-anchor', 'end')
        .text(function (d, i) { return componentsData[d] })

    // draggable ribbon
    let startX = 0, startWidth;

    var ribbonDragLeft = document.getElementById('ribbonDragLeft');
    console.log(ribbonDragLeft)
    var glass = document.getElementById('glass');
    ribbonDragLeft.addEventListener('mousedown', startDrag, false);
    glass.addEventListener('mouseup', endDrag, false);

    var ribbonDragRight = document.getElementById('ribbonDragRight');
    console.log(ribbonDragRight)
    var glass = document.getElementById('glass');
    ribbonDragRight.addEventListener('mousedown', startDrag, false);
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
        // layersDiv.style.height = 500 + "px";
        d3.selectAll('.interactive-node-link').attr('width', '100%') // a little hacky but works for now
        console.log('drag')

        // fix bug here where dragging ribbon more left causes right div to keep growing
        // if (document.getElementById('overview').clientWidth > 250) {
        //     console.log('good')
        //     layersDiv.style.width = (startWidth - delta) + "px";
        // } else {
        //     console.log('wall')
        //     // layersDiv.style.width = layersDiv.style.width;
        // }
    }

    // ribbon checkboxes
    d3.selectAll('.ribbon-checkbox').on('click', function () {

        console.log('checkbox clicked')
        var clickedCheckbox = d3.select(this).attr('id').split('-')[0]
        var clickedCheckboxBoolean = d3.select(this).property('checked')
        console.log(clickedCheckbox, clickedCheckboxBoolean)

        switch (clickedCheckbox) {

            case 'edges':
                if (clickedCheckboxBoolean) {
                    d3.selectAll('.bullet').style('opacity', 1)
                } else {
                    d3.selectAll('.bullet').style('opacity', 0)
                }
                break;

            case 'nodes':
                if (clickedCheckboxBoolean) {
                    d3.selectAll('.bullet-inner').style('opacity', 1)
                } else {
                    d3.selectAll('.bullet-inner').style('opacity', 0)
                }
                break;

            case 'clones':
                if (clickedCheckboxBoolean) {
                    d3.selectAll('.bullet-tick').style('opacity', 1)
                } else {
                    d3.selectAll('.bullet-tick').style('opacity', 0)
                }
                break;

            case 'components':
                if (clickedCheckboxBoolean) {
                    d3.selectAll('.component-axis').style('opacity', 1)
                } else {
                    d3.selectAll('.component-axis').style('opacity', 0)
                }
                break;

            case 'clustering':
                if (clickedCheckboxBoolean) {
                    d3.selectAll('.bullet').style('fill', function (d) { return ribbonColorClustering(d.clustering) })
                } else {
                    d3.selectAll('.bullet').style('fill', function (d) { return ribbonColorPeel(d.peel) })
                }
                break;

            default:
                console.log('no checkbox switch cases found, breaking by default')
                break;
                
        }
    })

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

// ribbon accordion
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    console.log(acc)
    acc[i].addEventListener("click", function () {
        console.log(this)
        this.classList.toggle("active");
        // var panel = this.nextElementSibling;
        // console.log(panel)
        var panel = document.getElementsByClassName("panel")[0];
        console.log(panel)
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}

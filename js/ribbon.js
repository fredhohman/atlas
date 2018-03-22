import * as d3 from 'd3';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import tip from 'd3-tip';
import { addCard, cardsUp } from './card.js';
import { dataPath, dataPathJSON, imagePathLayerOrg, imagePathOverview2DBackground, ribbonColorPeel } from './index.js'
import { drawLayer3DPoints, layersUp3D, hideLayerPoints, showLayerPoints, removeLayerInOverview } from './overview.js'

// draggable ribbon 
console.log('draggable-ribbon')

var keysDownOrUp = {};
window.onkeyup = function (e) { keysDownOrUp[e.keyCode] = false; }
window.onkeydown = function (e) { keysDownOrUp[e.keyCode] = true; }
window.keysDownOrUp = keysDownOrUp

d3.json(dataPathJSON, function(error, data) {

    if (error) {
        return console.error(error);        
    }

    // some globals for console debugging
    console.log(data)
    window.data = data
    
    var ribbonMargin = { top: 30, right: 55, bottom: 20, left: 55 };
    var ribbonWidth = document.getElementById("ribbon").clientWidth - ribbonMargin.left - ribbonMargin.right
    var ribbonHeight = 25*d3.max(data.peels)

    var ribbonWrapper = d3.select("#ribbon").append("svg")
        .attr("width", ribbonWidth + ribbonMargin.left + ribbonMargin.right)
        .attr("height", ribbonHeight + ribbonMargin.top + ribbonMargin.bottom)
        var ribbon = ribbonWrapper.append("g")
        .attr("transform", "translate(" + ribbonMargin.left + "," + ribbonMargin.top + ")");

    var ribbonTextColor = '#222222'
    var xLinear = d3.scaleLinear().range([0, ribbonWidth]);
    var xLog = d3.scaleLog().range([0, ribbonWidth])
    var y = d3.scaleBand().range([ribbonHeight, 0]).padding(0.5);

    xLinear.domain([0, d3.max(data.layers, function(d) { return d.edges })])
    xLog.domain([1, d3.max(data.layers, function (d) { return d.edges })])
    // y.domain(data.layers.map(function (d) { return d.peel })) // no spaces in ribbon y-axis
    y.domain(Array.from(new Array(d3.max(data.layers, function(d) { return d.peel })), (x, i) => i+1)) // spaces in ribbon y-axis

    // color bullet by graph layer
    var ribbonColorPeel = d3.scaleLinear()
        .domain(d3.extent(data.peels))
        .interpolate(d3.interpolateHcl)
        .range([d3.rgb("#0000ff"), d3.rgb('#00ff80')]);

    // color bullet by clustering coefficient
    var ribbonColorClustering = d3
      .scaleLinear()
      .domain([0, 1])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("#ECEFF1"), d3.rgb("#263238")]);

    // save color palette from data once and bind to window, little cheeky
    window.ribbonColorPeel = ribbonColorPeel;
    window.ribbonColorClustering = ribbonColorClustering;

    var cardTextValueFormat = d3.format(",.2f")

    var bulletTooltip = tip().attr('class', 'd3-tip smalltext-header').direction('e').offset([0, 25]).html(function (d) {
        return 'edges: <span class="tooltip-number">' + d.edges + '</span></br>'
        + 'vertices: <span class="tooltip-number">' + d.vertices + '</span></br>'
        + 'clones: <span class="tooltip-number">' + d.clones + '</span></br>'
        + 'clustering: <span class="tooltip-number">' + cardTextValueFormat(d.clustering) + '</span></br>'
        + 'components: <span class="tooltip-number">' + d.components + '</span>'
    });
    ribbon.call(bulletTooltip)

    // var bulletInnerTooltip = tip().attr('class', 'd3-tip').direction('e').offset([0, 10]).html(function (d) { return d.vertices; });
    // ribbon.call(bulletInnerTooltip)

    // // convert clone percentage to actual count
    // var bulletTick = tip().attr('class', 'd3-tip').direction('e').offset([0, 10]).html(function (d) { return d.clones; });
    // ribbon.call(bulletTick)

    ribbon
      .selectAll(".bullet")
      .data(data.layers)
      .enter()
      .append("rect")
      .attr("class", "bullet")
      .attr("id", function(d) {
        return "bullet-" + d.peel;
      })
      .attr("width", function(d) {
        return xLinear(d.edges);
      })
      .attr("y", function(d) {
        return y(d.peel);
      })
      .attr("height", y.bandwidth())
      .style("fill", function(d) {
        return ribbonColorClustering(d.clustering);
      })
      //   .style('stroke', '#eeeeee')
      //   .style('stroke-width', 1)
      .on("mouseover", function(d) {
        bulletTooltip.show(d);
      })
      .on("mouseout", function(d) {
        bulletTooltip.hide();
      })
      .on("click", function(d) {
        if (!(d.peel in cardsUp)) {
          return addCard(d);
        } else {
          alert("Layer " + d.peel + " is already being shown!");
        }
      });

    ribbon
      .selectAll(".bullet-inner")
      .data(data.layers)
      .enter()
      .append("rect")
      .attr("class", "bullet-inner")
      .attr("width", function(d) {
        return xLinear(d.vertices);
      })
      .attr("y", function(d) {
        return y(d.peel) + y.bandwidth() * (3 / 7);
      })
      .attr("height", y.bandwidth() * (1 / 7))
      .style("fill", function(d) { return d.clustering < 0.5 ? "#444444" : "#eeeeee" })
      //   .style('stroke', '#ffffff')
      //   .style('stroke-width', '1')
      .on("mouseover", function(d) {
        bulletTooltip.show(d);
      })
      .on("mouseout", function(d) {
        bulletTooltip.hide();
      })
      .on("click", function(d) {
        if (!(d.peel in cardsUp)) {
          return addCard(d);
        } else {
          alert("Layer " + d.peel + " is already being shown!");
        }
      });

    // rectangle tick
    var tickOffset = 6;
    ribbon
      .selectAll(".bullet-tick")
      .data(data.layers)
      .enter()
      .append("rect")
      .attr("class", "bullet-tick")
      .attr("width", "2")
      .attr("y", function(d) {
        return y(d.peel) + (y.bandwidth() * (3 / 7) - tickOffset / 2);
      })
      // convert clone percentage to actual count
      .attr("x", function(d) {
        return xLinear(d.clones);
      })
      .attr("height", y.bandwidth() * (1 / 7) + tickOffset)
      .style("fill", function(d) { return d.clustering < 0.5 ? "#444444" : "#eeeeee" })
      //   .style('stroke', '#ffffff')
      //   .style('stroke-width', '1')
      .on("mouseover", function(d) {
        bulletTooltip.show(d);
      })
      .on("mouseout", function(d) {
        bulletTooltip.hide();
      })
      .on("click", function(d) {
        if (!(d.peel in cardsUp)) {
          return addCard(d);
        } else {
          alert("Layer " + d.peel + " is already being shown!");
        }
      });

    // circle tick
    // ribbon.selectAll('.bullet-tick')
    // .data(data.layers)
    //     .enter().append('circle')
    //     .attr('class', 'bullet-tick')
    //     .attr('r', 4)
    //     .attr('cx', function(d) { return xLinear(d.clones)})
    //     .attr('cy', function(d) { return y(d.peel) + y.bandwidth()/2})
    //     .style('fill', '#444444')

    let leftIndicators = ribbonWrapper
      .append("g")
      .attr("transform", "translate(" + 8 + "," + (ribbonMargin.top - 5) + ")")
      .selectAll(".indicator")
      .data(data.layers)
      .enter()
      .append("path")
      .attr("d", d3.symbol()
          .type(d3.symbolTriangle)
          .size(30))
      .attr("transform", function(d, i) {
        return "translate(0," + (y(d.peel) + (y.bandwidth() - tickOffset / 2)) + ") rotate(270)";
      })
      .attr("class", "indicator")
      .attr("id", function(d) {
        return "indicator-left-" + d.peel;
      })
      .style("fill", "#444444")
      .on("click", function(d) {
        console.log(d)
        // removeLayerInOverview(d.peel);
        // if (!(d.peel in layersUp3D)) {
        //   drawLayer3DPoints(d.peel);
        // } else {
        //   alert("Layer " + d.peel + " is already being shown!");
        // }
      })
      .style("visibility", "hidden");

    ribbonWrapper
      .append("g")
      .attr("transform", "translate(" + 16 + "," + (ribbonMargin.top - 5) + ")")
      .selectAll(".indicator")
      .data(data.layers)
      .enter()
      .append("path")
      .attr("d", d3.symbol()
          .type(d3.symbolTriangle)
          .size(30))
      .attr("transform", function(d, i) {
        return "translate(0," + (y(d.peel) + (y.bandwidth() - tickOffset / 2)) + ") rotate(90)";
      })
      .attr("class", "indicator")
      .attr("id", function(d) {
        return "indicator-left-" + d.peel;
      })
      .attr("class", "indicator")
      .attr("id", function(d) {
        return "indicator-right-" + d.peel;
      })
      .style("fill", "#444444")
      .on("click", function(d) {
        // if (!(d.peel in cardsUp)) {
        //   return addCard(d);
        // } else {
        //   alert("Layer " + d.peel + " is already being shown!");
        // }
      })
      .style("visibility", "hidden");

    ribbon.append('g')
          .attr('transform', "translate(0," + 0 + ")")
          .attr('class', 'x-axis')
        .call(d3.axisTop(xLinear).ticks(3))

    // ribbon.append("text")
    //       .attr("transform", "translate(" + ((ribbonWidth/ 2)) + " ," + (-1 * ribbonMargin.top/2) + ")")
    //       .style("text-anchor", "middle")
    //       .text('edges')
    //       .attr('id', 'ribbonDrag')

    // d3.select('.ribbon-title').attr('id', 'ribbonDrag')
    d3.select('.drag-left').attr('id', 'ribbonDragLeft')
    d3.select('.drag-right').attr('id', 'ribbonDragRight')

    ribbon
      .append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y))
      .selectAll(".tick text")
      .style("fill", function(d) {
        return data.peels.includes(d) ? "#222222" : "#cccccc";
      })
      .style("font-weight", function(d) {
        return data.peels.includes(d) ? "500" : "300";
      })
      .style("cursor", function(d) {
        return data.peels.includes(d) ? "pointer" : "auto";
      });

    d3.select(".y-axis")
      .selectAll(".tick text")
      .on("click", function(d, i) {
        if (keysDownOrUp[91] || keysDownOrUp[93]) {
          // command key down add to 3D
          console.log("tick dbl clicked", d, i);
          console.log(keysDownOrUp);
          drawLayer3DPoints(d);
        } else {
          // add 2D card
          console.log("tick clicked", d, i);
          if (!(d in cardsUp)) {
            var obj = data.layers.find(function(obj) {
              return obj.peel === d;
            });
            addCard(obj);
          } else {
            alert("Layer " + d + " is already being shown!");
          }
        }
      });

    ribbon
        .selectAll(".components")
        .data(data.layers)
        .enter()
        .append("text")
        .attr("text-anchor", "start")
        .attr("class", "component")
        .text(function(d) {
        return d.components;
        })
        .attr("x", function(d) {
        if (d.peel === 1) {
            return xLinear(d.vertices) + 5;
        } else {
            return xLinear(d.edges) + 5;
        }
        })
        .attr("y", function(d) {
        return y(d.peel) + y.bandwidth() * (6 / 13) + 5;
        })
        .style("fill", "#cccccc")
        .style("font-size", "13")
        .on("mouseover", function(d) {
        bulletTooltip.show(d);
        })
        .on("mouseout", function(d) {
        bulletTooltip.hide();
        })
        .on("click", function(d) {
        if (!(d.peel in cardsUp)) {
            return addCard(d);
        } else {
            alert("Layer " + d.peel + " is already being shown!");
        }
        });

    // draggable ribbon
    let startX = 0, startWidth;

    var ribbonDragLeft = document.getElementById('ribbonDragLeft');
    // console.log(ribbonDragLeft)
    var glass = document.getElementById('glass');
    ribbonDragLeft.addEventListener('mousedown', startDrag, false);
    glass.addEventListener('mouseup', endDrag, false);

    var ribbonDragRight = document.getElementById('ribbonDragRight');
    // console.log(ribbonDragRight)
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
        // console.log('drag')

        var event = new Event('ribbonDragEnd')
        window.dispatchEvent(event);

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
        var clickedCheckbox = d3.select(this).attr('for').split('-')[0]
        var clickedCheckboxBoolean = d3.select('#' + clickedCheckbox +'-checkbox').property('checked')
        // console.log(clickedCheckbox, clickedCheckboxBoolean)

        switch (clickedCheckbox) {
            // bug here: true and false are inverted, needs the ! to flip to correct position
            case 'edges':
                if (!clickedCheckboxBoolean) {
                    d3.selectAll('.bullet').style('opacity', 1)
                } else {
                    d3.selectAll('.bullet').style('opacity', 0)
                }
                break;

            case 'nodes':
                if (!clickedCheckboxBoolean) {
                    d3.selectAll('.bullet-inner').style('opacity', 1)
                } else {
                    d3.selectAll('.bullet-inner').style('opacity', 0)
                }
                break;

            case 'clones':
                if (!clickedCheckboxBoolean) {
                    d3.selectAll('.bullet-tick').style('opacity', 1)
                } else {
                    d3.selectAll('.bullet-tick').style('opacity', 0)
                }
                break;

            case 'components':
                if (!clickedCheckboxBoolean) {
                    d3.selectAll('.component').style('opacity', 1)
                } else {
                    d3.selectAll('.component').style('opacity', 0)
                }
                break;

            case 'clustering':
                if (!clickedCheckboxBoolean) {
                    d3.selectAll('.bullet').style('fill', function (d) { return ribbonColorClustering(d.clustering) })
                } else {
                    // d3.selectAll('.bullet').style('fill', function (d) { return ribbonColorPeel(d.peel) })
                    d3.selectAll('.bullet').style('fill', function (d) { return '#dddddd' })
                }
                break;

            case 'log':
                if (!clickedCheckboxBoolean) {
                    d3.selectAll('.bullet').transition().duration(1000).attr('width', function (d) { return xLog(d.edges) })
                    d3.selectAll('.bullet-inner').transition().duration(1000).attr('width', function (d) { return xLog(d.vertices) })
                    d3.selectAll('.bullet-tick').transition().duration(1000).attr('x', function (d) { return xLog(d.clones) })
                    d3.select('.x-axis').transition().duration(1000).call(d3.axisTop(xLog).ticks(2))
                    d3
                      .selectAll(".component")
                      .transition()
                      .duration(1000)
                      .attr("x", function(d) {
                        if (d.peel === 1) {
                          return xLog(d.vertices) + 5;
                        } else {
                          return xLog(d.edges) + 5;
                        }
                      });
                } else {
                    d3.selectAll('.bullet').transition().duration(1000).attr('width', function (d) { return xLinear(d.edges) })
                    d3.selectAll('.bullet-inner').transition().duration(1000).attr('width', function (d) { return xLinear(d.vertices) })
                    d3.selectAll('.bullet-tick').transition().duration(1000).attr('x', function (d) { return xLinear(d.clones) })
                    d3.select('.x-axis').transition().duration(1000).call(d3.axisTop(xLinear).ticks(3))
                    d3
                      .selectAll(".component")
                      .transition()
                      .duration(1000)
                      .attr("x", function(d) {
                        if (d.peel === 1) {
                          return xLinear(d.vertices) + 5;
                        } else {
                          return xLinear(d.edges) + 5;
                        }
                      });
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
        .style('background-image', "url(" + imagePathLayerOrg(d.peel) + "), " + "url(" + imagePathOverview2DBackground() + ")")
}

function hideLayerInOverview(d) {
    console.log('hide layer in overview')
    d3.select('#overview')
        .style('background-image', "url(" + imagePathOverview2DBackground() + ")")
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

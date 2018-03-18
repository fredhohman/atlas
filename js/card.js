import * as contour from 'd3-contour';
import * as d3 from 'd3';
import * as d3ScaleChromatic from "d3-scale-chromatic";
import tip from 'd3-tip';
import { dataPath, dataPathJSON, dataPathLayerJSON, imagePathLayerOrg, imagePathLayerFD, imagePathLayerContour } from './index.js'


export let cardsUp = {};
let numOfCardsUp = 0;
window.numOfCardsUp = numOfCardsUp;
window.cardsUp = cardsUp;

let zoomHandlerUp = {};
window.zoomHandlerUp = zoomHandlerUp;

export let selectedNodeIDs = {}
window.selectedNodeIDs = selectedNodeIDs;

export function addCard(d, initNode = null, zoomScale = 0.4) {
    console.log('add card', d)
    numOfCardsUp += 1;
    cardsUp[d.peel] = 'up'

    d3.select('#indicator-right-' + d.peel).style('visibility', 'visible')

    cardMessage();

    let edgeOpacity = 0.5;
    let edgeColor = '#bbbbbb';
    let nodeColor = "#bbbbbb";
    let highlightColor = "#FFC107";
    let cloneColor = "#FF9800";
    let selectionColor = "#2196F3";

    var layers = d3.select('#layers')
        .append('div')
        .attr('class', 'card-border-wrapper')
        .attr('id', 'card-' + d.peel)
        .append('div')
        .attr('class', 'card')
        // if (cardsUp.length > 1) {
            // 
        // } else {
            // layers.style('height', '50vh')
        // }
    // .style('border-left', function () { return '5px solid ' + ribbonColorPeel(d.peel) })

    var cardTop = layers.append('div').attr('class', 'card-top-wrapper')

    var cardTextValueFormat = d3.format(",.3f")

    var cardBottom = layers.append('div').attr('class', 'card-bottom-wrapper')

    var cardText = cardBottom.append('div')
        .attr('class', 'card-text-wrapper')

    var cardTitle = cardText.append('div')
        .attr('class', 'card-title-wrapper')

    cardTitle.append('h3')
        .attr('class', 'card-title')
        .text('Layer ' + d.peel)

    cardText.append('span')
        .attr('class', 'smalltext-header card-text-item')
        .text('edges: ')
        .append('span')
        .attr('class', 'card-text-item-value')
        .text(d.edges)

    cardText.append('span')
        .attr('class', 'smalltext-header card-text-item')
        .text('vertices: ')
        .append('span')
        .attr('class', 'card-text-item-value')
        .text(d.vertices)

    cardText.append('span')
        .attr('class', 'smalltext-header card-text-item')
        .text('clones: ')
        .append('span')
        .attr('class', 'card-text-item-value')
        .text(d.clones)

    cardText.append('span')
        .attr('class', 'smalltext-header card-text-item')
        .text('clustering: ')
        .append('span')
        .attr('class', 'card-text-item-value')
        .text(cardTextValueFormat(d.clustering))

    cardText.append('span')
        .attr('class', 'smalltext-header card-text-item')
        .text('components: ')
        .append('span')
        .attr('class', 'card-text-item-value')
        .text(d.components)

    if (d.components === 1) {
        cardText.append('hr')
        
        var cliqueMessage = cardText.append('span')
            .attr('class', 'smalltext-header card-text-item-value')

        cliqueMessage
          .text("clique minus " + ((d.vertices * (d.vertices - 1) / 2 - d.edges) + ' edges') )
    } else {
        cardText.append("hr");

        var largestComp = cardText;
        largestComp
            .append("span")
            .attr("class", "smalltext-header card-text-item")
            .text("largest component");
        largestComp
            .append("span")
            .attr("class", "smalltext-header card-text-item")
            .text("edges: ")
            .append("span")
            .attr("class", "card-text-item-value")
            .text(d["largest-component-edges"]);

        largestComp
            .append("span")
            .attr("class", "smalltext-header card-text-item")
            .text("vertices: ")
            .append("span")
            .attr("class", "card-text-item-value")
            .text(d["largest-component-vertices"]);

        var componentSlider = cardText
            .append("div")
            .attr("class", "overview-header-ui-element-wrapper");
        var componentSliderInput = componentSlider
            .append("input")
            .attr("type", "range")
            .attr("class", "overview-slider")
            .attr("id", "comp-slider-" + d.peel)
            .attr("max", d.components)
            .attr("min", 1)
            .attr("step", 1)
            .property("value", 1);
    }

    cardText.append('hr')

    var edgesToggle = cardText.append('input').attr('type', 'checkbox').attr('id', "edges-toggle-" + d.peel).attr('name', 'set-name').attr('class', 'switch-input edges-toggle').property('checked', true)
    var edgesToggleLabel = cardText.append('label').attr('for', "edges-toggle-" + d.peel).attr('class', 'switch-label smalltext-header').text('Edges')

    var nodesToggle = cardText.append('input').attr('type', 'checkbox').attr('id', "nodes-toggle-" + d.peel).attr('name', 'set-name').attr('class', 'switch-input nodes-toggle').property('checked', true)
    var nodesToggleLabel = cardText.append('label').attr('for', "nodes-toggle-" + d.peel).attr('class', 'switch-label smalltext-header').text('Nodes')

    var positionToggle = cardText.append('input').attr('type', 'checkbox').attr('id', "position-toggle-" + d.peel).attr('name', 'set-name').attr('class', 'switch-input position-toggle')
    var positionToggleLabel = cardText.append('label').attr('for', "position-toggle-" + d.peel).attr('class', 'switch-label smalltext-header').text('redraw')

    var contourToggle = cardText.append('input').attr('type', 'checkbox').attr('id', "contour-toggle-" + d.peel).attr('name', 'set-name').attr('class', 'switch-input contour-toggle')
    var contourToggleLabel = cardText.append('label').attr('for', "contour-toggle-" + d.peel).attr('class', 'switch-label smalltext-header').text('motif')
    cardText.append('br')
    cardText.append('span').attr('class', 'smalltext-header').text('bw: ')
    cardText.append('input').attr('type', 'number').attr('min', 1).attr('max', 200).attr('value', 50).attr('id', 'contour-toggle-bandwidth-' + d.peel).attr('class', 'contour-toggle-bandwidth card-text-item-value')
    cardText.append("span").attr('class', 'smalltext-header').text("th: ");
    cardText.append('input').attr('type', 'number').attr('min', 1).attr('max', 20).attr('value', 5).attr('id', 'contour-toggle-threshold-' + d.peel).attr('class', 'contour-toggle-threshold card-text-item-value')

    var cloneToggle = cardText.append('input').attr('type', 'checkbox').attr('id', "clone-toggle-" + d.peel).attr('name', 'set-name').attr('class', 'switch-input clone-toggle')
    var cloneToggleLabel = cardText.append('label').attr('for', "clone-toggle-" + d.peel).attr('class', 'switch-label smalltext-header').text('clones')

    var nodeID = cardText.append('div')
        .attr('class', 'node-id')

    var cloneDisplay = cardText.append('div')
        .attr('class', 'clone-display')

    var interactiveNodeLinkDiv = cardBottom.append('div')
        .attr('id', 'interactive-node-link-' + d.peel)
        .attr('class', 'card-image-wrapper')

    // close button
    interactiveNodeLinkDiv.append('div')
        .style('z-index', '1000')
        .style('position', 'absolute')
        .style('right', '0')
        .style('padding', '8px')
        // .attr('class', 'card-icon-wrapper')
        .append("i")
        .attr('class', 'material-icons md-dark')
        .text('close')
        .style('cursor', 'pointer')
        .on('click', function () { closeCard(d) })

    function drawLayerGraph(d) {
        console.log('draw graph', d)

        var graphLayerMargin = { top: 0, right: 0, bottom: 0, left: 0 };
        var graphLayerWidth = document.getElementById("interactive-node-link-" + d.peel).clientWidth - graphLayerMargin.left - graphLayerMargin.right
        var graphLayerHeight = document.getElementById("interactive-node-link-" + d.peel).clientHeight - graphLayerMargin.top - graphLayerMargin.bottom

        var graphLayerSVG = d3.select("#interactive-node-link-" + d.peel)
            .append('svg')
            .attr('id', "interactive-node-link-" + d.peel + '-svg')
            .attr('class', 'interactive-node-link')
            .attr("width", graphLayerWidth)
            .attr("height", graphLayerHeight)
        //   .style('background-color', '#cccccc')

        d3.json(dataPathLayerJSON(d.peel), function (error, graphLayerData) {

            if (error) {
                return console.error(error);
            }

            // zero center original graph 
            const boundary = 500
            var ymax = d3.max(graphLayerData.nodes, function (d) { return d.x })
            var xmax = d3.max(graphLayerData.nodes, function (d) { return d.y })
            var ymin = d3.min(graphLayerData.nodes, function (d) { return d.x })
            var xmin = d3.min(graphLayerData.nodes, function (d) { return d.y })
            var x_midpoint = (xmax - xmin) / 2
            var y_midpoint = (ymax - ymin) / 2

            graphLayerData.nodes.forEach(function (d) {
                d.x = d.x - (xmin + x_midpoint)
                d.y = d.y - (ymin + y_midpoint)
            })

            // scale original graph
            // var ymax = d3.max(graphLayerData.nodes, function (d) { return d.x })
            // var xmax = d3.max(graphLayerData.nodes, function (d) { return d.y })
            // var ymin = d3.min(graphLayerData.nodes, function (d) { return d.x })
            // var xmin = d3.min(graphLayerData.nodes, function (d) { return d.y })
            // var max_cord = d3.max([xm3.select("#contour-toggle-bandwidth-"ax, ymax])
            // var scale_factor = boundary / max_cord

            // graphLayerData.nodes.forEach(function (d) {
            //     d.x = d.x * scale_factor
            //     d.y = d.y * scale_factor
            // })

            // globals for debugging
            window.graphLayerData = graphLayerData

            // point link sources and targets at node objects, this could be a little slow
            graphLayerData.links.forEach(function (d) {
                d.source = graphLayerData.nodes.filter(function (node) { return node.id === d.source })[0]
                d.target = graphLayerData.nodes.filter(function (node) { return node.id === d.target })[0]
            });

            // add encompassing group for the zoom 
            var g = graphLayerSVG.append("g")
                .attr("class", "everything")

            //draw lines for the links 
            var linkSVGs = g
              .append("g")
              .attr("class", "links")
              .selectAll("line")
              .data(graphLayerData.links)
              .enter()
              .append("line")
              .attr("class", "link-" + d.peel)
              .attr("x1", function(d) {
                return d.source.x;
              })
              .attr("y1", function(d) {
                return d.source.y;
              })
              .attr("x2", function(d) {
                return d.target.x;
              })
              .attr("y2", function(d) {
                return d.target.y;
              })
              .attr("stroke-width", 0.6)
              .attr("stroke", edgeColor)
              .style("stroke-opacity", edgeOpacity);

            var cloneTooltip = tip().attr('class', 'd3-tip').direction('e').offset([0, 10]).html(function (d) {
                return '<span class="tooltip-number">' + d.peels.join(', ') + '</span>'
            });
            // g.append('circle').attr('id', 'tipfollowscursor')
            g.call(cloneTooltip)
            window.cloneTooltip = cloneTooltip

            // graphLayerData.links.forEach(function(link) {
            //     var source = link.source, target = link.target;
            //     (source.neighbors || (source.neighbors = [])).push(target);
            //     (target.neighbors || (target.neighbors = [])).push(source);
            // });

            // function traverse(node, group) {
            //     if ("group" in node) {
            //         node.group = Math.min(node.group, group);
            //     } else {
            //         node.group = group;
            //         node.neighbors.forEach(function(d) {
            //         traverse(d, group);
            //         });
            //     }
            // }

            // console.log(graphLayerData);
            // traverse(graphLayerData.nodes[0], 0)
            console.log(graphLayerData)
  
            // draw circles for the nodes 
            var nodeSVGs = g
              .append("g")
              .attr("class", "nodes")
              .selectAll("circle")
              .data(graphLayerData.nodes)
              .enter()
              .append("circle")
              .attr("class", "node-" + d.peel)
              .attr('id', function(node) { return 'node' + node.id + '-' + d.peel})
              .attr("r", 4)
              .attr("cx", function(d) {
                return d.x;
              })
              .attr("cy", function(d) {
                return d.y;
              })
              .attr("fill", nodeColor)
              .attr("stroke", "#ffffff")
              .attr("stroke-width", 1);

            // component slider
            function hideComps() {
                var currentComponentValue = Number(d3.select(this).property("value"));

                nodeSVGs.attr("visibility", function(n) { return n.cmpt < currentComponentValue - 1 ? 'hidden' : 'visible' });
                linkSVGs.attr("visibility", function(l) { return l.source.cmpt < currentComponentValue -1 ? 'hidden' : 'visible' })
            }
            if (!(d.components === 1)) {
                componentSliderInput.on("input", hideComps);
            }
    
            // add zoom 
            var zoomHandler = d3.zoom()
                .scaleExtent([0.25, 8])
                // .translateExtent([[-2000, -0.8*2000], [2000, 0.8*2000]])
                .on("zoom", zoomActions);
            graphLayerSVG.call(zoomHandler)
            zoomHandlerUp[d.peel] = zoomHandler
            if (initNode) {
                // card clicked from clone 
                var foundClone = graphLayerData.nodes.filter(function (node) { return node.id === initNode.id})[0]
                if (!foundClone) {
                    alert('no clone found')                    
                }
                graphLayerSVG.call(zoomHandler.translateTo, 0, 0)
                graphLayerSVG.call(zoomHandler.scaleTo, zoomScale)
                graphLayerSVG.transition().duration(1000).call(zoomHandler.translateTo, foundClone.fdx, foundClone.fdy)
                // graphLayerSVG.transition().duration(1000).call(zoomHandler.transform, transform)
                // function transform() {
                //     return d3.zoomIdentity
                //         // .translate(0,0)
                //         .scale(zoomScale)
                //         // .translate(foundClone.x,foundClone.y);
                // }
                // graphLayerSVG.transition().duration(1000).call(function(a) { zoomHandler.translateTo(a,foundClone.x,foundClone.y); })
                // graphLayerSVG.transition().duration(1000).call(zoomHandler.scaleTo, 1)
                nodeSVGs.filter(function(d) {return d === foundClone}).classed('selected', true)
            } else {
                // card clicked from ribbon
                graphLayerSVG.call(zoomHandler.translateTo, 0, 0)
                graphLayerSVG.call(zoomHandler.scaleTo, zoomScale)
            }

            // zoom functions
            function zoomActions() {
                g.attr("transform", d3.event.transform)
            }

            // add drag
            var drag = d3.drag()
                .subject(function () {
                    var t = d3.select(this);
                    return { x: t.attr("x"), y: t.attr("y") };
                })
                .on("start", dragstarted)
                .on("drag", dragged)
                .on('end', function() {
                    var peel = d3.select(this).attr('class').split(' ')[0].split('-')[1] // careful here, always looks as first class of circle node-i where i is a peel
                    if (d3.select('#contour-toggle-' + peel).property('checked')) {
                        removeLayerGraphContour(peel);
                        toggleContour(peel);
                    }
                })
            nodeSVGs.call(drag)

            // stops the propagation of the click event
            function dragstarted(d) {
                d3.event.sourceEvent.stopPropagation();
            }

            // called when the drag event occurs (object should be moved)
            function dragged(d) {
                var peel = d3.select(this).attr('class').split(' ')[0].split('-')[1] // careful here, always looks as first class of circle node-i where i is a peel
                var draggingNode = d3.select(this).attr('id')
                var draggingNodeID = draggingNode.split('node')[1].split('-')[0]
                var multiNodeSelection = [];
                for (let i = 0; i < Object.keys(selectedNodeIDs).length; i++) {
                  if (draggingNodeID === Object.keys(selectedNodeIDs)[i].split("-")[0]) {
                      multiNodeSelection.push( '#node' + Object.keys(selectedNodeIDs)[i] )
                  }
                }

                if (multiNodeSelection.length > 0) {
                    var selectionData = d3.selectAll(multiNodeSelection.join(", ")).data()
                }

                if (d3.select('#position-toggle-' + peel).property('checked')) {
                    
                    d.fdx += d3.event.dx;
                    d.fdy += d3.event.dy;
                    
                    // for (let i = 0; i < selectionData.length; i++) {
                    //   const element = selectionData[i];
                    //    element.fdx += d3.event.dx;
                    //    element.fdy += d3.event.dy;
                    // }

                    // selectionData.forEach(function(a) { 
                    //     a.fdx += d3.event.dx;
                    //     a.fdy += d3.event.dy;
                    // })

                } else {
                    d.x += d3.event.dx;
                    d.y += d3.event.dy;
                }
                updateNodePositionsTick(peel);
            }

            function getNeighbors(node) {
                return graphLayerData.links.reduce((neighbors, link) => {

                    if (link.target.id === node.id) {
                        neighbors.push(link.source.id)
                    } else if (link.source.id === node.id) {
                        neighbors.push(link.target.id)
                    }

                    return neighbors
                }, [node.id])
            }

            function isNeighborLink(node, link) {
                return link.target.id === node.id || link.source.id === node.id
            }

            function getNodeColor(node, neighbors) {
                if (Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1) {
                    // return ribbonColorPeel(d.peel);
                    return highlightColor;
                }
                return '#ffffff';
            }

            function getNodeWidth(node, neighbors) {
                if (Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1) {
                    // return ribbonColorPeel(d.peel);
                    return 1.5;
                }
                return 1.0;
            }

            // function getTextColor(node, neighbors) {
            //     return neighbors.indexOf(node.id) ? 'green' : 'black'
            // }
            
            function getLinkColor(node, link) {
                // return isNeighborLink(node, link) ? ribbonColorPeel(d.peel) : 'rgba(221,221,221,0.3)';
                return isNeighborLink(node, link) ? highlightColor : "rgba(221,221,221,0.3)";
            }
            
            function getLinkOpacity(node, link) {
              // return isNeighborLink(node, link) ? ribbonColorPeel(d.peel) : 'rgba(221,221,221,0.3)';
              return isNeighborLink(node, link) ? 1 : edgeOpacity;
            }

            function getLinkWidth(node, link) {
              // return isNeighborLink(node, link) ? ribbonColorPeel(d.peel) : 'rgba(221,221,221,0.3)';
              return isNeighborLink(node, link) ? 1.2 : 0.6;
            }

            let labelSVGs;
            function selectNode(selectedNode) {
                const neighbors = getNeighbors(selectedNode)

                nodeSVGs
                    .attr('stroke', function (node) { return getNodeColor(node, neighbors) })
                    .attr('stroke-width', function (node) { return getNodeWidth(node, neighbors) })

                // check if we have labels or not
                if ('name' in graphLayerData.nodes[0]) {
                    let neighborsData = graphLayerData.nodes.filter(function(node) { return neighbors.includes(node.id) })
                    let FDLayout = d3.select('#position-toggle-' + d.peel).property('checked')

                        labelSVGs = g
                        .append("g")
                        .attr("class", "labels")
                        .selectAll("text")
                        .data(neighborsData)
                        .enter()
                        .append("text")
                        .attr("x", function(d) {
                            if (FDLayout) {
                                return d.fdx + 10;
                            } else {
                                return d.x + 10;
                            }

                        })
                        .attr("y", function(d) {
                            if (FDLayout) {
                                return d.fdy;
                            } else {
                                return d.y;
                            }
                        })
                        .attr('alignment-baseline', 'middle')
                        .text(function(d) { return d.name })
                        .style('font-size', 12)
                        .style('font-weight', 500)
                        .style('stroke', '#ffffff')
                        .style('stroke-width', 0.3)
                }

                // textElements
                // .attr('fill', node => getTextColor(node, neighbors))

                linkSVGs
                    .attr('stroke', function (link) { return getLinkColor(selectedNode, link) })
                    .style('stroke-opacity', function (link) { return getLinkOpacity(selectedNode, link) })
                    .style('stroke-width', function (link) { return getLinkWidth(selectedNode, link); })
                }

            nodeSVGs.on('mouseover', function (node) {
                selectNode(node);
                if (node.peels.length > 1) {
                    // console.log(node)
                    nodeID.html(node.name)
                    cloneDisplay.html('')
                    cloneDisplay.selectAll('clone-label')
                        .data(node.peels)
                        .enter()
                        .append('span')
                        .attr('class', 'clone-label')
                        .text(function (datum, i) {
                            if (i != node.peels.length - 1) {
                                return datum + ', '
                            } else {
                                return datum
                            }
                        })
                        .style('color', function (datum) {
                            if (datum === d.peel) {
                                return '#bbbbbb'
                            }
                        })
                        .on('click', function (datum) {
                            console.log('clicked clone', node, datum)
                            if (!(datum in cardsUp)) {
                                d3.json(dataPathJSON, function (error, tempData) {
                                    var obj = tempData.layers.find(function (obj) { return obj.peel === datum; });
                                    var scale = g.attr('transform').split(' ')[1].split('scale(')[1]
                                    scale = scale.substring(0, scale.length - 1)
                                    // transition card that is clicked
                                    if (d3.select('#position-toggle-' + d.peel).property('checked')) {
                                        graphLayerSVG.transition().duration(1000).call(zoomHandler.translateTo, node.fdx, node.fdy)                                        
                                    } else {
                                        let tempPosTogglePath = 'position-toggle-' + d.peel
                                        document.getElementById(tempPosTogglePath).click()
                                        graphLayerSVG.transition().duration(1000).call(zoomHandler.translateTo, node.fdx, node.fdy)                                        
                                        // graphLayerSVG.transition().duration(1000).call(zoomHandler.translateTo, node.x, node.y)                                        
                                    }

                                    nodeSVGs.filter(function (n) { return n === node }).classed('selected', true)
                                    console.log(node)
                                    selectedNodeIDs[node.id + "-" + d.peel] = "selected";
                                    selectedNodeIDs[node.id + '-' + datum] = 'selected'
                                    console.log(selectedNodeIDs);
                                    addCard(obj, initNode = node, scale = scale);
                                })
                            } else{
                                alert('Layer ' + datum + ' is already being shown!')
                            }
                        })

                } else {
                    cloneDisplay.attr('class', 'clone-label').text('no clones')
                }
            })

            nodeSVGs.on('mouseout', function () {
                // nodeSVGs.attr('fill', ribbonColorPeel(d.peel)); // hacky, referring to original d passed into drawLayerGraph
                // linkSVGs.attr('stroke', ribbonColorPeel(d.peel)); // hacky, referring to original d passed into drawLayerGraph
                nodeSVGs.attr('stroke', '#ffffff').attr('stroke-width', 1);
                linkSVGs.attr('stroke', edgeColor).style('stroke-opacity', edgeOpacity).style("stroke-width", 0.6);
                if ('name' in graphLayerData.nodes[0]) {
                    labelSVGs.remove();
                }
                // cloneTooltip.hide();
            })

            nodeSVGs.on('click', function (d) {
                console.log('clicked')
                let selectedOrNot = d3.select(this).classed("selected");
                d3.select(this).classed('selected', function() {
                    if (d3.select(this).classed('selected')) {
                        var peel = d3.select(this).attr('class').split(' ')[0].split('-')[1]
                        delete selectedNodeIDs[d3.select(this).data()[0].id + '-' + peel]
                        return false
                    } else{
                        var peel = d3.select(this).attr('class').split(' ')[0].split('-')[1]
                        selectedNodeIDs[d3.select(this).data()[0].id + '-' + peel] = 'selected'
                        return true
                    }
                })
            })

            function toggleEdges() {
                var contourLayerNum = Number(d3.select(this).property('id').split('-')[2])
                var selectedLinks = d3.selectAll('.link-' + contourLayerNum)
                if (d3.select(this).property('checked')) {
                    selectedLinks.attr('visibility', 'visible')
                } else {
                    selectedLinks.attr('visibility', 'hidden')
                }
            }
            d3.selectAll('.edges-toggle').on('click', toggleEdges)

            function toggleNodes() {
                var contourLayerNum = Number(d3.select(this).property('id').split('-')[2])
                var selectedNodes = d3.selectAll('.node-' + contourLayerNum)
                if (d3.select(this).property('checked')) {
                    selectedNodes.attr('visibility', 'visible')
                } else {
                    selectedNodes.attr('visibility', 'hidden')
                }
            }
            d3.selectAll('.nodes-toggle').on('click', toggleNodes)

            function toggleClones() {
                console.log('toggle clones')
                console.log(this)

                var contourLayerNum = Number(d3.select(this).property('id').split('-')[2])
                var selectedNodes = d3.selectAll('.node-' + contourLayerNum)

                var maxPeels = d3.max(selectedNodes.data(), function(d) { return d.peels.length })
                var cloneSizeScale = d3.scaleLinear().domain([1, maxPeels]).range([4,7])

                // style clones
                if (d3.select(this).property('checked')) {
                    selectedNodes
                        .classed("clone", function (d) {
                            if (d.peels.length > 1) {
                                return true
                            } else {
                                return false
                            }
                        })
                    selectedNodes
                        .attr('r', function (d) {
                            // if (d.peels.length > 1) {
                            //     return 8
                            // } else {
                            //     return 4
                            // }
                            return cloneSizeScale(d.peels.length)
                        })
                } else {
                    // default node styling
                    selectedNodes.classed('clone', false)
                    // selectedNodes.attr('fill', function () { return ribbonColorPeel(contourLayerNum) })
                    selectedNodes.attr('fill', nodeColor)
                    selectedNodes.attr('r', 6)
                }
            }
            d3.selectAll('.clone-toggle').on('click', toggleClones)

            // optional
            // graphLayerSVG.on('click', function() { cloneTooltip.style('display', 'hidden') })
            // graphLayerSVG.on('click', function () {
            //     console.log('click canvas, hide tooltip')
            //     d3.selectAll('.d3-tip').style('display', 'hidden')
            // })

            function togglePosition() {
                console.log('toggle position')
                console.log(this)
                var contourLayerNum = Number(d3.select(this).property('id').split('-')[2])
                var selectedNodes = d3.selectAll('.node-' + contourLayerNum)
                var selectedLinks = d3.selectAll('.link-' + contourLayerNum)
                console.log(contourLayerNum)

                if (d3.select(this).property('checked')) {
                    selectedNodes
                        .transition().duration(2000)
                        .attr('cx', function (d) { return d.fdx })
                        .attr('cy', function (d) { return d.fdy })
                    selectedLinks
                        .transition().duration(2000)
                        .attr("x1", function (d) { return d.source.fdx; })
                        .attr("y1", function (d) { return d.source.fdy; })
                        .attr("x2", function (d) { return d.target.fdx; })
                        .attr("y2", function (d) { return d.target.fdy; })
                } else {
                    selectedNodes
                        .transition().duration(2000)
                        .attr('cx', function (d) { return d.x })
                        .attr('cy', function (d) { return d.y })
                    selectedLinks
                        .transition().duration(2000)
                        .attr("x1", function (d) { return d.source.x; })
                        .attr("y1", function (d) { return d.source.y; })
                        .attr("x2", function (d) { return d.target.x; })
                        .attr("y2", function (d) { return d.target.y; })
                }
            }
            d3.selectAll('.position-toggle').on('click', togglePosition)
            // if card is drawn using a init node, click the position toggle to redraw
            if (initNode) {
                document.getElementById('position-toggle-'+ d.peel).click()
            }

            function updateNodePositionsTick(peel) {
                console.log('update positions tickl')
                if (d3.select('#position-toggle-' + peel).property('checked')) {

                    nodeSVGs
                        .attr("cx", function (d) { return d.fdx; })
                        .attr("cy", function (d) { return d.fdy; });

                    linkSVGs
                        .attr("x1", function (d) { return d.source.fdx; })
                        .attr("y1", function (d) { return d.source.fdy; })
                        .attr("x2", function (d) { return d.target.fdx; })
                        .attr("y2", function (d) { return d.target.fdy; });
                } else {

                    nodeSVGs
                        .attr("cx", function (d) { return d.x; })
                        .attr("cy", function (d) { return d.y; });

                    linkSVGs
                        .attr("x1", function (d) { return d.source.x; })
                        .attr("y1", function (d) { return d.source.y; })
                        .attr("x2", function (d) { return d.target.x; })
                        .attr("y2", function (d) { return d.target.y; });
                }
            }

            function toggleContour(contourLayerNum) {
                console.log('draw contour')

                if (!(document.getElementById('position-toggle-'+ contourLayerNum).checked)) {
                    document.getElementById('position-toggle-'+ contourLayerNum).click()
                }

                if (d3.select('#contour-toggle-' + contourLayerNum).property('checked')) {

                    var selectedNodes = d3.selectAll('.node-' + contourLayerNum)
                    var selectedNodesData = selectedNodes.data()

                    var contourX = d3.scaleLinear()
                        .rangeRound([-500, 500]);

                    var contourY = d3.scaleLinear()
                        .rangeRound([-500, 500]);

                    contourX.domain(d3.extent(selectedNodesData, function (d) { return d.fdx; })).nice();
                    contourY.domain(d3.extent(selectedNodesData, function (d) { return d.fdy; })).nice();

                    var g = d3.select('#interactive-node-link-' + contourLayerNum + '-svg').select('g')

                    const boundary = 500;
                    var bandwidth = d3.select("#contour-toggle-bandwidth-" + contourLayerNum).property('value');
                    var threshold = d3.select("#contour-toggle-threshold-" + contourLayerNum).property('value');

                    // var contourColor = d3.scaleSequential(d3ScaleChromatic.interpolateGreys).domain([0, threshold])
                        var contourColor = d3
                          .scaleLinear()
                          .domain([0, threshold])
                          .interpolate(d3.interpolateHcl)
                          .range([
                            d3.rgb("#E3F2FD"),
                            d3.rgb("#0D47A1")
                          ]);

                    g.insert("g", "g").attr('id', 'contour-' + contourLayerNum)
                    .attr('transform', 'translate(-' + boundary + ', -' + boundary + ')')
                        .attr("fill", "none")
                        .attr("stroke-linejoin", "round")
                        .selectAll("path")
                        .data(contour.contourDensity()
                            .x(function (d) { return d.fdx + boundary; })
                            .y(function (d) { return d.fdy + boundary; })
                            .size([2*boundary, 2*boundary])
                            .bandwidth(bandwidth)
                            .thresholds(threshold)
                            (selectedNodesData))
                        .enter().append("path")
                        .attr("fill", function (d, i) { return contourColor(i) })
                        .attr("d", d3.geoPath())

                    // option axes
                    // g.append("g")
                    //     .attr('class', 'contour-x-axis')
                    //     // .attr("transform", "translate(0," + (graphLayerHeight - graphLayerMargin.bottom) + ")")
                    //     .call(d3.axisBottom(contourX))
                    //     .select(".tick:last-of-type text")
                    //     .select(function () { return this.parentNode.appendChild(this.cloneNode()); })
                    //     .attr("y", -3)
                    //     .attr("dy", null)
                    //     .attr("font-weight", "bold")
                    //     .text("x");

                    // g.append("g")
                    //     .attr('class', 'contour-y-axis')
                    //     .attr("transform", "translate(" + graphLayerMargin.left + ",0)")
                    //     .call(d3.axisLeft(contourY))
                    //     .select(".tick:last-of-type text")
                    //     .select(function () { return this.parentNode.appendChild(this.cloneNode()); })
                    //     .attr("x", 3)
                    //     .attr("text-anchor", "start")
                    //     .attr("font-weight", "bold")
                    //     .text("y");

                } else {
                    d3.select('#contour-' + contourLayerNum).remove()
                    d3.select('.contour-x-axis').remove()
                    d3.select('.contour-y-axis').remove()
                }

            }
            d3.selectAll('.contour-toggle').on('click', function() {
                var contourLayerNum = Number(d3.select(this).property('id').split('-')[2])
                toggleContour(contourLayerNum);
            })
            d3.selectAll('.contour-toggle-bandwidth').on('change', function() {
                var contourLayerNum = Number(d3.select(this).attr('id').split('-')[3]) // a little sketchy
                removeLayerGraphContour(contourLayerNum);
                toggleContour(contourLayerNum);
            })
            d3.selectAll('.contour-toggle-threshold').on('change', function() {
                var contourLayerNum = Number(d3.select(this).attr('id').split('-')[3]) // a little sketchy
                removeLayerGraphContour(contourLayerNum);
                toggleContour(contourLayerNum);
            })

        })
    }
    drawLayerGraph(d);

    function removeLayerGraph(peel) {
        console.log('remove interactive node link for layer ' + peel)
        d3.select("#interactive-node-link-" + peel + '-svg').remove()
    }

    function removeLayerGraphContour(peel) {
        console.log('remove interactive contour for layer ' + peel)
        d3.select("#contour-" + peel).remove();
    }

    // set initial view
    d3.select('#original-layer-image-' + d.peel).style('display', 'none')

}

function closeCard(d) {
    console.log('close card')
    numOfCardsUp -= 1;
    delete cardsUp[d.peel]
    d3.select('#card-' + d.peel).remove();
    delete zoomHandlerUp[d.peel]
    d3.select("#indicator-right-" + d.peel).style("visibility", "hidden");
    // console.log(document.getElementsByClassName('y-axis'))
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

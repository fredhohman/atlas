// card.js
import * as contour from 'd3-contour';
import * as d3 from 'd3';
// import { geoStereographic } from 'd3';
import tip from 'd3-tip';
import { dataPath, dataPathJSON, dataPathLayerJSON, imagePathLayerOrg, imagePathLayerFD, imagePathLayerContour } from './index.js'


let cardsUp = {};
let numOfCardsUp = 0;
window.numOfCardsUp = numOfCardsUp;
window.cardsUp = cardsUp;

d3.json(dataPathJSON, function (error, data) {

    if (error) {
        return console.error(error);
    }

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
    cardsUp[d.peel] = 'up'
    cardMessage();

    var layers = d3.select('#layers')
        .append('div')
        .attr('class', 'card-border-wrapper')
        .attr('id', 'card-' + d.peel)
        .append('div')
        .attr('class', 'card')
        // .style('border-left', function () { return '5px solid ' + ribbonColorPeel(d.peel) })

    var cardTop = layers.append('div').attr('class', 'card-top-wrapper')

    // var tabs = cardTop.append('div')
    //     .attr('class', 'card-tabs-wrapper tab')

    // function changeTab(evt, cardName, peel) {
    //     console.log("change tab")
    //     console.log(evt, peel)

    //     var i, tabcontent, tablinks;

    //     tabcontent = document.getElementById("card-" + peel).getElementsByClassName("tabcontent");
    //     for (i = 0; i < tabcontent.length; i++) {
    //         tabcontent[i].style.display = "none";
    //         removeLayerGraph(peel);
    //         removeLayerGraphContour(peel);
    //     }

    //     tablinks = document.getElementById("card-" + peel).getElementsByClassName("tablinks");
    //     for (i = 0; i < tablinks.length; i++) {
    //         tablinks[i].className = tablinks[i].className.replace(" active", "");
    //     }

    //     document.getElementById(cardName).style.display = "block";
    //     evt.currentTarget.className += " active";

    // }

    // var originalLayerImg = tabs.append('button')
    //     .attr('class', 'card-tabs tablinks')
    //     .text('Original')
    //     .on('click', function () { changeTab(event, 'original-layer-image-' + d.peel, d.peel) })

    // var forceDirectedLayerImg = tabs.append('button')
    //     .attr('class', 'card-tabs tablinks')
    //     .text('Force directed')
    //     .on('click', function () { changeTab(event, 'force-directed-layer-image-' + d.peel, d.peel) })

    // var contourLayerImg = tabs.append('button')
    //     .attr('class', 'card-tabs tablinks')
    //     .text('Contour')
    //     .on('click', function () { changeTab(event, 'contour-layer-image-' + d.peel, d.peel) })

    // var interactiveLayer = tabs.append('button')
    //     .attr('class', 'card-tabs tablinks active') // set initial view
    //     .text('Interactive')
    //     .on('click', function () { changeTab(event, 'interactive-node-link-' + d.peel, d.peel); drawLayerGraph(d) })

    var cardTextValueFormat = d3.format(",.3f")

    var cardBottom = layers.append('div').attr('class', 'card-bottom-wrapper')

    var cardText = cardBottom.append('div')
        .attr('class', 'card-text-wrapper')

    var cardTitle = cardText.append('div')
        .attr('class', 'card-title-wrapper')

    cardTitle.append('h3')
        .attr('class', 'card-title')
        .text('Layer ' + d.peel)

    cardTitle.append('div')
        .attr('class', 'card-icon-wrapper')
        .append("i")
        .attr('class', 'material-icons md-dark')
        .text('close')
        .style('cursor', 'pointer')
        .on('click', function () { closeCard(d) })

    // cardText.append('span').style('display','inline-block').style('padding-bottom', '10px').append('input').attr('type', 'text').attr('name', 'layer-label').attr('value', '').style('height', '20px')

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
        .text('components: ')
        .append('span')
        .attr('class', 'card-text-item-value')
        .text(d.components)

    cardText.append('span')
        .attr('class', 'smalltext-header card-text-item')
        .text('clustering: ')
        .append('span')
        .attr('class', 'card-text-item-value')
        .text(cardTextValueFormat(d.clustering))


    // var positionToggle = cardText.append('label').attr('class', 'switch')
    // positionToggle.append('input').attr('id', 'position-toggle-' + d.peel).attr('class', 'position-toggle').attr('type', 'checkbox').property('checked', false)
    // positionToggle.append('span').attr('class', 'slider round')

    var positionToggle = cardText.append('input').attr('type', 'checkbox').attr('id', "position-toggle-" + d.peel).attr('name', 'set-name').attr('class', 'switch-input position-toggle')
    var positionToggleLabel = cardText.append('label').attr('for', "position-toggle-" + d.peel).attr('class', 'switch-label smalltext-header').text('position')
    // cloneToggleLabel.append('span').attr('class', 'toggle--on').text('on')
    // cloneToggleLabel.append('span').attr('class', 'toggle--off').text('off')

    // var contourToggle = cardText.append('label').attr('class', 'switch')
    // contourToggle.append('input').attr('id', 'contour-toggle-' + d.peel).attr('class', 'contour-toggle').attr('type', 'checkbox').property('checked', false)
    // contourToggle.append('span').attr('class', 'slider round')

    var contourToggle = cardText.append('input').attr('type', 'checkbox').attr('id', "contour-toggle-" + d.peel).attr('name', 'set-name').attr('class', 'switch-input contour-toggle')
    var contourToggleLabel = cardText.append('label').attr('for', "contour-toggle-" + d.peel).attr('class', 'switch-label smalltext-header').text('contour')
    // cloneToggleLabel.append('span').attr('class', 'toggle--on').text('on')
    // cloneToggleLabel.append('span').attr('class', 'toggle--off').text('off')

    // var cloneToggle = cardText.append('label').attr('class', 'switch')
    // cloneToggle.append('input').attr('id', 'clone-toggle-' + d.peel).attr('class', 'clone-toggle').attr('type', 'checkbox').property('checked', false)
    // cloneToggle.append('span').attr('class', 'slider round')

    var cloneToggle = cardText.append('input').attr('type', 'checkbox').attr('id', "clone-toggle-" + d.peel).attr('name', 'set-name').attr('class', 'switch-input clone-toggle')
    var cloneToggleLabel = cardText.append('label').attr('for', "clone-toggle-" + d.peel).attr('class', 'switch-label smalltext-header').text('clones')
    // cloneToggleLabel.append('span').attr('class', 'toggle--on').text('on')
    // cloneToggleLabel.append('span').attr('class', 'toggle--off').text('off')

    var cloneDisplay = cardText.append('div')
        .attr('class', 'clone-display')

    // cardBottom.append('div')
    //     .attr('id', 'original-layer-image-' + d.peel)
    //     .attr('class', 'card-image-wrapper tabcontent')
    //     .append('img')
    //     .attr('src', imagePathLayerOrg(d.peel))
    //     //   .attr('width', '100%')
    //     .style('display', 'block')
    //     .style('max-height', '100%')
    //     .style('margin', 'auto')

    // cardBottom.append('div')
    //     .attr('id', 'force-directed-layer-image-' + d.peel)
    //     .attr('class', 'card-image-wrapper tabcontent')
    //     .append('img')
    //     .attr('src', imagePathLayerFD(d.peel))
    //     //   .attr('width', '100%')
    //     .style('display', 'block')
    //     .style('max-height', '100%')
    //     .style('margin', 'auto')

    // cardBottom.append('div')
    //     .attr('id', 'contour-layer-image-' + d.peel)
    //     .attr('class', 'card-image-wrapper tabcontent')
    //     .append('img')
    //     .attr('src', imagePathLayerContour(d.peel))
    //     //   .attr('width', '100%')
    //     .style('display', 'block')
    //     .style('max-height', '100%')
    //     .style('margin', 'auto')

    var interactiveNodeLinkDiv = cardBottom.append('div')
        .attr('id', 'interactive-node-link-' + d.peel)
        .attr('class', 'card-image-wrapper')

    function drawLayerGraph(d) {
        console.log('draw graph', d)

        var graphLayerMargin = { top: 0, right: 0, bottom: 0, left: 0 };
        var graphLayerWidth = document.getElementById("interactive-node-link-" + d.peel).clientWidth - graphLayerMargin.left - graphLayerMargin.right - 6
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
            var linkSVGs = g.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(graphLayerData.links)
                .enter().append("line")
                .attr('class', 'link-' + d.peel)
                .attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; })
                .attr("stroke-width", 0.6)
                .attr("stroke", function (d) { return ribbonColorPeel(d.p) })
                .style("stroke-opacity", 0.75)

            var cloneTooltip = tip().attr('class', 'd3-tip').direction('e').offset([0, 10]).html(function (d) {
                return '<span class="tooltip-number">' + d.peels.join(', ') + '</span>'
            });
            // g.append('circle').attr('id', 'tipfollowscursor')
            g.call(cloneTooltip)
            window.cloneTooltip = cloneTooltip

            // draw circles for the nodes 
            var nodeSVGs = g.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(graphLayerData.nodes)
                .enter()
                .append("circle")
                .attr('class', 'node-' + d.peel)
                .attr("r", 2)
                .attr('cx', function (d) { return d.x })
                .attr('cy', function (d) { return d.y })
                .attr("fill", function () { return ribbonColorPeel(d.peel) }) // hacky, referring to original d passed into drawLayerGraph

            // add zoom 
            const cardTranslateExtent = 2000
            var zoomHandler = d3.zoom()
                                .scaleExtent([0.25, 8])
                                // .translateExtent([[-cardTranslateExtent, -0.8*cardTranslateExtent], [cardTranslateExtent, 0.8*cardTranslateExtent]])
                                .on("zoom", zoomActions);
            graphLayerSVG.call(zoomHandler)
            graphLayerSVG.call(zoomHandler.translateTo, 0, 0)
            graphLayerSVG.call(zoomHandler.scaleTo, 0.4)

            // zoom functions
            function zoomActions() {
                g.attr("transform", d3.event.transform)
            }

            function zoomToCenter() {
                console.log('zoom to center')
                graphLayerSVG.transition().duration(1000).call(zoomHandler.translateTo, 0, 0)
            }
            d3.select('#zoom-to-center').on('click', zoomToCenter)

            // add drag
            var drag = d3.drag()
                .subject(function () {
                    var t = d3.select(this);
                    return { x: t.attr("x"), y: t.attr("y") };
                })
                .on("start", dragstarted)
                .on("drag", dragged);
            nodeSVGs.call(drag)

            // stops the propagation of the click event
            function dragstarted(d) {
                d3.event.sourceEvent.stopPropagation();
            }

            //Called when the drag event occurs (object should be moved)
            function dragged(d) {

                if (d3.select('.position-toggle').property('checked')) {
                    d.fdx += d3.event.dx;
                    d.fdy += d3.event.dy;
                } else {
                    d.x += d3.event.dx;
                    d.y += d3.event.dy;
                }
                updateNodePositionsTick();
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
                    return ribbonColorPeel(d.peel);
                }
                return 'rgba(221,221,221,0.3)';
            }
            // function getTextColor(node, neighbors) {
            //     return neighbors.indexOf(node.id) ? 'green' : 'black'
            // }
            function getLinkColor(node, link) {
                return isNeighborLink(node, link) ? ribbonColorPeel(d.peel) : 'rgba(221,221,221,0.3)';
            }

            function selectNode(selectedNode) {
                const neighbors = getNeighbors(selectedNode)

                nodeSVGs
                    .attr('fill', function (node) { return getNodeColor(node, neighbors) })
                // textElements
                // .attr('fill', node => getTextColor(node, neighbors))
                linkSVGs
                    .attr('stroke', function (link) { return getLinkColor(selectedNode, link) })
            }

            nodeSVGs.on('mouseover', function (node) {
                selectNode(node);
                if (node.peels.length > 1) {
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
                            d3.json(dataPathJSON, function (error, tempData) {
                                var obj = tempData.layers.find(function (obj) { return obj.peel === datum; });
                                addCard(obj);
                            })
                            // node.fx = 0
                            // node.fy = 0
                            // d3.selectAll('.everything').attr('transform', function () {
                            //     // console.log(uh)
                            //     'translate(' + node.fx + ', ' + node.fy + ') scale(' + 1 + ', ' + 1 + ')'
                            // })
                            // node.fx = graphLayerWidth / 2
                            // node.fx = graphLayerHeight / 2
                        })

                } else {
                    cloneDisplay.attr('class', 'clone-label').text('no clones')
                }
            })

            nodeSVGs.on('mouseout', function () {
                nodeSVGs.attr('fill', ribbonColorPeel(d.peel)); // hacky, referring to original d passed into drawLayerGraph
                linkSVGs.attr('stroke', ribbonColorPeel(d.peel)); // hacky, referring to original d passed into drawLayerGraph
                // cloneTooltip.hide();
            })

            nodeSVGs.on('click', function (d) {
                console.log('clicked')
                d.fx = null;
                d.fy = null;
                d3.select(this).classed('fixed', false)
            })

            function toggleClones() {
                console.log('toggle clones')
                console.log(this)

                var contourLayerNum = Number(d3.select(this).property('id').split('-')[2])
                var selectedNodes = d3.selectAll('.node-' + contourLayerNum)

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
                                if (d.peels.length > 1) {
                                    return 3.5
                                } else {
                                    return 2.5
                                }
                            })
                } else {
                    // default node styling
                    selectedNodes.classed('clone', false)
                    selectedNodes.attr('fill', function () { return ribbonColorPeel(contourLayerNum) })
                    selectedNodes.attr('r', 3)
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

            function updateNodePositionsTick() {
                if (d3.select('.position-toggle').property('checked')) {

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

            function toggleContour() {
                console.log('draw contour')

                var contourLayerNum = Number(d3.select(this).property('id').split('-')[2])

                if (d3.select(this).property('checked')) {

                    var selectedNodes = d3.selectAll('.node-' + contourLayerNum)
                    var selectedNodesData = selectedNodes.data()
                    console.log(contourLayerNum, selectedNodesData)

                    var contourX = d3.scaleLinear()
                        // .rangeRound([graphLayerMargin.left, graphLayerWidth - graphLayerMargin.right]);
                        .rangeRound([0, 500]);

                    var contourY = d3.scaleLinear()
                        // .rangeRound([graphLayerHeight - graphLayerMargin.bottom, graphLayerMargin.top]);
                        .rangeRound([0, 500]);

                    contourX.domain(d3.extent(selectedNodesData, function (d) { return d.fdx; })).nice();
                    contourY.domain(d3.extent(selectedNodesData, function (d) { return d.fdy; })).nice();

                    // g.append("g")
                    //     .attr("stroke", "white")
                    //     .attr("stroke-width", 0.5)
                    //     .selectAll("circle")
                    //     // .data(data.nodes.filter(function (d) {
                    //     //     // return +d.id.split('_')[1] === layer
                    //     //     return d
                    //     // }))
                    //     .data()
                    //     .enter().append("circle")
                    //     .attr("cx", function (d) { return x(d.location[0]); })
                    //     .attr("cy", function (d) { return y(d.location[1]); })
                    //     .attr("r", 2)
                    //     .attr("opacity", 1.0)
                    //     .attr("fill", function (d) { return '#' + d.color.split('x')[1] });

                    g.insert("g", "g").attr('id', 'contour-' + contourLayerNum)
                        .attr("fill", "none")
                        .attr("stroke", ribbonColorPeel(contourLayerNum))
                        .attr("stroke-linejoin", "round")
                        .selectAll("path")
                        .data(contour.contourDensity()
                            .x(function (d) { return contourX(d.fdx); })
                            .y(function (d) { return contourY(-1 * d.fdy); })
                            .size([graphLayerWidth, graphLayerHeight])
                            .bandwidth(70)
                            (selectedNodesData))
                        .enter().append("path")
                        .attr("d", d3.geoPath());

                    g.append("g")
                        .attr('class', 'contour-x-axis')
                        .attr("transform", "translate(0," + (graphLayerHeight - graphLayerMargin.bottom) + ")")
                        .call(d3.axisBottom(contourX))
                        .select(".tick:last-of-type text")
                        .select(function () { return this.parentNode.appendChild(this.cloneNode()); })
                        .attr("y", -3)
                        .attr("dy", null)
                        .attr("font-weight", "bold")
                        .text("x");

                    g.append("g")
                        .attr('class', 'contour-y-axis')
                        .attr("transform", "translate(" + graphLayerMargin.left + ",0)")
                        .call(d3.axisLeft(contourY))
                        .select(".tick:last-of-type text")
                        .select(function () { return this.parentNode.appendChild(this.cloneNode()); })
                        .attr("x", 3)
                        .attr("text-anchor", "start")
                        .attr("font-weight", "bold")
                        .text("y");

                } else {
                    d3.select('#contour-' + contourLayerNum).remove()
                    d3.select('.contour-x-axis').remove()
                    d3.select('.contour-y-axis').remove()
                }

            }
            d3.selectAll('.contour-toggle').on('click', toggleContour)

        })
    }
    drawLayerGraph(d);

    function removeLayerGraph(peel) {
        console.log('remove interactive node link for layer ' + peel)
        d3.select("#interactive-node-link-" + peel + '-svg').remove()
    }

    function removeLayerGraphContour(peel) {
        console.log('remove interactive contour for layer ' + peel)
        d3.select("#contour-interactive-" + peel + '-svg').remove()
    }

    // set initial view
    d3.select('#original-layer-image-' + d.peel).style('display', 'none')

}

function closeCard(d) {
    console.log('close card')
    numOfCardsUp -= 1;
    delete cardsUp[d.peel]
    d3.select('#card-' + d.peel).remove();
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


import * as d3 from 'd3';
var THREE = require('three');
var TrackballControls = require('three-trackballcontrols');
// var Projector = require('three.js-projector');
import { dataPathJSON, dataPathLayerJSON } from './index.js'
import { selectedNodeIDs } from './card.js'

export var layersUp3D = {};
window.layersUp3D = layersUp3D;

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
);
var xCordScaleConst = 1;
var yCordScaleConst = 1;
var zCordHeight = 500;
// camera.position.set(0, -1.5 * zCordHeight, 1.5 * zCordHeight);
camera.position.set(0, 0, zCordHeight);
camera.lookAt(scene.position)

var overview = document.getElementById("overview-canvas-wrapper");
var renderer = new THREE.WebGLRenderer();
camera.aspect = overview.clientWidth / overview.clientHeight;
camera.updateProjectionMatrix();
console.log(document.getElementById("overview-header").clientHeight);
renderer.setSize(
    overview.clientWidth - 0,
    overview.clientHeight - document.getElementById("overview-header").clientHeight
);
overview.appendChild(renderer.domElement);

window.addEventListener("resize", onWindowResize, false);
window.addEventListener("ribbonDragEnd", onWindowResize, false);

function onWindowResize() {
    // console.log(document.getElementById('overview-header').clientHeight)
    camera.aspect = overview.clientWidth / overview.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(overview.clientWidth - 0, overview.clientHeight - document.getElementById('overview-header').clientHeight);
}

var controls = new TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 4;
controls.dampingFactor = 0.1;

var geometry = new THREE.CircleBufferGeometry(2, 12);

var circles = [];
var lines = [];

// const gui = new GUI();
// var test = gui.addFolder('test');
// window.circles = circles
// console.log(circles)
// console.log(circles.length)

var xCordScale, yCordScale, zCordScale;

var lineMaterial = new THREE.LineBasicMaterial({
    color: 0x333333,
    transparent: true,
    opacity: 0.1 //0.03
    // linewidth: 0.2
});

export function drawLayer3DPoints(layerNum) {
    console.log('drawing layer ' + layerNum + ' 3D points')
    layersUp3D[layerNum] = 'up'
    
    d3.select("#indicator-left-" + layerNum).style("visibility", "visible");
    
    d3.json(dataPathJSON, function (error, data) {
        if (error) {
            return console.error(error);
        }
        
        // xCordScale = d3.scaleLinear()
        //     // .domain([0,1000])
        //     .range([0, 1000])
        
        // yCordScale = d3.scaleLinear()
        //     // .domain([0,1000])
        //     .range([0, 1000])
        
        zCordScale = d3.scaleLinear()
        .domain(d3.extent(data.peels))
        .range([-zCordHeight, zCordHeight])
        window.zCordScale = zCordScale
        
        var layerNumIndex = data.peels.indexOf(layerNum)
        // console.log('peel', data.peels[layerNumIndex])
        
        d3.json(dataPathLayerJSON(data.peels[layerNumIndex]), function (error, layerData) {
            
            for (let i = 0; i < layerData.nodes.length; i++) {
                const node = layerData.nodes[i];
                
                var material = new THREE.MeshBasicMaterial();
                material.side = THREE.DoubleSide;
                
                var circle = new THREE.Mesh(geometry, material);
                
                circle.scale.x = d3.select('#overview-slider-size').property('value')
                circle.scale.y = d3.select('#overview-slider-size').property('value')
                
                // xCordScale.domain(d3.extent(layerData.nodes.map(function (item) {
                //     return (item.x);
                // })))
                
                // yCordScale.domain(d3.extent(layerData.nodes.map(function (item) {
                //     return (item.y);
                // })))
                
                circle.position.x = node.x * d3.select('#overview-slider-spread').property('value')
                circle.position.y = -1 * node.y * d3.select('#overview-slider-spread').property('value')
                zCordHeight = d3.select('#overview-slider-height').property('value')
                zCordScale.range([-zCordHeight, zCordHeight])
                circle.position.z = zCordScale(data.peels[layerNumIndex]);
                
                let clusterColor = d3.select("#bullet-" + data.peels[layerNumIndex]).style('fill');
                if (node.id + '-' + layerNum in selectedNodeIDs) {
                    // already selected in 2d card
                    circle.material.color.setHex("0x" + "2196F3");
                } else {
                    circle.material.color.setHex(RGBtoHex(clusterColor));
                }
                circle.userData['id'] = node.id
                circle.userData['peel'] = data.peels[layerNumIndex]
                circle.userData['x'] = node.x
                circle.userData['y'] = -1 * node.y
                scene.add(circle);
                circles.push(circle)
                
                // var map = new THREE.TextureLoader("sprite.png");
                // // console.log(map)
                // var material = new THREE.SpriteMaterial({ map: map, color: 0xffffff, fog: true });
                // var sprite = new THREE.Sprite(material);
                // sprite.position.x = node.x * 4;
                // sprite.position.y = node.y * 4;
                // sprite.position.z = zCordScale(data.peels[peel]);
                // scene.add(sprite);
                
            }
            
            // console.log('add lines')
            const arrayToObject = (array, keyField) =>
            array.reduce((obj, item) => {
                obj[item[keyField]] = item
                return obj
            }, {})
            const layerDataObject = arrayToObject(layerData.nodes, "id")
            // console.log(layerDataObject)
            
            var lineGeometry = new THREE.Geometry();
            
            // console.log(data.peels[layerNumIndex])
            for (let j = 0; j < layerData.links.length; j++) {
                const link = layerData.links[j];
                
                let source = new THREE.Vector3(
                    layerDataObject[link.source].x * d3.select("#overview-slider-spread").property("value"),
                    -1 * layerDataObject[link.source].y * d3.select("#overview-slider-spread").property("value"),
                    zCordScale(data.peels[layerNumIndex])
                );
                let target = new THREE.Vector3(
                    layerDataObject[link.target].x * d3.select("#overview-slider-spread").property("value"),
                    -1 * layerDataObject[link.target].y * d3.select("#overview-slider-spread").property("value"),
                    zCordScale(data.peels[layerNumIndex])
                );
                
                source.source = link.source;
                target.target = link.target;
                source.peel = data.peels[layerNumIndex];
                target.peel = data.peels[layerNumIndex];
                source.ox = layerDataObject[link.source].x;
                source.oy = -1 * layerDataObject[link.source].y;
                target.ox = layerDataObject[link.target].x;
                target.oy = -1 * layerDataObject[link.target].y;
                
                lineGeometry.vertices.push(source, target);
            }
            
            var line = new THREE.LineSegments(lineGeometry, lineMaterial);
            if (d3.select('#toggle-3d-edges').property('checked')) {
                line.visible = true;
            } else {
                line.visible = false;
            }
            
            scene.add(line);
            lines.push(line)
            
        })
    })
}

export function drawAll3DPointsWithLayers() {
    console.log('drawing all 3D layers')
    
    d3.json(dataPathJSON, function (error, data) {
        if (error) {
            return console.error(error);
        }
        
        for (let peel = 0; peel < data.peels.length; peel++) {
            if (!(data.peels[peel] in layersUp3D)) {
                drawLayer3DPoints(data.peels[peel])
            }
        }
        Object.keys(layersUp3D).forEach(key => {
            d3.select("#indicator-left-" + key).style("visibility", "visible");
        });
        
    })
}

// overview header sliders
d3.select("#overview-slider-size")
.attr("max", 10)
.attr("min", 0.1)
.attr("step", 0.1)
.property("value", 1)
.on("input", updateRadius)
.on("change", updateRadius);

var heightSlider = d3.select("#overview-slider-height")
.attr("max", 3 * zCordHeight)
.attr("min", 1)
.attr("step", 0.01)
.property("value", 1)
.on("input", updateZPosition);

d3.select("#overview-slider-spread")
.attr("max", 2)
.attr("min", 0)
.attr("step", 0.05)
.property("value", 1)
.on("input", updateXPosition);

d3.select('#reset-camera-button')
.on('click', resetOverviewCamera)
.html('<i class="material-icons md-24 ">videocam</i><span style="padding-left: 5px">top view</span>')

d3.select('#add-all-3d-layers')
.on('click', drawAll3DPointsWithLayers)
.html('<i class="material-icons md-24 ">add</i><span style="padding-left: 5px">show all</span>')

d3.select('#remove-all-3d-layers')
.on('click', removeAll3DPoints)
.html('<i class="material-icons md-24 ">remove</i><span style="padding-left: 5px">hide all</span>')

d3.select('#animate-graph')
.on('click', animateGraph)
.html('<i class="material-icons md-24 ">play_arrow</i><span style="padding-left: 5px">animate</span>')

d3.select('#toggle-3d-edges')
.on('click', toggle3DEdges)
// .html('<i class="material-icons md-24 ">play_arrow</i>show edges')

function updateRadius() {
    for (let c = 0; c < circles.length; c++) {
        circles[c].scale.x = this.value
        circles[c].scale.y = this.value
    }
}

function updateZPosition() {
    zCordHeight = this.value
    zCordScale.range([-zCordHeight, zCordHeight])
    
    for (let c = 0; c < circles.length; c++) {
        // zCordHeight = this.value
        circles[c].position.z = zCordScale(circles[c].userData['peel'])
    }
    
    for (let l = 0; l < lines.length; l++) {
        // console.log('lines', lines[l])
        for (let v = 0; v < lines[l].geometry.vertices.length; v++) {
            lines[l].geometry.vertices[v].z = zCordScale(lines[l].geometry.vertices[v].peel)
            lines[l].geometry.verticesNeedUpdate = true;
        }
    }
}

function updateXPosition() {
    for (let c = 0; c < circles.length; c++) {
        circles[c].position.x = circles[c].userData['x'] * this.value
        circles[c].position.y = circles[c].userData['y'] * this.value
    }
    
    for (let l = 0; l < lines.length; l++) {
        // console.log('lines', lines[l])
        for (let v = 0; v < lines[l].geometry.vertices.length; v++) {
            lines[l].geometry.vertices[v].x = lines[l].geometry.vertices[v].ox * this.value
            lines[l].geometry.vertices[v].y = lines[l].geometry.vertices[v].oy * this.value
            lines[l].geometry.verticesNeedUpdate = true;
        }
    }
}

function resetOverviewCamera() {
    controls.reset();
}

function removeAll3DPoints() {
    for (let c = 0; c < circles.length; c++) {
        scene.remove(circles[c]);
    }
    for (let l = 0; l < lines.length; l++) {
        scene.remove(lines[l]);
    }
    Object.keys(layersUp3D).forEach(key => {
        d3.select("#indicator-left-" + key).style("visibility", "hidden");
    });
    
    layersUp3D = {};
    circles = [];
    lines = [];
    window.layersUp3D = layersUp3D;
}

export function removeLayerInOverview(peel) {
    console.log('removing layer ' + peel)
    for (let c = 0; c < circles.length; c++) {
        if (circles[c].userData['peel'] == peel) {
            scene.remove(circles[c])
        }
    }
    console.log(lines[0])
    for (let l = 0; l < lines.length; l++) {
        for (let v = lines[l].geometry.vertices.length; v > 0; v--) {
            console.log(v)
            console.log(lines[l].geometry.vertices[v-1])
            if (lines[l].geometry.vertices[v-1].peel === peel) {
                lines[l].geometry.vertices[v-1].splice(v-1, 1)
            }
        }
    }
}

export function hideLayerPoints(peel) {
    for (let c = 0; c < circles.length; c++) {
        if (circles[c].peel == peel) {
            circles[c].visible = false;
        }
    }
}

export function showLayerPoints(peel) {
    for (let c = 0; c < circles.length; c++) {
        if (circles[c].peel == peel) {
            circles[c].visible = true;
        }
    }
}

export function toggle3DEdges() {
    if (d3.select(this).property("checked")) {
        for (let l = 0; l < lines.length; l++) {
            lines[l].visible = true;
        }
    } else {
        for (let l = 0; l < lines.length; l++) {
            lines[l].visible = false;
        }
    }
}
document.getElementById("toggle-3d-edges").click();

function animateGraph() {
    console.log("animate");
    // console.log(heightSlider.property('value'))
    
    var start = 1;
    var end = 1000;
    var duration = 2;
    var increment = (end - start) / (60 * duration);
    var counter = 0;
    
    function tick() {
        heightSlider.property("value", start + counter * increment);
        counter += 1;
        
        if (start + increment * counter < end) {
            window.requestAnimationFrame(tick);
            updateZPosition.call({ value: start + counter * increment });
        }
    }
    
    window.requestAnimationFrame(tick);
}

export function colorSelectedNode(selectedNode) {
    console.log('color selected nodes')
    for (let c = 0; c < circles.length; c++) {
        if (circles[c].userData['id'] + '-' + circles[c].userData['peel'] === selectedNode) {
            console.log(circles[c])
            circles[c].material.color.setHex('0x' + '2196F3');
        }
    }
}

export function uncolorSelectedNode(selectedNode) {
    console.log('uncolor selected nodes')
    for (let c = 0; c < circles.length; c++) {
        if (circles[c].userData['id'] + '-' + circles[c].userData['peel' ]=== selectedNode) {
            console.log(selectedNode.split('-')[1], d3.select("#bullet-" + selectedNode.split('-')[1]).style('fill'))
            circles[c].material.color.setHex(RGBtoHex(d3.select("#bullet-" + selectedNode.split('-')[1]).style('fill')));
        }
    }
}

function RGBtoHex(rgbColor) {
    var rgbColor = rgbColor.split("(")[1].split(")")[0];
    rgbColor = rgbColor.split(",");
    var hexColor = rgbColor.map(function(x) {
        // For each array element
        x = parseInt(x).toString(16); //Convert to a base16 string
        return x.length == 1 ? "0" + x : x; //Add zero if we get only one character
    });
    hexColor = "0x" + hexColor.join("");
    return hexColor;
}

// projector = new Projector.Projector();

function onDocumentMouseDown(event) {
    console.log("clicked");
    // event.preventDefault();
    // var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
    // projector.unprojectVector( vector, camera );
    // var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );
    // var intersects = ray.intersectObjects( objects );
    // if ( intersects.length > 0 ) {
    //     intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );
    //     console.log(clicked)
    // }
}

// document.addEventListener( 'mousedown', onDocumentMouseDown, false );

var animate = function() {
    requestAnimationFrame(animate);
    controls.update();
    circles.map(x => x.lookAt(camera.position));
    renderer.render(scene, camera);
};

animate();
// onWindowResize();
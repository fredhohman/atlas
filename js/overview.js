// overview.js
import * as d3 from 'd3';
var THREE = require('three');
var TrackballControls = require('three-trackballcontrols');
// var Stats = require('stats.js');
// var Projector = require('three.js-projector');
import { dataPathJSON, dataPathLayerJSON } from './index.js'
import { GUI } from 'dat.gui/build/dat.gui.js'
import * as $ from 'jquery';

console.log('overview.js loaded')

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
var xCordScaleConst = 1;
var yCordScaleConst = 1;
var zCordHeight = 500;
// camera.position.set(0, -1.5 * zCordHeight, 1.5 * zCordHeight);
camera.position.set(0, 0, zCordHeight);
camera.lookAt(scene.position)

var overview = document.getElementById('overview-canvas-wrapper')
var renderer = new THREE.WebGLRenderer();
camera.aspect = overview.clientWidth / overview.clientHeight;
camera.updateProjectionMatrix();
renderer.setSize(overview.clientWidth - 0, overview.clientHeight - 0 - document.getElementById('overview-header').clientHeight);
overview.appendChild(renderer.domElement);

window.addEventListener('resize', onWindowResize, false);
window.addEventListener('ribbonDragEnd', onWindowResize, false)

function onWindowResize() {
    camera.aspect = overview.clientWidth / overview.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(overview.clientWidth - 0, overview.clientHeight - document.getElementById('overview-header').clientHeight - 0);
}


var controls = new TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 4;
controls.dampingFactor = 0.1;

var geometry = new THREE.CircleBufferGeometry(2, 20);

// random circles
// var size = 500;
// var numOfCircles = 10000

// for ( i = 0; i < numOfCircles; i++ ) {
//     var material = new THREE.MeshBasicMaterial( );
//     material.side = THREE.DoubleSide;

//     var circle = new THREE.Mesh( geometry, material );
//     circle.position.x = Math.random() * size - size/2;
//     circle.position.y = Math.random() * size - size/2;
//     circle.position.z = Math.random() * size - size/2;
//     // circle.lookAt( camera.position );
//     circle.material.color.setHex('0xffffff')
//     scene.add( circle );
// }

var circles = [];

// const gui = new GUI();
// var test = gui.addFolder('test');
// window.circles = circles
// console.log(circles)
// console.log(circles.length)

var xCordScale, yCordScale, zCordScale;

var lineMaterial = new THREE.LineBasicMaterial({
    color: 0xcccccc
});

// var lineGeometry = new THREE.Geometry();

d3.json(dataPathJSON, function (error, data) {

    if (error) {
        return console.error(error);
    }

    for (let peel = 0; peel < data.peels.length; peel++) {

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


        console.log('peel', data.peels[peel])

        d3.json(dataPathLayerJSON(data.peels[peel]), function (error, layerData) {

            for (let i = 0; i < layerData.nodes.length; i++) {
                const node = layerData.nodes[i];

                var material = new THREE.MeshBasicMaterial();
                material.side = THREE.DoubleSide;

                var circle = new THREE.Mesh(geometry, material);

                // xCordScale.domain(d3.extent(layerData.nodes.map(function (item) {
                //     return (item.x);
                // })))

                // yCordScale.domain(d3.extent(layerData.nodes.map(function (item) {
                //     return (item.y);
                // })))

                circle.position.x = node.x * xCordScaleConst;
                // circle.position.x = xCordScale(node.x);
                circle.position.y = node.y * xCordScaleConst;
                // circle.position.y = yCordScale(node.y);

                // circle.position.z = zCordScale(data.peels[peel]);
                circle.position.z = 1;
                circle.material.color.setHex(RGBtoHex(ribbonColorPeel(data.peels[peel])))
                circle.userData['id'] = node.id
                circle.userData['peel'] = data.peels[peel]
                circle.userData['x'] = node.x
                circle.userData['y'] = node.y
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


            const arrayToObject = (array, keyField) =>
                array.reduce((obj, item) => {
                    obj[item[keyField]] = item
                    return obj
                }, {})
            const layerDataObject = arrayToObject(layerData.nodes, "id")


            // var lineGeometry = new THREE.Geometry();
            // console.log(data.peels[peel])
            // // if (data.peels[peel] === 15 || data.peels[peel] === 12 || data.peels[peel] === 10) {
            //     for (let j = 0; j < layerData.links.length; j++) {
            //         const link = layerData.links[j];
            //         // console.log(link)
            //         // console.log(layerData.nodes.find(function (foundNode) { return foundNode.id === link.source; }))
            //         // var foundNode1 = layerData.nodes.find(function (foundNode) { return foundNode.id === link.source; })
            //         // var foundNode2 = layerData.nodes.find(function (foundNode) { return foundNode.id === link.target; })

            //         lineGeometry.vertices.push(
            //             new THREE.Vector3(layerDataObject[link.source].x * xCordScaleConst, layerDataObject[link.source].y * yCordScaleConst, zCordScale(data.peels[peel])),
            //             new THREE.Vector3(layerDataObject[link.target].x * xCordScaleConst, layerDataObject[link.target].y * yCordScaleConst, zCordScale(data.peels[peel])),
            //         );

            //         var line = new THREE.Line(lineGeometry, lineMaterial);
            //         scene.add(line);
            //     }
            // // }




        })
    }
})

// overview header sliders
d3.select('#overview-header-size')
  .attr('max', 10)
  .attr('min', 0.1)
  .attr('step', 0.01)
  .attr('value', 1)
  .on('input', updateRadius)

var heightSlider = d3.select('#overview-slider-height')
                     .attr('max', 3*zCordHeight)
                     .attr('min', 1)
                     .attr('step', 0.01)
                     .attr('value', 1)
                     .on('input', updateZPosition)

d3.select('#overview-slider-spread')
  .attr('max', 2)
  .attr('min', 0)
  .attr('step', 0.01)
  .attr('value', 1)
  .on('input', updateXPosition)

d3.select('#reset-camera-button')
    .on('click', resetOverviewCamera)
    .html('<i class="material-icons md-24 ">videocam</i><span style="padding-left: 5px;">Reset</span>')   

// d3.select('#overview-header')
//   .append('button')
//   .text('animate graph')
//   .on('click', animateGraph)

function updateRadius() {
    for (let c = 0; c < circles.length; c++) {
        circles[c].scale.x = this.value
        circles[c].scale.y = this.value
        
    }
    console.log(circles[0])
}

function updateZPosition() {
    zCordHeight = this.value
    zCordScale.range([-zCordHeight, zCordHeight])

    for (let c = 0; c < circles.length; c++) {
        // zCordHeight = this.value
        circles[c].position.z = zCordScale(circles[c].userData['peel'])
    }
}

function updateXPosition() {
    for (let c = 0; c < circles.length; c++) {
        circles[c].position.x = circles[c].userData['x'] * this.value
        circles[c].position.y = circles[c].userData['y'] * this.value
        
    }
}

function resetOverviewCamera() {
    controls.reset();
}

function animateGraph() {
    console.log('animate')
    console.log(heightSlider.attr('value'))
    heightSlider.attr('value', 1000)
    // heightSlider
    console.log(heightSlider.attr('value'))
}

function RGBtoHex(rgbColor) {
    var rgbColor = rgbColor.split("(")[1].split(")")[0];
    rgbColor = rgbColor.split(",");
    var hexColor = rgbColor.map(function (x) {             //For each array element
        x = parseInt(x).toString(16);      //Convert to a base16 string
        return (x.length == 1) ? "0" + x : x;  //Add zero if we get only one character
    })
    hexColor = "0x" + hexColor.join("");
    return hexColor
}


// projector = new Projector.Projector();

function onDocumentMouseDown(event) {
    console.log('clicked')
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



// var stats = new Stats();
// stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.dom);


var animate = function () {
    // stats.begin();

    requestAnimationFrame(animate);
    controls.update();
    circles.map(x => x.lookAt( camera.position ));
    renderer.render(scene, camera);

    // stats.end();
};

animate();


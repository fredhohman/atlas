// overview.js
import { dataPathJSON, dataPathLayerJSON } from './index.js'

import * as d3 from 'd3';
var THREE = require('three');
var TrackballControls = require('three-trackballcontrols');
// var Stats = require('stats.js');
// var Projector = require('three.js-projector');

console.log('overview.js loaded')

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var overview = document.getElementById('overview')
var renderer = new THREE.WebGLRenderer();
camera.aspect = overview.clientWidth / overview.clientHeight;
camera.updateProjectionMatrix();
renderer.setSize(overview.clientWidth - 0, overview.clientHeight - 0);
overview.appendChild(renderer.domElement);

window.addEventListener('resize', onWindowResize, false);
window.addEventListener('ribbonDragEnd', onWindowResize, false)
// overview.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = overview.clientWidth / overview.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(overview.clientWidth - 0, overview.clientHeight - 0 - 0);
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

// var path = '../' + dataPathJSON

d3.json(dataPathJSON, function (error, data) {

    if (error) {
        return console.error(error);
    }
    
    for (let peel = 0; peel < data.peels.length; peel++) {

        console.log('peel', data.peels[peel])

        d3.json(dataPathLayerJSON(data.peels[peel]), function (error, layerData) {

            for (let i = 0; i < layerData.nodes.length; i++) {
                const node = layerData.nodes[i];


                var material = new THREE.MeshBasicMaterial();
                material.side = THREE.DoubleSide;

                var circle = new THREE.Mesh(geometry, material);

                circle.position.x = node.x * 5;
                circle.position.y = node.y * 5;
                circle.position.z = data.peels[peel] * 50;
                // circle.lookAt( camera.position );
                circle.material.color.setHex(RGBtoHex(ribbonColorPeel(data.peels[peel])))
                // circle.material.color.setHex('0x222222')
                scene.add(circle);
            }
        })
    }
})

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


camera.position.z = 5;


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
    renderer.render(scene, camera);

    // stats.end();
};

animate();

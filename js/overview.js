// overview.js
import * as d3 from 'd3';
var THREE = require('three');
var TrackballControls = require('three-trackballcontrols');
// var Stats = require('stats.js');
// var Projector = require('three.js-projector');
import { dataPathJSON, dataPathLayerJSON } from './index.js'
import { GUI } from 'dat.gui/build/dat.gui.js'

console.log('overview.js loaded')

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
var xCordScale = 1.5;
var yCordScale = 1.5;
var zCordHeight = 500;
camera.position.set(0, -1.5 * zCordHeight, 1.5 * zCordHeight);
camera.lookAt(scene.position)

var overview = document.getElementById('overview')
var renderer = new THREE.WebGLRenderer();
camera.aspect = overview.clientWidth / overview.clientHeight;
camera.updateProjectionMatrix();
renderer.setSize(overview.clientWidth - 0, overview.clientHeight - 0);
overview.appendChild(renderer.domElement);

window.addEventListener('resize', onWindowResize, false);
window.addEventListener('ribbonDragEnd', onWindowResize, false)

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

var circles = [];

// const gui = new GUI();
// var test = gui.addFolder('test');
// window.circles = circles
// console.log(circles)
// console.log(circles.length)

var zCordScale;

d3.json(dataPathJSON, function (error, data) {

    if (error) {
        return console.error(error);
    }

    for (let peel = 0; peel < data.peels.length; peel++) {

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

                circle.position.x = node.x * xCordScale;
                circle.position.y = node.y * yCordScale;

                circle.position.z = zCordScale(data.peels[peel]);
                circle.material.color.setHex(RGBtoHex(ribbonColorPeel(data.peels[peel])))
                circle.userData['id'] = node.id
                circle.userData['peel'] = data.peels[peel]
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
        })
    }
})
// test.add(circles[0].scale, 'x', 0, 3).name('Width').listen();
d3.select('#nav').append('input').attr('type', 'range').attr('max', 10).attr('min', 0.1).attr('step', 0.01).on('input', updateRadius)
d3.select('#nav').append('input').attr('type', 'range').attr('max', 3*zCordHeight).attr('min', 1).attr('step', 0.01).attr('value', zCordHeight).on('input', updateZPosition)
d3.select('#nav').append('button').text('reset camera').on('click', resetOverviewCamera)

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

function resetOverviewCamera() {
    camera.position.set(0, -1.5 * zCordHeight, 1.5 * zCordHeight);
    camera.lookAt([0, 0, 0])
    controls.update();
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

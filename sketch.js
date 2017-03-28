//var camera = new THREE.OrthographicCamera(innerWidth / -2, innerWidth, innerHeight / 2, innerHeight / -2,1,1000) ////1
var pMouseV = new THREE.Vector3(0.0, 0.0, 0.0);
var mouse = new THREE.Vector3(0.0, 0.0, 0.0);

var mouseV = new THREE.Vector3(0.0, 0.0, 0.0);

window.show_coords = function(event) {
    //<body onmousemove ="show_coords(event)">
    x = event.clientX;
    y = event.clientY;
    mouse.x = x - innerWidth / 2;
    mouse.y = -y + innerHeight / 2;
    mouse.z = 200 * Math.random() - 100;
    //  console.log(x + ' ' + y);
}

var $ = require('jquery');
var Particle = require('./particles.js');
function touch (event){
    var event = event || window.event;

    var oInp = document.getElementById("inp");

    switch(event.type){
        case "touchstart":
            oInp.innerHTML = "Touch started (" + event.touches[0].clientX + "," + event.touches[0].clientY + ")";
            break;
        case "touchend":
            oInp.innerHTML = "<br>Touch end (" + event.changedTouches[0].clientX + "," + event.changedTouches[0].clientY + ")";
            break;
        case "touchmove":
            event.preventDefault();
            oInp.innerHTML = "<br>Touch moved (" + event.touches[0].clientX + "," + event.touches[0].clientY + ")";
            break;
    }
    mouse.x = event.touches[0].clientX - innerWidth / 2;
    mouse.y = -event.touches[0].clientY + innerHeight / 2;
    mouse.z = 200 * Math.random() - 100;
alert(mouse.x);
}
alert(1);
$("body").on("touchstart", touch);
$("body").on("touchend", touch);
//var THREE = require('three');
var vShader = $('#vertexshader');
var fShader = $('#fragmentshader');
var fShaderforline = $('#fragmentshaderforline');
var uniforms = {
    amplitude: {
        type: 'float',
        value: 0
    },
    mouse: {
        type: 'vec2',
        value: new THREE.Vector2(0, 0)
    },
    seed: {
        type: 'float',
        value: 0.001
    }
}
var shaderMaterial = new THREE.ShaderMaterial({ //6
    uniforms: uniforms,
    vertexShader: vShader.text(),
    fragmentShader: fShader.text()
});
var shaderMaterialForLine = new THREE.ShaderMaterial({ //6
    uniforms: uniforms,
    vertexShader: vShader.text(),
    fragmentShader: fShaderforline.text()
});
var camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 10000) ////1
camera.position.set(0, 0, 600);

var scene = new THREE.Scene(); //2
var light = new THREE.PointLight(0xffffff, 1, 500);
light.position.set(0, 0, 0);
scene.add(light);
var renderer = new THREE.WebGLRenderer();
scene.add(camera);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const RADIUS = 50;
const SEGMENTS = 10;
const RINGS = 10;
var particles = [];
var MAX_POINTS = 20000;
for (var i = 0; i < MAX_POINTS; i++) {
    particles.push(new Particle());
}

var dx = new THREE.Vector3(0.0, 0.0, 0.0);

var frame = 0;
var seed = 588.0; //
var pushRad = 10;

var geometry = new THREE.BufferGeometry();
var positions = new Float32Array(MAX_POINTS * 3);
var attrib = new THREE.BufferAttribute(positions, 3);
geometry.addAttribute('position', attrib);


shaderMaterialForLine.transparent = true;
shaderMaterial.transparent = true;

var line = new THREE.Line(geometry, shaderMaterialForLine);
var point = new THREE.Points(geometry, shaderMaterial);
scene.add(line);
scene.add(point);
//console.log(line.geometry.attributes.position.needsUpdate);
//console.log(line.material);
positions = line.geometry.attributes.position.array;
var x = y = z = index = 0;
for (var i = 0, l = MAX_POINTS; i < l; i++) {
    //    opacity[i] = 0.5;
    positions[index++] = particles[i].pos.x;
    positions[index++] = particles[i].pos.y;
    positions[index++] = particles[i].pos.z;
}
var n = 0;
// draw range
drawCount = 1000; // draw the first 2 points, only
geometry.setDrawRange(0, drawCount);

var cameraZ = 0;
//--------------------------renderer-----------------------
function update() { ///////why vector can't use=?
    mouseV.x = mouse.x;
    mouseV.y = mouse.y;
    mouseV.z = mouse.z;
    //  n = noise(frame);
    //  console.log(particles[0].pos);
    for (var i = 0; i < particles.length; i++) {
        //  var mouseTemp = mouseV;
        var A = particles[i];
        dx = new THREE.Vector3().subVectors(A.pos, pMouseV);
        if (Math.abs(dx.x) < pushRad) {
            if (Math.abs(dx.y) < pushRad) {
                if (dx.length() < pushRad) {
                    //dx.normalize();
                    // A.f.add(PVector.mult(dx, 0.8));
                    //var temp = new THREE.Vector3().
                    //subVectors(mouseV, pMouseV);
                    //temp.subVectors(temp, A.vel);
                    //temp.multiplyScalar(1.5);
                    //A.vel.addVectors(A.vel, temp);
                    mouseV.sub(pMouseV);
                    mouseV.sub(A.vel);
                    mouseV.multiplyScalar(0.3);
                    A.vel.add(mouseV);
                }
            }
        }
        A.update();
    }
    index = 0;

    //  console.log(mouseV);
    camera.position.set(600 * Math.cos(frame), 0, 600 * Math.sin(frame));
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    cameraZ += 1;
    for (var i = 0, l = MAX_POINTS; i < l; i++) {
        positions[index++] = particles[i].pos.x;
        positions[index++] = particles[i].pos.y;
        positions[index++] = particles[i].pos.z;

    }

    //    material.color = new THREE.Color(Math.random(), Math.random(), Math.random());



    //  console.log(line.material);

    geometry.attributes.position.needsUpdate = true;
    geometry.setDrawRange(0, MAX_POINTS);
    pMouseV.x = mouseV.x;
    pMouseV.y = mouseV.y;
    pMouseV.z = mouseV.z;
    renderer.render(scene, camera);
    requestAnimationFrame(update);
    frame += 0.001;
    //console.log(mouse.x+' '+mouse.y);
    //i = 0;
}

requestAnimationFrame(update);

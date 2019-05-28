import '../scss/app.scss';

var helper = true;
var default_main_distance = {min:10, max:20};
var default_main_radius = {min:3, max:4};
var default_main_rotation = {min:0, max:1};
var default_sub_distance = {min:4, max:5};
var default_sub_radius = {min:2, max:2.5};
var default_sub_rotation = {min:0, max:1};
var default_sub_sub_distance = {min:2.6, max:3};
var default_sub_sub_radius = {min:0.1, max:0.5};
var default_sub_sub_rotation = {min:0, max:1};

var THREE = require('three');
var Stats = require('stats-js');
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

//js helper Stats
var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

function getRandomFloat(min, max){
    return Math.random() * (max - min) + min;
}

function createPointLightObject(colour='rgb(255, 255, 255)', intensity=1, distance=0, decay=2, coordinates={}){
    var light = new THREE.PointLight(colour, intensity, distance, decay);
    light.position.set(coordinates.x, coordinates.y, coordinates.z);
    light.castShadow = true;    
    return light;
}

function createSphereObject(shape, radius=1, widthSegment=50, heightSegment=50, colour='rgb(255,255,255)', x=Math.random(), y=Math.random(), z=Math.random()){
    var geometry;

    switch(shape)
    {
        case 'cube':
                geometry = new THREE.BoxGeometry(radius, widthSegment, heightSegment);
            break;
        case 'sphere':
                geometry = new THREE.SphereGeometry(radius, widthSegment, heightSegment);
            break;
        default:
                throw new Exception('Not yet implemented');
            break;
    }
    
     // BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshPhongMaterial({
        color: colour,
        shading: THREE.FlatShading,
    })
    var object = new THREE.Mesh( geometry, material );
    object.position.x = x;
    object.position.y = y;
    object.position.z = z;
    object.rotation.y = Math.random() * 2 * Math.PI;

    return object;
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
camera.position.z = -200;

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize( window.innerWidth, window.innerHeight );

if (helper){
    scene.add( new THREE.CameraHelper( camera ) );
}

//add ambient light
scene.add(new THREE.AmbientLight('rgb(255, 255, 255)', 0.5));



var light1 = createPointLightObject("rgb(255, 255, 255)", 0.5, 4000, 2, {x:5, y:0, z:0});
var light2 = createPointLightObject("rgb(255, 255, 255)", 0.5, 4000, 2, {x:-5, y:50, z:50});

if (helper){    
    scene.add( new THREE.PointLightHelper( light1, 1));
    scene.add( new THREE.PointLightHelper( light2, 1));
}
scene.add(light1, light2);




document.body.appendChild( renderer.domElement );

//var get_data = getData();

var controls = new TrackballControls( camera, renderer.domElement );
var t = 1;
function animate() {
    stats.begin();
    controls.update();
    t += 0.01;

    

    
    /*cube.rotation.x += getRandomFloat(0, 0.005);
    cube.rotation.y += getRandomFloat(0.001, 0.005);*/
    data.forEach(element => {

        element.object.rotation.y += element.rotation;

       /* var y = element.coordinates.y;
        //y += element.rotation;
        element.object.position.y = y+10*Math.sin(t) + 0;
        var x = element.coordinates.x;
        //x += element.rotation;
        element.object.position.x = x+10*Math.cos(t) + 0;
        var z = element.coordinates.z;
        //z += element.rotation;
        element.object.position.z = z+10*Math.sin(t) + 0;*/
    });


    renderer.render( scene, camera );
    requestAnimationFrame( animate );
    stats.end();
 
}
requestAnimationFrame( animate );


var data = getData();

data = structureData(data.data.entities);
console.log(data);
paintData(data);
animate();

function paintData(data){

    var colour = 'rgb('+getRandomFloat(0,255).toFixed(0)+','+getRandomFloat(0,255).toFixed(0)+','+getRandomFloat(0,255).toFixed(0)+')';


    data.forEach(element => {
        
        element.object = new createSphereObject('sphere', element.radius, 50, 50, colour, element.coordinates.x, element.coordinates.y, element.coordinates.z);
        scene.add(element.object);

        if(element.entities != undefined){
            element.entities = paintData(element.entities);
        }

    });

    return data;
}

function getDepthSizes(depth){

    var response={};

    switch(depth){
        case 1:
            response= {
                distance:default_main_distance,
                radius:default_main_radius,
                rotation:default_main_rotation
            }
            break;
        case 2:
            response= {
                distance:default_sub_distance,
                radius:default_sub_radius,
                rotation:default_sub_rotation
            }
            break;
        case 3:
            response= {
                distance:default_sub_sub_distance,
                radius:default_sub_sub_radius,
                rotation:default_sub_sub_rotation
            }
            break;
    }

    return response;

}

function structureData(data, depth=null, parent_size=null, parent_x=null, parent_y=null, parent_z=null){
    
    if (typeof depth == 'number')
        depth++;
    else
        depth = 1;

    var sizes = getDepthSizes(depth);
    
    data.forEach(element => {

        if (element.coordinates == undefined){
            element.coordinates= {};
        }

        element.coordinates.x = getRandomFloat(sizes.distance.min, sizes.distance.max) * ((Math.floor((Math.random() * 2) + 1) == 1) ? 1 : -1);
        element.coordinates.y = getRandomFloat(sizes.distance.min, sizes.distance.max) * ((Math.floor((Math.random() * 2) + 1) == 1) ? 1 : -1);
        element.coordinates.z = getRandomFloat(sizes.distance.min, sizes.distance.max) * ((Math.floor((Math.random() * 2) + 1) == 1) ? 1 : -1);

        if (typeof parent_x == 'number'){
            element.coordinates.x += parent_x;
        }
        if (typeof parent_y == 'number'){
            element.coordinates.y += parent_y;
        }
        if (typeof parent_z == 'number'){
            element.coordinates.z += parent_z;    
        }

        element.radius = getRandomFloat(sizes.radius.min, sizes.radius.max);
        element.rotation = getRandomFloat(sizes.rotation.min, sizes.rotation.max);

        if(element.entities != undefined){
            element.entities = structureData(element.entities, depth, element.radius, element.coordinates.x, 
                          element.coordinates.y, element.coordinates.z);
        }

    });

    return data;
}

function getData(){
    return {
        data: { 
            entities:[
                {
                    image:'',
                    name:'Test1',
                    entities:[
                        {
                            image:'',
                            name:'Sub1',
                            entities:[
                                {
                                    image:'',
                                    name:'SubSub1',
                                },
                                {
                                    image:'',
                                    name:'SubSub1',
                                }
                            ]
                        },
                        {
                            image:'',
                            name:'Sub2',
                            entities:[
        
                            ]
                        }
                    ]
                },
                {
                    image:'',
                    name:'Test2'
                },
                {
                    image:'',
                    name:'Test3'
                }
            ],

        }
    }
}
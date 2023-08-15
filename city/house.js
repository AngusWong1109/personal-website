var scene, camera, renderer, sun, moon;
var sunGeometry, sunContainer;
var moonGeometry, moonContainer;
var house;
var hori_roadLineGeometry, vert_roadLineGeometry;
var grass, vert_concrete, hori_concrete;
var grassWidth, grassLength;
var roadLightCylinderColor, roadLightBoxColor, roadLightCylinderGeometry;
var roadLightCylinder1, roadLightCylinder2, roadLightCylinder3, roadLightCylinder4;
var roadLightBox1, roadLightBox2, roadLightBox3, roadLightBox4;
var sunPosRadius = 120;
var sunPosAngle = 0;
var sunPosSpeed = 0.005;
var sunPosX = 0;
var sunPosY = 40;
var sunPosZ = 0;
var moonPosX = -sunPosX;
var moonPosY = -sunPosY;
var moonPosZ = sunPosZ;
var roadLineColor = new THREE.MeshPhongMaterial({color:0xFFFFFF});

var hori_goLeftCar = [];
var hori_goRightCar = [];
var vert_goForwardCar = [];
var vert_comeTowardCar = [];

var sunRotate = false;
var horiStreetLightGreen = false;
var vertStreetLightGreen = false;

var redLight1, yellowLight1, greenLight1;
var redLight2, yellowLight2, greenLight2;
var redLight3, yellowLight3, greenLight3;
var redLight4, yellowLight4, greenLight4;

var background;

window.onload = function init(){
    setEventListener();
    // Create a scene and camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 2000);

    background = new THREE.Mesh(
        new THREE.BoxGeometry(1000, 1000, 1000),
        new THREE.MeshBasicMaterial({color: 0x87CEE8, side:THREE.DoubleSide})
    )
    scene.add(background);

    //Sun Light
    sun = new THREE.PointLight(0xFDFBD3, 30000);
    sun.position.set(sunPosX, sunPosY, sunPosZ);
    sun.castShadow = true;
    
    sun.shadow.mapSize.width = 512;
    sun.shadow.mapSize.height = 512;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 2000;

    sunGeometry = new THREE.Mesh(
        new THREE.SphereGeometry(5, 32, 16),
        new THREE.MeshBasicMaterial({color: 0xFDFBD3})
    );
    sunGeometry.position.set(sunPosX, sunPosY, sunPosZ);

    sunContainer = new THREE.Object3D();
    sunContainer.add(sun, sunGeometry);
    scene.add(sunContainer);

    moon = new THREE.PointLight(0x000A40, 10000);
    
    moon.position.set(moonPosX, moonPosY, moonPosZ);
    moon.castShadow = true;

    moon.shadow.mapSize.width = 512;
    moon.shadow.mapSize.height = 512;
    moon.shadow.camera.near = 1;
    moon.shadow.camera.far = 2000;

    moonGeometry = new THREE.Mesh(
        new THREE.SphereGeometry(5, 32, 16),
        new THREE.MeshBasicMaterial({color: 0x91AB0})
    )
    moonGeometry.position.set(moonPosX, moonPosY, moonPosZ);

    moonContainer = new THREE.Object3D();
    moonContainer.add(moon, moonGeometry);
    scene.add(moonContainer);

    grassWidth = 200;
    grassLength = 200;

    //Grass
    grass = new THREE.Mesh(
        new THREE.BoxGeometry(grassWidth, 0.1, grassLength),
        new THREE.MeshPhongMaterial({color: 0x59A608})
    );
    grass.position.set(0, 0, 0);
    grass.receiveShadow = true;

    //Concrete Floor
    const concrete_color = new THREE.MeshPhongMaterial({color: 0x6B6B69});
    vert_concrete = new THREE.Mesh(
        new THREE.BoxGeometry(50, 0.2, grassLength),
        concrete_color
    );
    hori_concrete = new THREE.Mesh(
        new THREE.BoxGeometry(grassWidth, 0.2, 60),
        concrete_color
    );
    vert_concrete.position.set(-15, 0, 0);
    vert_concrete.receiveShadow = true;
    hori_concrete.position.set(0, 0, 10);
    hori_concrete.receiveShadow = true;
    scene.add(grass, vert_concrete, hori_concrete);
    
    //House
    houseBase = new THREE.Mesh(
        new THREE.BoxGeometry(40, 40, 40),
        new THREE.MeshPhongMaterial({color: 0xF2F2F2})
    );
    houseTop = new THREE.Mesh(
        new THREE.CylinderGeometry(5, 28, 15, 4, 1, false, 2.35),
        new THREE.MeshPhongMaterial({color: 0xA1662F})
    );
    houseTop.position.y = 27.5;
    var door = new THREE.Mesh(
        new THREE.BoxGeometry(10, 17, 2),
        new THREE.MeshPhongMaterial({color: 0xA1662F, side: THREE.DoubleSide})
    );
    door.position.y = -11;
    door.position.z = 20;
    var doorHandle = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, 3, 64),
        new THREE.MeshPhongMaterial({color:0x000000})
    );
    doorHandle.position.x = 3;
    doorHandle.position.y = -12;
    doorHandle.position.z = 20;
    doorHandle.rotation.x = Math.PI / 2;
    house = new THREE.Object3D();
    house.add(houseBase, houseTop, door, doorHandle);
    house.position.set(45, 20, -50);
    house.castShadow = true;
    house.receiveShadow = false;
    scene.add(house);

    //Traffic Light
    roadLightCylinderGeometry = new THREE.CylinderGeometry(1, 1, 20, 32);
    roadLightCylinderColor = new THREE.MeshPhongMaterial({color: 0xA8A7A4});
    roadLightBoxColor = new THREE.MeshPhongMaterial({color:0x0000FF});
    roadLightCylinder1 = new THREE.Mesh(
        roadLightCylinderGeometry,
        roadLightCylinderColor
    );
    roadLightBox1 = new THREE.Mesh(
        new THREE.BoxGeometry(5, 15, 4),
        roadLightBoxColor
    );
    roadLightCylinder2 = new THREE.Mesh(
        roadLightCylinderGeometry,
        roadLightCylinderColor
    );
    roadLightBox2 = new THREE.Mesh(
        new THREE.BoxGeometry(5, 15, 3),
        roadLightBoxColor
    )
    roadLightCylinder3 = new THREE.Mesh(
        roadLightCylinderGeometry,
        roadLightCylinderColor
    );
    roadLightBox3 = new THREE.Mesh(
        new THREE.BoxGeometry(3, 15, 5),
        roadLightBoxColor
    )
    roadLightCylinder4 = new THREE.Mesh(
        roadLightCylinderGeometry,
        roadLightCylinderColor
    );
    roadLightBox4 = new THREE.Mesh(
        new THREE.BoxGeometry(3, 15, 5),
        roadLightBoxColor
    )
    roadLightCylinder1.position.set(-45, 10, -25);
    roadLightBox1.position.set(-45, 20, -25);
    roadLightCylinder1.castShadow = true;
    roadLightCylinder1.receiveShadow = false;
    roadLightBox1.castShadow = true;
    roadLightBox1.receiveShadow = false;
    
    roadLightCylinder2.position.set(15, 10, 50);
    roadLightBox2.position.set(15, 20, 50);
    roadLightCylinder2.castShadow = true;
    roadLightCylinder2.receiveShadow = false;
    roadLightBox2.castShadow = true;
    roadLightBox2.receiveShadow = false;

    roadLightCylinder3.position.set(-45, 10, 50);
    roadLightBox3.position.set(-45, 20, 50);
    roadLightCylinder3.castShadow = true;
    roadLightCylinder3.receiveShadow = false;
    roadLightBox3.castShadow = true;
    roadLightBox3.receiveShadow = false;

    roadLightCylinder4.position.set(15, 10, -25);
    roadLightBox4.position.set(15, 20, -25);
    roadLightCylinder4.castShadow = true;
    roadLightCylinder4.receiveShadow = false;
    roadLightBox4.castShadow = true;
    roadLightBox4.receiveShadow = false;
    
    redLight1 = new THREE.PointLight(0xFF0000, 500, 10);
    redLight1.position.set(-45, 25, -30);
    yellowLight1 = new THREE.PointLight(0xE7B416, 0, 10);
    yellowLight1.position.set(-45, 20, -30);
    greenLight1 = new THREE.PointLight(0x008000, 0, 10);
    greenLight1.position.set(-45, 15, -30);

    redLight2 = new THREE.PointLight(0xFF0000, 500, 10);
    redLight2.position.set(15, 25, 55);
    yellowLight2 = new THREE.PointLight(0xE7B416, 0, 10);
    yellowLight2.position.set(15, 20, 55);
    greenLight2 = new THREE.PointLight(0x008000, 0, 10);
    greenLight2.position.set(15, 15, 55);

    redLight3 = new THREE.PointLight(0xFF0000, 500, 10);
    redLight3.position.set(-50, 25, 50);
    yellowLight3 = new THREE.PointLight(0xE7B416, 0, 10);
    yellowLight3.position.set(-50, 20, 50);
    greenLight3 = new THREE.PointLight(0x008000, 0, 10);
    greenLight3.position.set(-50, 15, 50);

    redLight4 = new THREE.PointLight(0xFF0000, 500, 10);
    redLight4.position.set(20, 25, -25);
    yellowLight4 = new THREE.PointLight(0xE7B416, 0, 10);
    yellowLight4.position.set(20, 20, -25);
    greenLight4 = new THREE.PointLight(0x008000, 0, 10);
    greenLight4.position.set(20, 15, -25);

    scene.add(redLight1, yellowLight1, greenLight1);
    scene.add(redLight2, yellowLight2, greenLight2);
    scene.add(redLight3, yellowLight3, greenLight3);
    scene.add(redLight4, yellowLight4, greenLight4);
    scene.add(roadLightCylinder1, roadLightBox1);
    scene.add(roadLightCylinder2, roadLightBox2);
    scene.add(roadLightCylinder3, roadLightBox3);
    scene.add(roadLightCylinder4, roadLightBox4);

    //Road Line
    createHoriRoadLine(-90, 0.1, 13);
    createHoriRoadLine(-75, 0.1, 13);
    createHoriRoadLine(-60, 0.1, 13);
    createHoriRoadLine(-45, 0.1, 13);
    createHoriRoadLine(15, 0.1, 13);
    createHoriRoadLine(30, 0.1, 13);
    createHoriRoadLine(45, 0.1, 13);
    createHoriRoadLine(60, 0.1, 13);
    createHoriRoadLine(75, 0.1, 13);
    createHoriRoadLine(90, 0.1, 13);

    createVertRoadLine(-15, 0.1, 90);
    createVertRoadLine(-15, 0.1, 75);
    createVertRoadLine(-15, 0.1, 60);
    createVertRoadLine(-15, 0.1, 45);
    createVertRoadLine(-15, 0.1, -15);
    createVertRoadLine(-15, 0.1, -30);
    createVertRoadLine(-15, 0.1, -45);
    createVertRoadLine(-15, 0.1, -60);
    createVertRoadLine(-15, 0.1, -75);
    createVertRoadLine(-15, 0.1, -90);

    //Car
    createHoriGoLeftCar(25 ,0 ,-5, 0xAF00FF);
    createHoriGoRightCar(-50, 0, 25, 0xFFFFFF);
    createVertComeTowardCar(30, 0, -27, 0xAFF2FD);
    createVertGoForwardCar(-2, 0, -65, 0xAD253F);

    //Camera
    camera.position.set(0, 80, 300);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    //Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(1280, 720);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    render();
}

function render(){
    if(sunRotate){
        if(sunPosY < -20){
            sun.intensity = 0;
            moon.intensity = 80000;
            background.material = new THREE.MeshBasicMaterial({color: 0x070058, side:THREE.DoubleSide})
            carLightOn(true);
        }
        else if(sunPosY > -20){
            sun.intensity = 30000;
            moon.intensity = 0;
            background.material = new THREE.MeshBasicMaterial({color: 0x87CEE8, side:THREE.DoubleSide})
            carLightOn(false);
        }
        sunPosAngle += sunPosSpeed;
        sunPosX = sunPosRadius * Math.cos(sunPosAngle);
        sunPosY = sunPosRadius * Math.sin(sunPosAngle);
    }
    sunContainer.position.set(sunPosX, sunPosY, sunPosZ);
    moonContainer.position.set(-sunPosX, -sunPosY, sunPosZ);

    if(horiStreetLightGreen){
        changeHoriLight();
        moveHoriCar();
    }
    if(vertStreetLightGreen){
        changeVertLight();
        moveVertCar();
    }
    window.requestAnimationFrame(render);
    renderer.render(scene, camera);
}

function createHoriRoadLine(x, y, z){
    hori_roadLineGeometry = new THREE.BoxGeometry(10, 0.2, 2);
    var hori_roadLine = new THREE.Mesh(hori_roadLineGeometry, roadLineColor);
    hori_roadLine.position.set(x, y, z);
    hori_roadLine.castShadow = true;
    hori_roadLine.receiveShadow = false;
    scene.add(hori_roadLine)
}

function createVertRoadLine(x, y, z){
    vert_roadLineGeometry = new THREE.BoxGeometry(2, 0.2, 10);
    var vert_roadLine = new THREE.Mesh(vert_roadLineGeometry, roadLineColor);
    vert_roadLine.position.set(x, y, z);
    vert_roadLine.castShadow = true;
    vert_roadLine.receiveShadow = false;
    scene.add(vert_roadLine)
}

function setEventListener(){
    window.addEventListener("keydown", getKey, false);
    window.addEventListener("wheel", getScroll, false);
}

var cameraRadius = 35, cameraHoriAngle = 0, cameraVertAngle = 0;

function getKey(event){
    var key = event.key;
    if(key == "s"){
        if(sunRotate == true){
            sunRotate = false;
        }
        else{
            sunRotate = true;
        }
    }
    if(key == "v"){
        horiStreetLightGreen = false;
        vertStreetLightGreen = true;
    }
    if(key == "h"){
        horiStreetLightGreen = true;
        vertStreetLightGreen = false;
    }
    if(key == "ArrowUp"){
        console.log("You have pressed up arrow");
        cameraVertAngle -= 0.1;
        camera.position.y += cameraRadius * Math.cos(cameraVertAngle);
        camera.position.z += cameraRadius * Math.sin(cameraVertAngle);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
    if(key == "ArrowDown"){
        console.log("You have pressed down arrow");
        cameraVertAngle += 0.1;
        camera.position.y -= cameraRadius * Math.cos(cameraVertAngle);
        camera.position.z -= cameraRadius * Math.sin(cameraVertAngle);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
    if(key == "ArrowLeft"){
        console.log("You have pressed left arrow");
        cameraHoriAngle += 0.1;
        camera.position.x -= cameraRadius * Math.cos(cameraHoriAngle);
        camera.position.z -= cameraRadius * Math.sin(cameraHoriAngle);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
    if(key == "ArrowRight"){
        console.log("You have pressed right arrow");
        cameraHoriAngle -= 0.1;
        camera.position.x += cameraRadius * Math.cos(cameraHoriAngle);
        camera.position.z += cameraRadius * Math.sin(cameraHoriAngle);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
}

function getScroll(event){
    scroll = event.deltaY;
    console.log("scrolled");
    if(scroll > 0){
        camera.position.y -= 0.5;
        camera.position.z -= 1;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
    if(scroll < 0){
        camera.position.y += 0.5;
        camera.position.z += 1;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
}

function createHoriGoLeftCar(x, y, z, color){
    var carBodyMaterial = new THREE.MeshPhongMaterial({ color: color });
    var carLowerBodyGeometry = new THREE.BoxGeometry(25, 8, 20);
    var carLowerBody = new THREE.Mesh(carLowerBodyGeometry, carBodyMaterial);
    var carUpperBodyGeomeetry = new THREE.CylinderGeometry(5, 12, 5, 4, 1, false, 2.35);
    var carUpperBody = new THREE.Mesh(carUpperBodyGeomeetry, carBodyMaterial);
    carLowerBody.position.y = 5;
    carUpperBody.position.z = -0.5;
    carUpperBody.position.y = 11.5;
    var carBody = new THREE.Object3D();
    carBody.add(carLowerBody, carUpperBody);
    carBody.position.set(x, y, z);

    // Create the car wheels
    var wheelRadius = 2;
    var wheelGeometry = new THREE.CylinderGeometry(wheelRadius, wheelRadius, 2, 32);
    var wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

    var frontLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    frontLeftWheel.position.set(x-9, y+wheelRadius+0.1, z + 10);
    frontLeftWheel.rotation.x = Math.PI / 2;

    var frontRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    frontRightWheel.position.set(x - 9, y+wheelRadius+0.1, z - 10);
    frontRightWheel.rotation.x = Math.PI / 2;

    var rearLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    rearLeftWheel.position.set(x + 9, y+wheelRadius+0.1, z + 10);
    rearLeftWheel.rotation.x = Math.PI / 2;

    var rearRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    rearRightWheel.position.set(x + 9, y+wheelRadius+0.1, z - 10);
    rearRightWheel.rotation.x = Math.PI / 2;

    var carLight1 = new THREE.PointLight(0xEEDD82, 0);
    var carLight2 = new THREE.PointLight(0xEEDD82, 0);
    carLight1.castShadow = true;
    carLight2.castShadow = true;
    carLight1.position.set(x-15, y+5, z-5);
    carLight2.position.set(x-15, y+5, z+5);

    var car = new THREE.Object3D();
    car.add(carBody, frontLeftWheel, frontRightWheel, rearLeftWheel, rearRightWheel, carLight1, carLight2);
    car.castShadow = true;
    car.receiveShadow = false;
    scene.add(car);
    
    hori_goLeftCar.push(car);
}
function createHoriGoRightCar(x, y, z, color){
    var carBodyMaterial = new THREE.MeshPhongMaterial({ color: color });
    var carLowerBodyGeometry = new THREE.BoxGeometry(25, 8, 20);
    var carLowerBody = new THREE.Mesh(carLowerBodyGeometry, carBodyMaterial);
    var carUpperBodyGeomeetry = new THREE.CylinderGeometry(5, 12, 5, 4, 1, false, 2.35);
    var carUpperBody = new THREE.Mesh(carUpperBodyGeomeetry, carBodyMaterial);
    carLowerBody.position.y = 5;
    carUpperBody.position.z = -0.5;
    carUpperBody.position.y = 11.5;
    var carBody = new THREE.Object3D();
    carBody.add(carLowerBody, carUpperBody);
    carBody.position.set(x, y, z);

    // Create the car wheels
    var wheelRadius = 2;
    var wheelGeometry = new THREE.CylinderGeometry(wheelRadius, wheelRadius, 2, 32);
    var wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

    var frontLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    frontLeftWheel.position.set(x-9, y+wheelRadius+0.1, z + 10);
    frontLeftWheel.rotation.x = Math.PI / 2;

    var frontRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    frontRightWheel.position.set(x - 9, y+wheelRadius+0.1, z - 10);
    frontRightWheel.rotation.x = Math.PI / 2;

    var rearLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    rearLeftWheel.position.set(x + 9, y+wheelRadius+0.1, z + 10);
    rearLeftWheel.rotation.x = Math.PI / 2;

    var rearRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    rearRightWheel.position.set(x + 9, y+wheelRadius+0.1, z - 10);
    rearRightWheel.rotation.x = Math.PI / 2;

    var carLight1 = new THREE.PointLight(0xEEDD82, 0);
    var carLight2 = new THREE.PointLight(0xEEDD82, 0);
    carLight1.castShadow = true;
    carLight2.castShadow = true;
    carLight1.position.set(x+15, y+5, z-5);
    carLight2.position.set(x+15, y+5, z+5);

    var car = new THREE.Object3D();
    car.add(carBody, frontLeftWheel, frontRightWheel, rearLeftWheel, rearRightWheel, carLight1, carLight2);
    car.castShadow = true;
    car.receiveShadow = false;
    scene.add(car);
    
    hori_goRightCar.push(car);
}

function createVertGoForwardCar(z, y, x, color){
    var carBodyMaterial = new THREE.MeshPhongMaterial({ color: color });
    var carLowerBodyGeometry = new THREE.BoxGeometry(25, 8, 20);
    var carLowerBody = new THREE.Mesh(carLowerBodyGeometry, carBodyMaterial);
    var carUpperBodyGeomeetry = new THREE.CylinderGeometry(5, 12, 5, 4, 1, false, 2.35);
    var carUpperBody = new THREE.Mesh(carUpperBodyGeomeetry, carBodyMaterial);
    carLowerBody.position.y = 5;
    carUpperBody.position.z = -0.5;
    carUpperBody.position.y = 11.5;
    var carBody = new THREE.Object3D();
    carBody.add(carLowerBody, carUpperBody);
    carBody.position.set(x, y, z);

    // Create the car wheels
    var wheelRadius = 2;
    var wheelGeometry = new THREE.CylinderGeometry(wheelRadius, wheelRadius, 2, 32);
    var wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

    var frontLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    frontLeftWheel.position.set(x-9, y+wheelRadius+0.1, z + 10);
    frontLeftWheel.rotation.x = Math.PI / 2;

    var frontRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    frontRightWheel.position.set(x - 9, y+wheelRadius+0.1, z - 10);
    frontRightWheel.rotation.x = Math.PI / 2;

    var rearLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    rearLeftWheel.position.set(x + 9, y+wheelRadius+0.1, z + 10);
    rearLeftWheel.rotation.x = Math.PI / 2;

    var rearRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    rearRightWheel.position.set(x + 9, y+wheelRadius+0.1, z - 10);
    rearRightWheel.rotation.x = Math.PI / 2;

    var carLight1 = new THREE.PointLight(0xEEDD82, 0);
    var carLight2 = new THREE.PointLight(0xEEDD82, 0);
    carLight1.castShadow = true;
    carLight2.castShadow = true;
    carLight1.position.set(x+15, y+5, z-5);
    carLight2.position.set(x+15, y+5, z+5);

    var car = new THREE.Object3D();
    car.add(carBody, frontLeftWheel, frontRightWheel, rearLeftWheel, rearRightWheel, carLight1, carLight2);
    car.rotation.y = Math.PI/2;
    car.castShadow = true;
    car.receiveShadow = false;
    scene.add(car);

    vert_goForwardCar.push(car);
}

function createVertComeTowardCar(x, y, z, color){
    var carBodyMaterial = new THREE.MeshPhongMaterial({ color: color });
    var carLowerBodyGeometry = new THREE.BoxGeometry(25, 8, 20);
    var carLowerBody = new THREE.Mesh(carLowerBodyGeometry, carBodyMaterial);
    var carUpperBodyGeomeetry = new THREE.CylinderGeometry(5, 12, 5, 4, 1, false, 2.35);
    var carUpperBody = new THREE.Mesh(carUpperBodyGeomeetry, carBodyMaterial);
    carLowerBody.position.y = 5;
    carUpperBody.position.z = -0.5;
    carUpperBody.position.y = 11.5;
    var carBody = new THREE.Object3D();
    carBody.add(carLowerBody, carUpperBody);
    carBody.position.set(x, y, z);

    // Create the car wheels
    var wheelRadius = 2;
    var wheelGeometry = new THREE.CylinderGeometry(wheelRadius, wheelRadius, 2, 32);
    var wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

    var frontLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    frontLeftWheel.position.set(x-9, y+wheelRadius+0.1, z + 10);
    frontLeftWheel.rotation.x = Math.PI / 2;

    var frontRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    frontRightWheel.position.set(x - 9, y+wheelRadius+0.1, z - 10);
    frontRightWheel.rotation.x = Math.PI / 2;

    var rearLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    rearLeftWheel.position.set(x + 9, y+wheelRadius+0.1, z + 10);
    rearLeftWheel.rotation.x = Math.PI / 2;

    var rearRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    rearRightWheel.position.set(x + 9, y+wheelRadius+0.1, z - 10);
    rearRightWheel.rotation.x = Math.PI / 2;

    var carLight1 = new THREE.PointLight(0xEEDD82, 0);
    var carLight2 = new THREE.PointLight(0xEEDD82, 0);
    carLight1.castShadow = true;
    carLight2.castShadow = true;
    carLight1.position.set(x-15, y+5, z-5);
    carLight2.position.set(x-15, y+5, z+5);

    var car = new THREE.Object3D();
    car.add(carBody, frontLeftWheel, frontRightWheel, rearLeftWheel, rearRightWheel, carLight1, carLight2);
    car.rotation.y = Math.PI/2;
    car.castShadow = true;
    car.receiveShadow = false;
    scene.add(car);

    vert_comeTowardCar.push(car);
}

var vertLightRed = true, horiLightRed = true;
function moveHoriCar(){
    while(!vertLightRed){}
    for(var i = 0; i < hori_goLeftCar.length; i++){
        if(hori_goLeftCar[i].position.x < -120){
            hori_goLeftCar[i].position.x = 120;
        }
        hori_goLeftCar[i].position.x += -1;
    }
    for(var i = 0; i < hori_goRightCar.length; i++){
        if(hori_goRightCar[i].position.x > 120){
            hori_goRightCar[i].position.x = -120;
        }
        hori_goRightCar[i].position.x += 1;
    }
}

function moveVertCar(){
    while(!horiLightRed){}
    for(var i=0; i < vert_goForwardCar.length; i++){
        if(vert_goForwardCar[i].position.z < -120){
            vert_goForwardCar[i].position.z = 120;
        }
        vert_goForwardCar[i].position.z += -1;
    }
    for(var i=0; i < vert_comeTowardCar.length; i++){
        if(vert_comeTowardCar[i].position.z > 120){
            vert_comeTowardCar[i].position.z = -120;
        }
        vert_comeTowardCar[i].position.z += 1;
    }
}

//500 500 800
function changeHoriLight(){
    if(!vertLightRed){
        //Traffic Started
        greenLight1.intensity = 0;
        greenLight2.intensity = 0;
        yellowLight1.intensity = 500;
        yellowLight2.intensity = 500;
        yellowLight1.intensity = 0;
        yellowLight2.intensity = 0;
        redLight1.intensity = 500;
        redLight2.intensity = 500;
        vertLightRed = true;
        yellowLight3.intensity = 500;
        yellowLight4.intensity = 500;
        redLight3.intensity = 0;
        redLight4.intensity = 0;
        horiLightRed = false;
        yellowLight3.intensity = 0;
        yellowLight4.intensity = 0;
        greenLight3.intensity = 800;
        greenLight4.intensity = 800;
    }
    else if(vertLightRed){
        yellowLight3.intensity = 500;
        yellowLight4.intensity = 500;
        redLight3.intensity = 0;
        redLight4.intensity = 0;
        horiLightRed = false;
        yellowLight3.intensity = 0;
        yellowLight4.intensity = 0;
        greenLight3.intensity = 800;
        greenLight4.intensity = 800;
    }
}

function changeVertLight(){
    if(!horiLightRed){
        //Traffic Started
        greenLight3.intensity = 0;
        greenLight4.intensity = 0;
        yellowLight3.intensity = 500;
        yellowLight4.intensity = 500;
        yellowLight3.intensity = 0;
        yellowLight4.intensity = 0;
        redLight3.intensity = 500;
        redLight4.intensity = 500;
        horiLightRed = true;
        yellowLight1.intensity = 500;
        yellowLight2.intensity = 500;
        redLight1.intensity = 0;
        redLight2.intensity = 0;
        vertLightRed = false;
        yellowLight1.intensity = 0;
        yellowLight2.intensity = 0;
        greenLight1.intensity = 800;
        greenLight2.intensity = 800;
    }
    else if(horiLightRed){
        yellowLight1.intensity = 500;
        yellowLight2.intensity = 500;
        redLight1.intensity = 0;
        redLight2.intensity = 0;
        vertLightRed = false;
        yellowLight1.intensity = 0;
        yellowLight2.intensity = 0;
        greenLight1.intensity = 800;
        greenLight2.intensity = 800;
    }
}

function carLightOn(x){
    for(var i = 0; i < hori_goLeftCar.length; i++){
        var car = hori_goLeftCar[i];
        if(x){
            car.children[5].intensity = 100;
            car.children[6].intensity = 100;
        }
        else{
            car.children[5].intensity = 0;
            car.children[6].intensity = 0;
        }
    }
    for(var i = 0; i < hori_goRightCar.length; i++){
        var car = hori_goRightCar[i];
        if(x){
            car.children[5].intensity = 100;
            car.children[6].intensity = 100;
        }
        else{
            car.children[5].intensity = 0;
            car.children[6].intensity = 0;
        }
    }
    for(var i = 0; i < vert_goForwardCar.length; i++){
        var car = vert_goForwardCar[i];
        if(x){
            car.children[5].intensity = 100;
            car.children[6].intensity = 100;
        }
        else{
            car.children[5].intensity = 0;
            car.children[6].intensity = 0;
        }
    }
    for(var i = 0; i < vert_comeTowardCar.length; i++){
        var car = vert_comeTowardCar[i];
        if(x){
            car.children[5].intensity = 100;
            car.children[6].intensity = 100;
        }
        else{
            car.children[5].intensity = 0;
            car.children[6].intensity = 0;
        }
    }
}
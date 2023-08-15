///////////////////////////////
//Graphics Part
///////////////////////////////
var gl;
var canvas;

var program;
var x = 0.0;
var y = 0.0;
var vBuffer;
var cBuffer;
var playerBuffer;
var playerColorBuffer;
var ghostBuffer;
var ghostColorBuffer;
var treatBuffer;
var treatColorBuffer;
var vPosition;
var vColor;
var treatLoc;
var dashedLoc;
const numSegments = 360;

const row = 10;
const col = 9;

var vertices=[
    vec2(  0.9, 0.9),
	vec2( -0.9, 0.9),
	vec2( -0.9,-0.9),
    vec2(  0.9, 0.9),
    vec2( -0.9,-0.9),
    vec2(  0.9,-0.9),

    vec2( -0.1, 0.7),
    vec2( -0.7, 0.7),
    vec2( -0.7, 0.4),
    vec2( -0.1, 0.7),
    vec2( -0.7, 0.4),
    vec2( -0.1, 0.4),

    vec2(  0.7, 0.7),
    vec2(  0.1, 0.7),
    vec2(  0.1, 0.4),
    vec2(  0.7, 0.7),
    vec2(  0.1, 0.4),
    vec2(  0.7, 0.4),

    vec2( -0.5, 0.2),
    vec2( -0.7, 0.2),
    vec2( -0.7,-0.2),
    vec2( -0.5, 0.2),
    vec2( -0.7,-0.2),
    vec2( -0.5,-0.2),

    vec2(  0.7, 0.2),
    vec2(  0.5, 0.2),
    vec2(  0.5,-0.2),
    vec2(  0.7, 0.2),
    vec2(  0.5,-0.2),
    vec2(  0.7,-0.2),

    vec2( -0.1,-0.4),
    vec2( -0.7,-0.4),
    vec2( -0.7,-0.7),
    vec2( -0.1,-0.4),
    vec2( -0.7,-0.7),
    vec2( -0.1,-0.7),

    vec2(  0.7,-0.4),
    vec2(  0.1,-0.4),
    vec2(  0.1,-0.7),
    vec2(  0.7,-0.4),
    vec2(  0.1,-0.7),
    vec2(  0.7,-0.7),

    vec2( -0.1, 0.2),
    vec2( -0.1,-0.2),
    vec2(  0.1,-0.2),
    vec2(  0.1, 0.2),
    vec2( -0.1, 0.2)
];

var colors=[
    vec3(0.828125, 0.828125, 0.828125),
    vec3(0.828125, 0.828125, 0.828125),
    vec3(0.828125, 0.828125, 0.828125),
    vec3(0.828125, 0.828125, 0.828125),
    vec3(0.828125, 0.828125, 0.828125),
    vec3(0.828125, 0.828125, 0.828125),
    
    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),
    
    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),

    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),

    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),

    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),

    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),
    vec3(0.28235294, 0.54117647, 0.20392157),
    
    vec3(0.25098039, 0.2745098, 0.56078431),
    vec3(0.25098039, 0.2745098, 0.56078431),
    vec3(0.25098039, 0.2745098, 0.56078431),
    vec3(0.25098039, 0.2745098, 0.56078431),
    vec3(0.25098039, 0.2745098, 0.56078431)
];

var playerPos = [];

var playerColor = [
    vec3(0.17647059, 0.22745098, 0.6),
    vec3(0.17647059, 0.22745098, 0.6),
    vec3(0.17647059, 0.22745098, 0.6)
];

var ghostPos = [];

var ghost_colors = [
    vec3(0.83529412, 0.34901961, 0.3254902),
    vec3(0.83529412, 0.34901961, 0.3254902),
    vec3(0.83529412, 0.34901961, 0.3254902),
    vec3(0.83529412, 0.34901961, 0.3254902),
    vec3(0.83529412, 0.34901961, 0.3254902),
    vec3(0.83529412, 0.34901961, 0.3254902),

    vec3(0.44313725, 0.78823529, 0.80392157),
    vec3(0.44313725, 0.78823529, 0.80392157),
    vec3(0.44313725, 0.78823529, 0.80392157),
    vec3(0.44313725, 0.78823529, 0.80392157),
    vec3(0.44313725, 0.78823529, 0.80392157),
    vec3(0.44313725, 0.78823529, 0.80392157)
];

var treatPos = [];
var treat_colors = [];

window.onload = function init(){
    setUpMaze();
    canvas = document.getElementById("gl-canvas");

    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = pixelRatio * canvas.clientWidth;
    canvas.height = pixelRatio * canvas.clientHeight;

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl){
        alert("WebGL isn't available");
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.453125, 0.453125, 0.453125, 1);
    gl.lineWidth(1.0);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    
    vPosition = gl.getAttribLocation( program, "vPosition");
    vColor = gl.getAttribLocation( program, "color");
    dashedLoc = gl.getUniformLocation(program, 'dashed');
    thetaLoc = gl.getUniformLocation(program, "theta");
    treatLoc = gl.getUniformLocation(program, "treat");

    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition );

    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor );

    createPlayerBuffer();
    createGhostBuffer();
    createTreatBuffer();

    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    updatePlayerPosition();
    updateGhostPosition();
    updateTreatPosition();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition );
    
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor );
    drawBackground();

    gl.bindBuffer(gl.ARRAY_BUFFER, treatBuffer);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition );

    gl.bindBuffer(gl.ARRAY_BUFFER, treatColorBuffer);
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
    drawTreats();

    gl.bindBuffer(gl.ARRAY_BUFFER, playerBuffer);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition );

    gl.bindBuffer(gl.ARRAY_BUFFER, playerColorBuffer);
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
    drawUser();

    gl.bindBuffer(gl.ARRAY_BUFFER, ghostBuffer);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition );

    gl.bindBuffer(gl.ARRAY_BUFFER, ghostColorBuffer);
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
    drawGhosts();

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    window.requestAnimationFrame(render);
}

function createPlayerBuffer(){
    var mazeX = player.maze_x;
    var mazeY = player.maze_y;
    var coord = map[mazeX][mazeY];
    var coordx = coord.x;
    var coordy = coord.y;
    playerPos.push(vec2(coordx, coordy + 0.05));
    playerPos.push(vec2(coordx - 0.04, coordy - 0.03));
    playerPos.push(vec2(coordx + 0.04, coordy - 0.03));

    playerBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, playerBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(playerPos), gl.DYNAMIC_DRAW);

    playerColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, playerColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(playerColor), gl.STATIC_DRAW);
}

function updatePlayerPosition(){
    var newPosition = [];
    var mazeX = player.maze_x;
    var mazeY = player.maze_y;
    var coord = map[mazeX][mazeY];
    var coordx = coord.x;
    var coordy = coord.y;

    newPosition.push(vec2(coordx, coordy + 0.05));
    newPosition.push(vec2(coordx - 0.04, coordy - 0.03));
    newPosition.push(vec2(coordx + 0.04, coordy - 0.03));

    gl.bindBuffer(gl.ARRAY_BUFFER, playerBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(newPosition));
}

function createGhostBuffer(){
    var ghost1x = ghost1.maze_x;
    var ghost1y = ghost1.maze_y;
    var ghost1Coord = map[ghost1x][ghost1y];
    var ghost1Coordx = ghost1Coord.x;
    var ghost1Coordy = ghost1Coord.y;
    var ghost2x = ghost2.maze_x;
    var ghost2y = ghost2.maze_y;
    var ghost2Coord = map[ghost2x][ghost2y];
    var ghost2Coordx = ghost2Coord.x;
    var ghost2Coordy = ghost2Coord.y;

    ghostPos.push(vec2(ghost1Coordx + 0.05, ghost1Coordy + 0.05));
    ghostPos.push(vec2(ghost1Coordx - 0.05, ghost1Coordy + 0.05));
    ghostPos.push(vec2(ghost1Coordx - 0.05, ghost1Coordy - 0.05));
    ghostPos.push(vec2(ghost1Coordx + 0.05, ghost1Coordy + 0.05));
    ghostPos.push(vec2(ghost1Coordx - 0.05, ghost1Coordy - 0.05));
    ghostPos.push(vec2(ghost1Coordx + 0.05, ghost1Coordy - 0.05));

    ghostPos.push(vec2(ghost2Coordx + 0.05, ghost2Coordy + 0.05));
    ghostPos.push(vec2(ghost2Coordx - 0.05, ghost2Coordy + 0.05));
    ghostPos.push(vec2(ghost2Coordx - 0.05, ghost2Coordy - 0.05));
    ghostPos.push(vec2(ghost2Coordx + 0.05, ghost2Coordy + 0.05));
    ghostPos.push(vec2(ghost2Coordx - 0.05, ghost2Coordy - 0.05));
    ghostPos.push(vec2(ghost2Coordx + 0.05, ghost2Coordy - 0.05));

    ghostBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ghostBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(ghostPos), gl.DYNAMIC_DRAW);

    ghostColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ghostColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(ghost_colors), gl.STATIC_DRAW);
}

function updateGhostPosition(){
    var newGhostPosition = [];

    var ghost1x = ghost1.maze_x;
    var ghost1y = ghost1.maze_y;
    var ghost1Coord = map[ghost1x][ghost1y];
    var ghost1Coordx = ghost1Coord.x;
    var ghost1Coordy = ghost1Coord.y;
    var ghost2x = ghost2.maze_x;
    var ghost2y = ghost2.maze_y;
    var ghost2Coord = map[ghost2x][ghost2y];
    var ghost2Coordx = ghost2Coord.x;
    var ghost2Coordy = ghost2Coord.y;

    newGhostPosition.push(vec2(ghost1Coordx + 0.05, ghost1Coordy + 0.05));
    newGhostPosition.push(vec2(ghost1Coordx - 0.05, ghost1Coordy + 0.05));
    newGhostPosition.push(vec2(ghost1Coordx - 0.05, ghost1Coordy - 0.05));
    newGhostPosition.push(vec2(ghost1Coordx + 0.05, ghost1Coordy + 0.05));
    newGhostPosition.push(vec2(ghost1Coordx - 0.05, ghost1Coordy - 0.05));
    newGhostPosition.push(vec2(ghost1Coordx + 0.05, ghost1Coordy - 0.05));

    newGhostPosition.push(vec2(ghost2Coordx - 0.05, ghost2Coordy + 0.05));
    newGhostPosition.push(vec2(ghost2Coordx + 0.05, ghost2Coordy + 0.05));
    newGhostPosition.push(vec2(ghost2Coordx - 0.05, ghost2Coordy - 0.05));
    newGhostPosition.push(vec2(ghost2Coordx + 0.05, ghost2Coordy + 0.05));
    newGhostPosition.push(vec2(ghost2Coordx - 0.05, ghost2Coordy - 0.05));
    newGhostPosition.push(vec2(ghost2Coordx + 0.05, ghost2Coordy - 0.05));

    gl.bindBuffer(gl.ARRAY_BUFFER, ghostBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(newGhostPosition));
}

function createTreatBuffer(){
    
    for(var i = 0; i < row; i++){
        for(var j = 0; j < col; j++){
            if(map[i][j].hasTreat){
                treatPos.push(vec2(map[i][j].x, map[i][j].y));
                for(var k = 0; k < numSegments-1; k++){
                    var theta = (k / numSegments) * 2 * Math.PI;
                    var x = Math.cos(theta) * 0.02 + map[i][j].x;
                    var y = Math.sin(theta) * 0.02 + map[i][j].y;
                    treatPos.push(vec2(x, y));
                    treat_colors.push(vec3(0.62745098, 0.5372549, 0.21176471));
                }
            }
        }
    }
    
    treatBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, treatBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(treatPos), gl.DYNAMIC_DRAW);

    treatColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, treatColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(treat_colors), gl.DYNAMIC_DRAW);
}

function updateTreatPosition(){
    treatPos = [];
    treat_colors = [];
    for(var i = 0; i < row; i++){
        for(var j = 0; j < col; j++){
            if(map[i][j].hasTreat){
                treatPos.push(vec2(map[i][j].x, map[i][j].y));
                for(var k = 0; k < numSegments-1; k++){
                    var theta = (k / numSegments) * 2.0 * Math.PI;
                    var x = Math.cos(theta) * 0.02 + map[i][j].x;
                    var y = Math.sin(theta) * 0.02 + map[i][j].y;
                    treatPos.push(vec2(x, y));
                    treat_colors.push(vec3(0.62745098, 0.5372549, 0.21176471));
                }
            }
        }
    }


    gl.bindBuffer(gl.ARRAY_BUFFER, treatBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(treatPos));

    gl.bindBuffer(gl.ARRAY_BUFFER, treatColorBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(treat_colors));
}

function drawBackground(){
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.drawArrays(gl.TRIANGLES, 6, 6);
    gl.drawArrays(gl.TRIANGLES,12, 6);
    gl.drawArrays(gl.TRIANGLES,18, 6);
    gl.drawArrays(gl.TRIANGLES,24, 6);
    gl.drawArrays(gl.TRIANGLES,30, 6);
    gl.drawArrays(gl.TRIANGLES,36, 6);
    
    gl.uniform1i(dashedLoc, true);
    gl.drawArrays(gl.LINE_STRIP, 42, 5);
    gl.uniform1i(dashedLoc, false);
}

function drawUser(){
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function drawGhosts(){
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.drawArrays(gl.TRIANGLES, 6, 6);
}

function drawTreats(){
    for(var i = 0; i < treatPos.length; i+=numSegments){
        gl.drawArrays(gl.TRIANGLE_FAN, i, numSegments);   
    }
}

///////////////////////////////
//Logic Part
///////////////////////////////
let map = [];
var time;
var score;
var timerInterval;
const UP = 1;
const LEFT = 2;
const DOWN = 3;
const RIGHT = 4;
var gameStarted = false;
var gameOver;
var ghost1;
var ghost2;
var player;
var numOfTreat;

class Position{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.isGhost = false;
        this.isObstacle = false;
        this.isPlayer = false;
        this.hasTreat = true;
        this.isCentre = false;
    }
}

class Maze{
    constructor(){
        let height = 0.8;
        for(var i = 0; i < row; i++){
            let width = -0.8;
            map[i] = []
            for(var j = 0; j < col; j++){
                map[i][j] = new Position(width, height);
                width += 0.2;
            }
            if(i == 1 || i == 7){
                height -= 0.1;
            }
            else{
                height -= 0.2;
            }
        }
    }
}

class Ghost{
    constructor(maze_x, maze_y){
        this.maze_x = maze_x;
        this.maze_y = maze_y;
        this.last_move = 0;
    }
    makeMove(){
        var move;
        do{
            move = Math.floor(Math.random() * 4) + 1;
            if(move === UP){
                x = this.maze_x - 1;
                y = this.maze_y;
            }
            else if(move === DOWN){
                x = this.maze_x + 1;
                y = this.maze_y;
            }
            else if(move === LEFT){
                x = this.maze_x;
                y = this.maze_y - 1;
            }
            else{
                x = this.maze_x;
                y = this.maze_y + 1;
            }
        } while(!this.validMove(x, y, move));

        switch(move){
            case UP:
                map[this.maze_x][this.maze_y].isGhost = false;
                this.maze_x -= 1;
                map[this.maze_x][this.maze_y].isGhost = true;
                this.last_move = UP;
                break;
            
            case DOWN:
                map[this.maze_x][this.maze_y].isGhost = false;
                this.maze_x += 1;
                map[this.maze_x][this.maze_y].isGhost = true;
                this.last_move = DOWN;
                break;

            case LEFT:
                map[this.maze_x][this.maze_y].isGhost = false;
                this.maze_y -= 1;
                map[this.maze_x][this.maze_y].isGhost = true;
                this.last_move = LEFT;
                break;

            case RIGHT:
                map[this.maze_x][this.maze_y].isGhost = false;
                this.maze_y += 1;
                map[this.maze_x][this.maze_y].isGhost = true;
                this.last_move = RIGHT;
                break;
        }
        if(map[this.maze_x][this.maze_y].isPlayer){
            score -= 500;
        }
        checkLose();
    }
    validMove(x, y, move){
        if((x >= 0 && x <= 9)
        && (y >= 0 && y <= 8)
        && !(map[x][y].isObstacle)
        && !(Math.abs(move - this.last_move) === 2)){
            return true;
        }
        return false;
    }
}

class Player{
    constructor(x, y){
        this.maze_x = x;
        this.maze_y = y;
    }
    moveUp(){
        if(this.validMove(this.maze_x - 1, this.maze_y)){
            console.log("Move up");
            map[this.maze_x][this.maze_y].isPlayer = false;
            this.maze_x -= 1;
            map[this.maze_x][this.maze_y].isPlayer = true;
            if(map[this.maze_x][this.maze_y].hasTreat){
                score += 100;
                numOfTreat--;
                map[this.maze_x][this.maze_y].hasTreat = false;
            }
            if(map[this.maze_x][this.maze_y].isGhost){
                score -= 500;
            }
            updatePlayerPosition();
            checkWin();
        }
        else{
            console.log("Move unsucceed");
        }
    }
    moveLeft(){
        if(this.validMove(this.maze_x, this.maze_y - 1)){
            console.log("Move left");
            map[this.maze_x][this.maze_y].isPlayer = false;
            this.maze_y -= 1;
            map[this.maze_x][this.maze_y].isPlayer = true;
            if(map[this.maze_x][this.maze_y].hasTreat){
                score += 100;
                numOfTreat--;
                map[this.maze_x][this.maze_y].hasTreat = false;
            }
            if(map[this.maze_x][this.maze_y].isGhost){
                score -= 500;
            }
            updatePlayerPosition();
            checkWin();
        }
        else{
            console.log("Move unsucceed");
        }        
    }
    moveDown(){
        if(this.validMove(this.maze_x + 1, this.maze_y)){
            console.log("Move Down");
            map[this.maze_x][this.maze_y].isPlayer = false;
            this.maze_x += 1;
            map[this.maze_x][this.maze_y].isPlayer = true;
            if(map[this.maze_x][this.maze_y].hasTreat){
                score += 100;
                numOfTreat--;
                map[this.maze_x][this.maze_y].hasTreat = false;
            }
            if(map[this.maze_x][this.maze_y].isGhost){
                score -= 500;
            }
            updatePlayerPosition();
            checkWin();
        }
        else{
            console.log("Move unsucceed");
        }
    }
    moveRight(){
        if(this.validMove(this.maze_x, this.maze_y + 1)){
            console.log("Move Right");
            map[this.maze_x][this.maze_y].isPlayer = false;
            this.maze_y += 1;
            map[this.maze_x][this.maze_y].isPlayer = true;
            if(map[this.maze_x][this.maze_y].hasTreat){
                score += 100;
                numOfTreat--;
                map[this.maze_x][this.maze_y].hasTreat = false;
            }
            if(map[this.maze_x][this.maze_y].isGhost){
                score -= 500;
            }
            updatePlayerPosition();
            checkWin();
        }
        else{
            console.log("Move unsucceed");
        }
    }
    validMove(x, y){
        if((x >= 0 && x <= 9)
            && (y >= 0 && y <= 8)
            && !(map[x][y].isObstacle)
            && !(map[x][y].isCentre)){
                return true;
        }
        console.log("Invalid move");
        return false;
    }
}

function checkWin(){
    document.getElementById("score").innerHTML = score;
    if(numOfTreat === 0){
        pauseGame();
        score += time * 100;
        document.getElementById("score").innerHTML = score;
        showAlertMessage();
    }
}

function checkLose(){
    document.getElementById("score").innerHTML = score;
    if(score < 0){
        pauseGame();
        showAlertMessage();
        gameOver = true;
    }
}

function setUpMaze(){
    time = 60;
    score = 0;
    numOfTreat = 59;
    gameOver = false;
    var maze = new Maze();
    setUpEventListener();
    document.getElementById("time").innerHTML = time;
    document.getElementById("score").innerHTML = score;
    setObstacleInMaze();
    setGhostInMaze();
    setPlayerInMaze();
    setCentre();
    ghost1 = new Ghost(4, 4);
    ghost2 = new Ghost(5, 4);
    player = new Player(9, 4);
}

function setObstacleInMaze(){
    setObstacle(1, 1);
    setObstacle(1, 2);
    setObstacle(1, 3);
    setObstacle(2, 1);
    setObstacle(2, 2);
    setObstacle(2, 3);
    setObstacle(1, 5);
    setObstacle(1, 6);
    setObstacle(1, 7);
    setObstacle(2, 5);
    setObstacle(2, 6);
    setObstacle(2, 7);
    setObstacle(4, 1);
    setObstacle(5, 1);
    setObstacle(4, 7);
    setObstacle(5, 7);
    setObstacle(7, 1);
    setObstacle(7, 2);
    setObstacle(7, 3);
    setObstacle(8, 1);
    setObstacle(8, 2);
    setObstacle(8, 3);
    setObstacle(7, 5);
    setObstacle(7, 6);
    setObstacle(7, 7);
    setObstacle(8, 5);
    setObstacle(8, 6);
    setObstacle(8, 7);
}

function setCentre(){
    map[4][4].isCentre = true;
    map[5][4].isCentre = true;
}

function setGhostInMaze(){
    map[4][4].isGhost = true;
    map[4][4].hasTreat = false;
    map[5][4].isGhost = true;
    map[5][4].hasTreat = false;
}

function setPlayerInMaze(){
    map[9][4].isPlayer = true;
    map[9][4].hasTreat = false;
}

function setObstacle(x, y){
    map[x][y].isObstacle = true;
    map[x][y].hasTreat = false;
}

function setUpEventListener(){
    window.addEventListener("keydown", getKey, false);
}

function getKey(event) {
    const key = event.keyCode;
    const shiftKey = event.shiftKey;
  
    if (key === 82 && shiftKey) {
        console.log("shift + r");
        restartGame();
        console.log("restart game");
    }
    else if (key === 38 && gameStarted) {
        console.log("Up arrow");
        player.moveUp();
    }
    else if (key === 40 && gameStarted) {
        console.log("Down arrow");
        player.moveDown();
    }
    else if (key === 37 && gameStarted) {
        console.log("Left arrow");
        player.moveLeft();
    }
    else if (key === 39 && gameStarted) {
        console.log("Right arrow")
        player.moveRight();
    }
    else if (key === 83 && !gameStarted) {
        console.log("s")
        startGame();
        console.log("start game");
    }
    else if (key === 82) {
        console.log("r");
        startGame();
        console.log("resume game");
    }
    else if (key === 80) {
        console.log("p");
        pauseGame();
        console.log("pause game");
    }
  }

function startGame(){
    console.log("start game");
    if(!gameOver){
        timerInterval = setInterval(updateTimer, 1000);
        gameStarted = true;
    }
}

function pauseGame(){
    console.log("pause game");
    clearInterval(timerInterval);
    gameStarted = false;
}

function restartGame(){
    console.log("restart game");
    gameStarted = false;
    setUpMaze();
    clearInterval(timerInterval);
}

function updateTimer(){
    console.log("update timer");
    time--;
    document.getElementById("time").innerHTML = time;
    ghost1.makeMove();
    ghost2.makeMove();
    updateGhostPosition();
    if(time === 0){
        clearInterval(timerInterval);
        gameStarted = false;
        showAlertMessage();
    }
}

function showAlertMessage(){
    gameOver = true;
    alert("Game ended!\nYour score is " + score);
}
var tolerance = 0.2; //1 = all bombs, 0 = no bombs
let bombs = 0;
let res = 10; //len and width of gameboard
let board = spawnBoard();
let shown = spawnEmpty();
let selRect = [1, 1] //declaration (arbitrary values)
let moves = 0; 
let flagIcon;
let timeIcon;
let time = 0;
let alt = false;
let offset = [40, 40]; //to center gameboard on canvas
const gravity = 1;
let side = 500 / res;

function preload(){
    timeIcon = loadImage('https://cdn.glitch.global/98221742-d602-48d1-8944-d86e06cee4bd/clock.png?v=1729604906094');
    flagIcon = loadImage('https://cdn.glitch.global/98221742-d602-48d1-8944-d86e06cee4bd/red-flag.png?v=1729519594424');
}

function setup() {
  createCanvas(580, 700);
}


function draw() {
    if(keyIsDown(SHIFT)){
        alt = true;
        background(230, 190, 180);
    }
    else{
        alt = false;
        background(200, 210, 200);
    }
    let selText = [1, 1, 1, 1] //declaration (arbitrary values)
    let rectSel; //declaration
    
    //rect draw
    for(let i = 0; i < res; i++){
        for(let j = 0; j < res; j++){
            stroke(45, 45, 80);
            strokeWeight(100 / res);
            fill(255 - (i%2 + j%2)%2*20, 235 - (i%2 + j%2)%2*20, 220);
            if(shown[i][j] == 1){
                switch (board[i][j]){
                    case 0: 
                        fill(200, 205, 190);stroke(50, 50, 85);
                        break;
                    case -1:
                        fill(200, 25, 90);stroke(50, 50, 85);
                        break;
                    default: 
                        fill(180, 170, 160);stroke(50, 50, 85);
                        break;
                    
                }
                
            }
            if(shown[i][j] == 2){
                fill(25, 200, 90);stroke(50, 85, 50);
            }
            
            if(mouseX > i*side + offset[0] && mouseX < (i+1)*side + offset[0] + side && mouseY > j*side + offset[0] && mouseY < (j+1) * side + offset[0]){
                rectSel = true;
                selRect = [i, j];
                selText = [board[i][j], i*side + offset[0] + 0.3*side, j*side + offset[1] + 0.7*side];
            }
            rect(i*side + offset[0], j*side + offset[1], side, side);
            if(board[i][j] != 0 && board[i][j] != -1){
                strokeWeight(0);
                fill(60);
                if(shown[i][j] == 1){
                    textSize(side/1.5);
                    text(board[i][j], i*side + offset[0] + 0.3*side, j*side + offset[1] + 0.7*side)
                }
            }
        }
    }
    
    if(rectSel){
        stroke(45, 45, 80);
        fill(190);
        strokeWeight(100/res);
        rect(selRect[0] *side + offset[0] - side*0.05, selRect[1]*side + offset[1] - side*0.05, side * 1.1, side * 1.1)
        if(shown[selRect[0]][selRect[1]] == 1 && board[selRect[0]][selRect[1]] != 0){
            textSize(side/1.5);
            fill(60);
            strokeWeight(0);
            text(selText[0], selText[1], selText[2])
        }
        if(shown[selRect[0]][selRect[1]] == 2){
            fill(30, 200, 100);
            rect(selRect[0] *side + offset[0] - side*0.05, selRect[1]*side + offset[1] - side*0.05, side * 1.1, side * 1.1)
        }
        if(board[selRect[0]][selRect[1]] == -1 && shown[selRect[0]][selRect[1]] == 1){
            fill(200, 25, 90);
            rect(selRect[0] *side + offset[0] - side*0.05, selRect[1]*side + offset[1] - side*0.05, side * 1.1, side * 1.1)
        }
    }
    
    
    strokeWeight(0);
    fill(60);
    textSize(25);
    
    
    //ICON
    const xCord = offset[0] + 140;
    image(timeIcon, xCord, 585, 40, 40);
    text(time, xCord + 50, 590, 40, 40);
    
    image(flagIcon, xCord + 150, 585, 40, 40);
    text(bombs, xCord + 200, 590, 40, 40);
    
    drawParticles();
}

async function touchEnded(){
    console.log("click rvent fired")
    spawnParticles(selRect[0]*side+offset[0]+side/2, selRect[1]*side+offset[1]+side/2, 20);
    if(moves == 0){
        while(board[selRect[0]][selRect[1]] != 0){
            board = spawnBoard();
        }
        let timer = setInterval(() => {
            time++;
        }, 1000);
    }
    moves++;
    if(alt && shown[selRect[0]][selRect[1]] == 0){
        if(board[selRect[0]][selRect[1]] == -1){
            bombs--;
            shown[selRect[0]][selRect[1]] = 2;
        }
        else{
            lose();
        }
    }
    if(!alt && shown[selRect[0]][selRect[1]] == 0 && board[selRect[0]][selRect[1]] == -1){
        lose();
    }
    if(shown[selRect[0]][selRect[1]] != 2){
        shown[selRect[0]][selRect[1]] = 1;
    }
    if(board[selRect[0]][selRect[1]] == 0){
        let x = selRect[0];
        let y = selRect[1];
        let coords = zeroNearby(x, y);
        show(x, y);
        while(coords.length > 0){
             x = coords[0].x
             y = coords[0].y
             //console.log(zeroNearby(x, y));
             coords = coords.concat(zeroNearby(x, y));
             await show(x, y);
             coords.shift();
        }
    }
}

function spawnBoard(){
    bombs = 0;
    let x = new Array(res);
    
    for(let i = 0; i < res; i++){
        x[i] = new Array(res)
        for(let j = 0; j < res; j++){
            if(Math.random() < tolerance && i != 0 && j != res){
                x[i][j] = -1;
                bombs++;
            }
            else{
                x[i][j] = 0;
            }
        }
    }
    
    for(let i = 0; i < res; i++){
        for(let j = 0; j < res; j++){
            if(x[i][j] == -1){
                continue;
            }
            if(i != res-1 && x[i+1][j] == -1){
                x[i][j]++;
            }
            if(i != 0 && x[i-1][j] == -1){
                x[i][j]++;
            }
            if(j != res && x[i][j+1] == -1){
                x[i][j]++;
            }
            if(j != 0 && x[i][j-1] == -1){
                x[i][j]++;
            }
            if(i != res-1 && j != res && x[i+1][j+1] == -1){
                x[i][j]++;
            }
            if(i != res-1 && j != 0 && x[i+1][j-1] == -1){
                x[i][j]++;
            }
            if(i != 0 && j != res && x[i-1][j+1] == -1){
                x[i][j]++;
            }
            if(i != 0 && j != 0 && x[i-1][j-1] == -1){
                x[i][j]++;
            }
        }
    }
    
    
       

    
    return x;
}

function spawnEmpty(){
    let x = new Array(res);
    
    for(let i = 0; i < res; i++){
        x[i] = new Array(res)
        for(let j = 0; j < res; j++){
            x[i][j] = 0;
        }
    }
    return x;
}

function zeroNearby(x, y){
    let coords = [];
    if(x < res-1 && board[x+1][y] == 0 && shown[x+1][y] == 0){
        coords.push({x: x+1, y: y});
    }
    if(x > 0 && board[x-1][y] == 0 && shown[x-1][y] == 0){
        coords.push({x: x-1, y: y});
    }
    if(y < res && board[x][y+1] == 0 && shown[x][y+1] == 0){
        coords.push({x: x, y: y+1});
    }
    if(y > 0 && board[x][y-1] == 0 && shown[x][y-1] == 0){
        coords.push({x: x, y: y-1});
    }
    if(x < res-1 && y < res && board[x+1][y+1] == 0 && shown[x+1][y+1] == 0){
        coords.push({x: x+1, y: y+1});
    }
    if(x > 0 && y > 0 && board[x-1][y-1] == 0 && shown[x-1][y-1] == 0){
        coords.push({x: x-1, y: y-1});
    }
    if(x < res-1 && y > 0 && board[x+1][y-1] == 0 && shown[x+1][y-1] == 0){
        coords.push({x: x+1, y: y-1});
    }
    if(x > 0 && y < res && board[x-1][y+1] == 0 && shown[x-1][y+1] == 0){
        coords.push({x: x-1, y: y+1});
    }
    return coords;
}

async function show(x, y){
    const time = 100 / res;
    const partAm = 2;
    if(x < res-1){ shown[x+1][y] = 1; spawnParticles((x+1)*side+offset[0]+side/2, y*side+offset[1]+side/2, partAm);}
    await sleep(time);
    if(x > 0){ shown[x-1][y] = 1; spawnParticles((x-1)*side+offset[0]+side/2, y*side+offset[1]+side/2, partAm);}
    await sleep(time);
    if(y < res){ shown[x][y+1] = 1; ; spawnParticles((x+1)*side+offset[0]+side/2, y*side+offset[1]+side/2, partAm);}
    await sleep(time);
    if(y > 0){ shown[x][y-1] = 1; spawnParticles((x+1)*side+offset[0]+side/2, (y-1)*side+offset[1]+side/2, partAm);}
    await sleep(time);
    if(x < res-1 && y < res) { shown[x+1][y+1] = 1; spawnParticles((x+1)*side+offset[0]+side/2, (y+1)*side+offset[1]+side/2, partAm);}
    await sleep(time);
    if(x > 0 && y < res){ shown[x-1][y+1] = 1; spawnParticles((x-1)*side+offset[0]+side/2, (y+1)*side+offset[1]+side/2, partAm);}
    await sleep(time);
    if(x < res-1 && y > 0){ shown[x+1][y-1] = 1; spawnParticles((x+1)*side+offset[0]+side/2, (y-1)*side+offset[1]+side/2, partAm);}
    await sleep(time);
    if(x > 0 && y > 0){ shown[x-1][y-1] = 1; spawnParticles((x-1)*side+offset[0]+side/2, (y-1)*side+offset[1]+side/2, partAm);}
    await sleep(time);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function lose(){
    const time = 15;
    for(let i = 0; i < res; i++){
        for(let j = 0; j < res; j++){
            spawnParticles(i*side+offset[0]+side/2, j*side+offset[1]+side/2, 1);
        }
    }
    for(let i = 0; i < 20; i++){
        offset[0] = 40 + 20 * Math.sin(i);
        await sleep(time);
    }
}

class Particle {
    constructor(x, y, m, d){
    this.xAcc = 0;
    this.yAcc = gravity;
    this.xPos = x;
    this.yPos = y;
    this.xVel = m * Math.cos(d);
    this.yVel = m * Math.sin(d);
    }
    tickPosition(){
        this.xVel += this.xAcc;
        this.yVel += this.yAcc;
        this.xPos += this.xVel;
        this.yPos += this.yVel;
    }
    drawParticle(){
        stroke(0);
        fill(5, 60, 80);
        rect(this.xPos, this.yPos, 5, 5);
    }
}

let particles = [];




function spawnParticles(x, y, n){
    for(let i = 0; i < n; i++){
        particles.push(new Particle(x, y, Math.random()*7.0, Math.random()*-80.0));
    }

}


async function drawParticles(){
    //console.log(particles.length);
    for(let i = particles.length-1; i >= 0; i--){
        //console.log(particles[i].yPos);
        particles[i].drawParticle();
        particles[i].tickPosition();
        if(particles[i].yPos > 700){
            particles.splice(i, 1);
        }
    }
}
            

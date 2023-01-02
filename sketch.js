function setup(){
    createCanvas(windowWidth, windowHeight);
    noStroke()
    background(23);

    itemsToDraw = [];
}

function draw(){
    background(23);

    itemsToDraw = [];
    for(i=0;i<itemsToDraw.length;i++)
        itemsToDraw[i].draw();
}

function Chip(){

    this.x = width/2;
    this.y = height/2;
    this.w = 100;
    this.h = 50;

    this.show = function(){

        fill(255);

    }

}
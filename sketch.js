function setup(){
    createCanvas(windowWidth, windowHeight);
    noStroke()
    background(23);
    lx = 0;
    ly = 0;
    lastPressed = 0;
}

function draw(){

    if(mouseIsPressed && lx != 0 && ly != 0){


        stroke(255);
        strokeWeight(10);
        line(lx,ly,mouseX,mouseY);
        noStroke();
    }
    lx = mouseX;
    ly = mouseY;

    
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    noStroke()
    background(23);
    lx = 0;
    ly = 0;
    lastPressed = 0;
}

function draw(){

    if(mouseIsPressed && frameCount-lastPressed > 1 && mouseX != 0 && mouseY != 0){

        if(lx==0&&ly==0){

            lx = mouseX;
            ly = mouseY;
        }
        else{

            stroke(255);
            strokeWeight(10);
            line(lx,ly,mouseX,mouseY);
            noStroke();
        }


        

        lastPressed = frameCount;

        lx = mouseX;
        ly = mouseY;
    }

    
}

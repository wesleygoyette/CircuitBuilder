inputNum  = 2;
outputNum = 2;
wires = [];
circuitry = [];

function setup(){
    
    createCanvas(windowWidth,windowHeight);
    noStroke();
    
    cursorMode = 0;
    lastPressed = 0;
    
    creatingWire = null;
    creatingChip = null;
    
    inputs = [];
    for(i=0;i<inputNum;i++){
        
        inputs.push(new Button((i+1)/(inputNum+1)));
    }
    
    outputs = [];
    for(i=0;i<outputNum;i++){
        
        outputs.push(new Light((i+1)/(outputNum+1)));
    }
    
    t = new Table();
    t.cells.push(new Chip("and"));
    t.cells.push(new Chip("or"));
    t.cells.push(new Chip("not",1,1));
    
}

function draw(){
    background(230, 230, 220);
    
    t.show();
    
    if(random()<0.001){
        wires.sort(()=>{return random < 0.5});
    }
    for(i=0;i<wires.length*3;i++){
        wires[i%wires.length].update();
    }
    
    for(i=0;i<circuitry.length;i++){
        
        circuitry[i].update();
        circuitry[i].draw();
    }
    
    for(i=0;i<wires.length;i++){
        wires[i].draw();
    }
    
    if(creatingWire){
        creatingWire.draw();
    }
    if(creatingChip){
        
        creatingChip.showWhileCreating();
        
        if(mouseIsPressed && frameCount - lastPressed > 20){
            circuitry.push(creatingChip);
            creatingChip = null;
            cursorMode = 0;
            lastPressed = frameCount;
        }
    }
    
    for(i=0;i<inputs.length;i++)
        inputs[i].show();
    
    for(i=0;i<outputs.length;i++)
        outputs[i].show();
    
    
    if(cursorMode == 1 && !creatingWire){
        
        stroke(0);
        strokeWeight(4);
        fill(0,0);
        ellipse(mouseX,mouseY,30);
        noStroke();
    }
    
    
    if(inputNum != inputs.length){
        
        inputs = [];
        for(i=0;i<inputNum;i++){
            
            inputs.push(new Button((i+1)/(inputNum+1)));
        }
        outputs = [];
        for(i=0;i<outputNum;i++){
            
            outputs.push(new Light((i+1)/(outputNum+1)));
        }
        
        wires = [];
        circuitry = [];
    }
    if(outputNum != outputs.length){
        
        inputs = [];
        for(i=0;i<inputNum;i++){
            
            inputs.push(new Button((i+1)/(inputNum+1)));
        }
        outputs = [];
        for(i=0;i<outputNum;i++){
            
            outputs.push(new Light((i+1)/(outputNum+1)));
        }
        
        wires = [];
        circuitry = [];
    }
    
}

///////////////////////////////////////////////////////////////////////////////////////

function keyPressed(){
    if(key == "Escape"){
        cursorMode = 0;
        creatingWire = null;
        creatingChip = null;
    }
    else if(key == "1"){
        
        cursorMode = 1;
        creatingWire = null;
        creatingChip = null;
    }
    else if(key == "2"){
        
        if(cursorMode != 2){
            
            creatingWire = null;
            creatingChip = null;
            
            cursorMode = 2;
            creatingChip = new Chip("and");
        }
    }
    else if(key == "3"){
        
        if(cursorMode != 3){
            
            creatingWire = null;
            creatingChip = null;
            
            cursorMode = 3;
            creatingChip = new Chip("or");
        }
    }
    else if(key == "4"){
        
        if(cursorMode != 4){
            
            creatingWire = null;
            creatingChip = null;
            
            cursorMode = 4;
            creatingChip = new Chip("not",1,1);
        }
    }
    
}


///////////////////////////////////////////////////////////////////////////////////////

function Table(){
    
    
    padA = 100;
    padB = 25;
    this.x = width - 360 + padA/2;
    this.y = padA/2;
    this.w = 400-padA;
    this.h = height-padA;
    
    this.g = createGraphics(400-padA-padB, height-padA-padB);
    this.g.noStroke();
    
    this.cells = [];
    
    this.show = function(){
        
        fill(23);
        rect(this.x,this.y,this.w,this.h, 15);
        
        stroke(23);
        strokeWeight(10);
        fill(255,0,0);
        rect(this.x,this.y+this.h,this.w*1/4,height-(this.y+this.h)-10,10);
        fill(0,255,0);
        rect(this.x+this.w*1/4,this.y+this.h,this.w*1/4,height-(this.y+this.h)-10,10);
        fill(255,0,0);
        rect(this.x+this.w*2/4,this.y+this.h,this.w*1/4,height-(this.y+this.h)-10,10);
        fill(0,255,0);
        rect(this.x+this.w*3/4,this.y+this.h,this.w*1/4,height-(this.y+this.h)-10,10);
        noStroke();
        
        fill(23);
        textAlign(CENTER,CENTER);
        textSize(25);
        text("v",this.x + this.w/8, (this.y+this.h+height-8)/2);
        text("v",this.x + this.w*5/8, (this.y+this.h+height-8)/2);
        textSize(30);
        text("^",this.x + this.w*3/8, (this.y+this.h+height)/2);
        text("^",this.x + this.w*7/8, (this.y+this.h+height)/2);
        
        if(mouseIsPressed && frameCount-lastPressed > 10 && mouseX >= this.x && mouseX < this.x+this.w/4 && mouseY > this.y+this.h){
            inputNum--;
            if(inputNum < 1)
                inputNum = 1;
            lastPressed = frameCount;
        }
        if(mouseIsPressed && frameCount-lastPressed > 10 &&
           mouseX >= this.x+this.w*1/4 && mouseX < this.x+this.w*1/4+this.w/4 && mouseY > this.y+this.h){
            
            inputNum++;
            if(inputNum > 8)
                inputNum = 8;
            lastPressed = frameCount;
        }
        if(mouseIsPressed && frameCount-lastPressed > 10 && mouseX >= this.x+this.w*1/2 && mouseX < this.x+this.w*1/2+this.w/4 && mouseY > this.y+this.h){
            
            outputNum--;
            if(outputNum < 1)
                outputNum = 1;
            lastPressed = frameCount;
        }
        if(mouseIsPressed && frameCount-lastPressed > 10 &&
           mouseX >= this.x+this.w*3/4 && mouseX < this.x+this.w*3/4+this.w/4 && mouseY > this.y+this.h){
            
            outputNum++;
            if(outputNum > 8)
                outputNum = 8;
            lastPressed = frameCount;
        }
        
        this.drawG();
    }
    
    this.drawG = function(){
        
        bs = this.g.width/2;
        gsx = floor(this.g.width/bs);
        
        this.g.background(100);
        
        c = 0;
        for(y=0;c<=this.cells.length;y++)
            for(x=0;x<gsx;x++)
                if(c < this.cells.length)
                {
                    pad = 4;
                    this.g.fill(60);
                    this.g.rect(x*bs+pad/2,y*bs+pad/2,bs-pad,bs-pad,10);
                    
                    this.cells[c].x = (x+0.5)*bs;
                    this.cells[c].y = (y+0.5)*bs;
                    
                    this.cells[c].drawOnG(this.g);
                    
                    this.g.fill(255);
                    this.g.textSize(16);
                    this.g.textAlign(CENTER,CENTER);
                    this.g.text(this.cells[c].logicMode,(x+0.5)*bs,y*bs+20);
                    
                    if(mouseIsPressed && frameCount-lastPressed > 30 &&
                       mouseX >= this.x+padB/2+x*bs && mouseX <= this.x+padB/2+(x+1)*bs &&
                       mouseY >= this.y+padB/2+y*bs && mouseY <= this.y+padB/2+(y+1)*bs){
                        
                        
                        creatingWire = null;
                        creatingChip = null;
                        
                        cursorMode = 2;
                        creatingChip = Object.assign({}, this.cells[c]);
                        
                        
                        //if custom chip
                        if(creatingChip.wires){
                            
                            creatingChip.wires = [];
                            for(p=0;p<this.cells[c].wires.length;p++)
                                creatingChip.wires[p] = Object.assign({}, this.cells[c].wires[p]);
                            
                            creatingChip.circuitry = [];
                            for(p=0;p<this.cells[c].circuitry.length;p++){
                                
                                creatingChip.circuitry[p] = Object.assign({}, this.cells[c].circuitry[p]);
                                
                                for(m=0;m<this.cells[c].circuitry[p].inputPins.length;m++){
                                    
                                    creatingChip.wires.forEach(wire => {
                                        
                                        if(wire.b == this.cells[c].circuitry[p].inputPins[m])
                                            wire.b = creatingChip.circuitry[p].inputPins[m];
                                    })
                                }
                                
                                for(m=0;m<this.cells[c].circuitry[p].outputPins.length;m++){
                                    
                                    creatingChip.wires.forEach(wire => {
                                        
                                        if(wire.a == this.cells[c].circuitry[p].outputPins[m])
                                            wire.a = creatingChip.circuitry[p].outputPins[m];
                                    })
                                }
                                
                            }
                            
                        }
                        
                        creatingChip.inputPins = [];
                        for(p=0;p<this.cells[c].inputPins.length;p++){
                            creatingChip.inputPins[p] = Object.assign({}, this.cells[c].inputPins[p]);
                            
                            if(creatingChip.wires)
                                creatingChip.wires.forEach(wire => {
                                    
                                    if(wire.a == this.cells[c].inputPins[p])
                                        wire.a = creatingChip.inputPins[p];
                                })
                                }
                        creatingChip.outputPins = [];
                        for(p=0;p<this.cells[c].outputPins.length;p++){
                            creatingChip.outputPins[p] = Object.assign({}, this.cells[c].outputPins[p]);
                            
                            if(creatingChip.wires)
                                creatingChip.wires.forEach(wire => {
                                    
                                    if(wire.b == this.cells[c].outputPins[p])
                                        wire.b = creatingChip.outputPins[p];
                                })
                                }
                        
                        lastPressed = frameCount;
                        if(c > 2)
                        this.cells.splice(c,1);
                    }
                    
                    c++;
                }
                else if(c == this.cells.length){
                    pad = 4;
                    this.g.fill(60);
                    this.g.rect(x*bs+pad/2,y*bs+pad/2,bs-pad,bs-pad,10);
                    
                    this.g.fill(255);
                    this.g.textSize(40);
                    this.g.textAlign(CENTER,CENTER);
                    this.g.text("+",(x+0.5)*bs,(y+0.5)*bs);
                
                    if(mouseIsPressed && frameCount-lastPressed > 30 &&
                       mouseX >= this.x+padB/2+x*bs && mouseX <= this.x+padB/2+(x+1)*bs &&
                       mouseY >= this.y+padB/2+y*bs && mouseY <= this.y+padB/2+(y+1)*bs){
                        
                        creatingWire = null;
                        creatingChip = null;
                        
                        this.cells.push(Object.assign({}, new CustomChip()));
                        
                        this.cells[this.cells.length-1].logicMode += String.fromCharCode("A".charCodeAt(0)+this.cells.length-4);
                        this.cells[this.cells.length-1].pinSize = (bs)/(max(inputNum,outputNum)+4);
                        
                        lastPressed = frameCount;
                    }
                    
                    c++;
                }
        
        image(this.g, this.x+padB/2, this.y+padB/2);
        
    }
}

function CustomChip(){
    
    this.logicMode = "Extra";
    
    this.x = width/2;
    this.y = height/2;
    this.s = 2;
    
    this.pinSize = 30;
    
    this.inputNum = inputNum;
    this.outputNum = outputNum;
    
    this.inputPins = [];
    this.outputPins = [];
    
    this.wires = wires;
    this.circuitry = circuitry;
    wires = [];
    circuitry = [];
    
    for(p=0;p<this.inputNum;p++){
        
        this.inputPins[p] = new Pin(this.x,this.y,1,0);
        this.wires.forEach(wire=>{
            
            if(wire.a == inputs[p]){
                
                wire.a = this.inputPins[p];
            }
        });
    }
    
    for(p=0;p<this.outputNum;p++){

        this.outputPins[p] = new Pin(this.x,this.y,1,1);
        this.wires.forEach(wire=>{

            if(wire.b == outputs[p]){
                
                outputs[p].connected = false;

                wire.b = this.outputPins[p];
            }
        });
    }
    
    this.update = function(){
        
        this.wires.forEach(wire=>{
            
            wire.update();
        });
        
        this.circuitry.forEach(chip=>{
            
            chip.update();
        });
    }
    
    this.draw = function(){
        
        this.s = this.pinSize * max(this.inputNum,this.outputNum);
        
        sf = 0.5;
        
        translate(this.x-this.s/2,this.y-this.s/2);
        scale(this.s/width,this.s/height);
        this.circuitry.forEach(chip=>{
            
            chip.draw();
        });
        scale(width/this.s,height/this.s);
        translate(-this.x+this.s/2,-this.y+this.s/2);
        
        fill(50);
        rect(this.x-this.s/2,this.y-this.s/2,this.s,this.s);
        
        for(p=0;p<this.inputPins.length;p++)
            this.inputPins[p].show(this.x-this.s/2,this.y-this.s/2+(p+0.5)*this.pinSize,this.pinSize);
        for(p=0;p<this.outputPins.length;p++)
            this.outputPins[p].show(this.x+this.s/2,this.y-this.s/2+(p+0.5)*this.pinSize,this.pinSize);
    }
    
    this.showWhileCreating = function(){
        
        this.x = mouseX;
        this.y = mouseY;
        
        this.draw();
    }
    
    this.drawOnG = function(g){
        
        s = this.pinSize * max(this.inputNum,this.outputNum);
        
        
        g.fill(50);
        g.rect(this.x-s/2,this.y-s/2,s,s);
        
        
        for(p=0;p<this.inputPins.length;p++)
            this.inputPins[p].showOnG(g,this.x-s/2,this.y-s/2+(p+0.5)*this.pinSize,this.pinSize);
        for(p=0;p<this.outputPins.length;p++)
            this.outputPins[p].showOnG(g,this.x+s/2,this.y-s/2+(p+0.5)*this.pinSize,this.pinSize);
    }
    
}


function Chip(lMode="and",iN=2,oN=1){
    
    this.x = width/2;
    this.y = height/2;
    
    this.pinSize = 30;
    
    this.logicMode = lMode;
    
    this.inputNum = iN;
    this.outputNum = oN;
    
    this.inputPins = [];
    this.outputPins = [];
    
    for(p=0;p<this.inputNum;p++)
        this.inputPins.push(new Pin(this.x,this.y,1,0));
    
    for(p=0;p<this.outputNum;p++)
        this.outputPins.push(new Pin(this.x,this.y,1,1));
        
    this.update = function(){
        
        
        if(this.logicMode == "and"){
            
            output = true;
            connected = false;
            for(p=0;p<this.inputPins.length && output;p++){
                if(!this.inputPins[p].state && this.inputPins[p].connected)
                    output = false;
                if(this.inputPins[p].connected)
                    connected = true;
            }
            
            output = output && connected;
            
            
            for(p=0;p<this.outputPins.length;p++)
                this.outputPins[p].state = output;
        }
        else if(this.logicMode == "or"){
            
            output = false;
            for(p=0;p<this.inputPins.length && !output;p++)
                if(this.inputPins[p].state)
                    output = true;
            
            for(p=0;p<this.outputPins.length;p++)
                this.outputPins[p].state = output;
        }
        else if(this.logicMode == "not" && this.inputPins.length == this.outputPins.length){
            
            for(p=0;p<this.inputPins.length;p++)
                this.outputPins[p].state = !this.inputPins[p].state;
        }
    }
    
    this.draw = function(){
        
        s = this.pinSize * max(this.inputNum,this.outputNum);
        
        if(this.logicMode=="and")
            fill(0,0,255);
        else if(this.logicMode=="or")
            fill(1,150,32);
        else if(this.logicMode=="not")
            fill(255,0,0);
        else
            fill(0);
        rect(this.x-s/2,this.y-s/2,s,s);
        
        
        for(p=0;p<this.inputPins.length;p++)
            this.inputPins[p].show(this.x-s/2,this.y-s/2+(p+0.5)*this.pinSize,this.pinSize);
        for(p=0;p<this.outputPins.length;p++)
            this.outputPins[p].show(this.x+s/2,this.y-s/2+(p+0.5)*this.pinSize,this.pinSize);
    }
    
    this.showWhileCreating = function(){
        
        this.x = mouseX;
        this.y = mouseY;
        
        this.draw();
        this.update();
    }
    
    this.drawOnG = function(g){
        
        s = this.pinSize * max(this.inputNum,this.outputNum);
        
        if(this.logicMode=="and")
            g.fill(0,0,255);
        else if(this.logicMode=="or")
            g.fill(1,150,32);
        else if(this.logicMode=="not")
            g.fill(255,0,0);
        else
            g.fill(0);
        g.rect(this.x-s/2,this.y-s/2,s,s);
                
        
        for(p=0;p<this.inputPins.length;p++)
            this.inputPins[p].showOnG(g,this.x-s/2,this.y-s/2+(p+0.5)*this.pinSize,this.pinSize);
        for(p=0;p<this.outputPins.length;p++)
            this.outputPins[p].showOnG(g,this.x+s/2,this.y-s/2+(p+0.5)*this.pinSize,this.pinSize);
    }
    
}

function Pin(x,y,s,ioMode){
    
    this.x = x;
    this.y = y;
    this.s = s;
    
    this.connected = false;
    this.state = 0;
    
    this.ioMode = ioMode;
    
    this.show = function(x,y,s){
        
        this.x = x;
        this.y = y;
        this.s = s;
        
        fill(0);
        ellipse(this.x,this.y,this.s);
        fill(155);
        if(this.state)
            fill(255,255,0);
        ellipse(this.x,this.y,this.s*0.8);
        
        if(this.ioMode == 0 && !this.connected && mouseIsPressed &&
           frameCount-lastPressed > 10 && dist(mouseX,mouseY,this.x,this.y) < this.s/2 &&
           cursorMode == 1 && creatingWire){
            
            this.connected = true;
                
            creatingWire.b = this;
            
            wires.push(creatingWire);
            
            creatingWire = null;
            
            lastPressed = frameCount;
        }
        else if(this.ioMode == 1 && cursorMode == 1 && !creatingWire &&
                mouseIsPressed && frameCount-lastPressed > 10 &&
                dist(mouseX,mouseY,this.x,this.y) < this.s/2){
            
            creatingWire = new Wire(this,null);
            
            lastPressed = frameCount;
            this.connected = true;
        }
    }
    
    this.showOnG = function(g,x,y,s){
        
        this.x = x;
        this.y = y;
        this.s = s;
        
        g.fill(0);
        g.ellipse(this.x,this.y,this.s);
        g.fill(155);
        if(this.connected)
            g.fill(255,255,0);
        g.ellipse(this.x,this.y,this.s*0.8);
    }
}


function Wire(a,b){
    
    this.a = a;
    this.b = b;
    
    this.update = function(){
        
        this.b.state = this.a.state;
    }
    
    this.draw = function(){
        
        stroke(a.state*255,0,0);
        
        if(this.b != null){
            
            strokeWeight(5);
            line(this.a.x,this.a.y,this.b.x,this.b.y);
        }
        else{
            
            strokeWeight(11);
            line(this.a.x,this.a.y,mouseX,mouseY);
        }
        
        noStroke();
    }
}

function Light(h){
    
    this.x = width-345;
    this.y = height * h;
    this.s = 80;
    
    this.state = 0;
    
    this.connected = false;
    
    this.show = function(){
        
        if(!this.connected)
            this.state = 0;
        
        if(!this.connected && cursorMode == 1 && creatingWire &&
           mouseIsPressed && frameCount-lastPressed > 10 &&
           mouseX >= this.x-this.s/2 && mouseX <= this.x + this.s/2 &&
           mouseY >= this.y-this.s/2 && mouseY <= this.y + this.s/2){
            
            creatingWire.b = this;
                                
            wires.push(creatingWire);
            
            creatingWire = null;
            
            lastPressed = frameCount;
            this.connected = true;
        }
        
        fill(23);
        rect(this.x-this.s/2,this.y-this.s/2,this.s,this.s,10);
        
        s = this.s * 0.8;
        
        if(this.state)
            fill(255,255,51);
        else
            fill(100);
        rect(this.x-s/2,this.y-s/2,s,s);
    }
}


function Button(h){
    
    this.x = 50;
    this.y = height * h;
    this.s = 80;
    
    this.state = 0;
        
    this.show = function(){
        
        fill(0);
        ellipse(this.x,this.y,this.s);
        
        fill(!this.state*255,this.state*255,0);
        ellipse(this.x,this.y,this.s*0.8);
        
        if(mouseIsPressed && frameCount-lastPressed > 10 &&
           dist(mouseX,mouseY,this.x,this.y) < this.s/2){
            
            if(cursorMode == 0)
                this.state = !this.state;
            else if(cursorMode == 1 && !creatingWire){
                    
                creatingWire = new Wire(this,null);
            }
            
            lastPressed = frameCount;
        }
        
    }
    
    
}


function connectNode(x,y){
    this.state = 0;
    this.x = x;
    this.y = y;
}

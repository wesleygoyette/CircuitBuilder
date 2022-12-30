
function setup(){
    createCanvas(windowWidth,windowHeight);
    noStroke();
    
    simWidth = width-300;
        
    chipColors = [color(255,173,47),
                  color(255,47,154),
                  color(48,129,238),
                  color(110,193,248)];
    
    ioController = new IOSizeController();
    addChipController = new ChipController();
    
    inputNum = 2;
    outputNum = 2;
    inputSwitches = [];
    outputSwitches = [];
    
    wires = [];
    circuitry = [];
        
    for(i=0;i<inputNum;i++)
        inputSwitches[i] = new Switch((i+1)/(inputNum+1));
    
    for(i=0;i<outputNum;i++)
        outputSwitches[i] = new Light((i+1)/(outputNum+1));
    
    wireToAdd = null;
    chipToAdd = null;
    cursorMode = 0;
}

function draw(){
    background(50);
        
    for(i=0;i<circuitry.length;i++)
        circuitry[i].show();
    
    for(i=0;i<wires.length;i++)
        wires[i].show();
    
    if(wireToAdd != null)
        wireToAdd.show();
    
    for(i=0;i<inputSwitches.length;i++)
        inputSwitches[i].show();
    
    for(i=0;i<outputSwitches.length;i++)
        outputSwitches[i].show();
    
    ioController.show();
    addChipController.show();
    
    
    
    if(chipToAdd != null){
        chipToAdd.x = mouseX;
        chipToAdd.y = mouseY;
        chipToAdd.draw();
    }
    
    if(cursorMode == 1 && wireToAdd == null){
        fill(0,0);
        stroke(200,100);
        strokeWeight(8);
        ellipse(mouseX,mouseY,30);
        strokeWeight(3);
        stroke(0);
        ellipse(mouseX,mouseY,30);
        noStroke();
    }
    else if(cursorMode == 2 && mouseIsPressed
            && frameCount-addChipController.lastPressed > 30){
        
        circuitry.push(chipToAdd);
        chipToAdd = null;
        cursorMode = 0;
        addChipController.lastPressed = frameCount;
    }
    
    if(inputNum != inputSwitches.length || outputNum != outputSwitches.length){
        
        inputSwitches = [];
        outputSwitches = [];
        
        if(wires.length!=0){
            wires = [];
            circuitry = [];
        }
        
        for(i=0;i<inputNum;i++)
            inputSwitches[i] = new Switch((i+1)/(inputNum+1));
        
        for(i=0;i<outputNum;i++)
            outputSwitches[i] = new Light((i+1)/(outputNum+1));
    }
}

function keyPressed(){
    
    if(key=="Escape"){
        
        cursorMode = 0;
        wireToAdd = null;
        chipToAdd = null;
    }
    else if(key=="1"){
        
        chipToAdd = null;
        cursorMode = 1;
    }
    
//    console.log(key);
}

function Register(){
    
    this.mode = "register";
    
    this.memSize = 4;
    
    this.memory = Array(this.memSize).fill(0);
    this.inputs = [];
    this.outputs = [];
    
    for(mem=0;mem<this.memSize+2;mem++)
        this.inputs[mem] = new Pin(0);
    for(mem=0;mem<this.memSize;mem++)
        this.outputs[mem] = new Pin(1);
    
    
    this.x = simWidth/2;
    this.y = height/2;
    this.w = (this.memSize+2)*16;
    this.h = this.w;
    
    this.draw = function(){
        this.show();
    }
    this.update = function(){
    }
    
    this.show = function(){
        
        fill(0);
        rect(this.x-this.w/2,this.y-this.h/2,this.w,this.h);
        
        sum = 0;
        
        for(p=0;p<this.memSize;p++){
            
            if(this.memory[p])
                sum += pow(2,p);
            
        }
        
        fill(255,0,0);
        textSize(90);
        if(sum>=10)
        textSize(70);
        textAlign(CENTER,CENTER);
        text(sum,this.x,this.y);
        
        h = this.h/(this.memSize+2);
        
        for(p=0;p<this.memSize+2;p++){
            
            this.inputs[p].update(this.x-this.w/2-h/2,this.y-this.h/2+h/2+h*p,h,h);
            this.inputs[p].draw(this.x-this.w/2-h/2,this.y-this.h/2+h/2+h*p,h,h);
        }
        
        for(p=0;p<this.memSize;p++){
            
            this.outputs[p].update(this.x+this.w/2+h/2,this.y-this.h/2+h/2+h*p,h,h);
            this.outputs[p].draw(this.x+this.w/2+h/2,this.y-this.h/2+h/2+h*p,h,h);
            this.outputs[p].state = false;
        }
        
        if(this.inputs[this.memSize+1].state){
            
            for(p=0;p<this.memSize;p++){
                
                
                this.outputs[p].state = this.memory[p];
            }
            
            
            
        }
        if(this.inputs[this.memSize].state){
            
            for(p=0;p<this.memSize;p++){
                
                this.memory[p] = this.inputs[p].state;
            }
            
            
            
        }
        
    }
    
    
}



function Chip(mode="and",iNum=2,oNum=1){
    
    this.iNum = iNum;
    this.oNum = oNum;
    this.mode = mode;
    this.truthTable = [];
    
    this.inputs = [];
    this.outputs = [];
    
    for(p=0;p<this.iNum;p++)
        this.inputs[p] = new Pin(0);
    for(p=0;p<this.oNum;p++)
        this.outputs[p] = new Pin(1);
    
    this.x = simWidth/2;
    this.y = height/2;
    this.w = 30;
    this.h = min(max(this.iNum,this.oNum)*20,height/2);
    
    this.c = chipColors[floor(random(chipColors.length))];
    
    if(this.mode=="and"){
        this.c = color(0,0,255);
    }
    else if(this.mode=="or"){
        this.c = color(160,255,47);
    }
    else if(this.mode=="not"){
        this.c = color(255,0,0);
    }
    
    this.show = function(){
        this.draw();
        this.update();
    }
    
    this.update = function(){
        
        if(this.mode=="and"){
            
            out = true;
            
            for(p=0;p<this.iNum&&out;p++)
                if(!this.inputs[p].state)
                    out = false;
            
            for(p=0;p<this.oNum;p++)
                this.outputs[p].state = out;
        }
        else if(this.mode=="or"){
            
            out = false;
            
            for(p=0;p<this.iNum&&!out;p++)
                if(this.inputs[p].state)
                    out = true;
            
            for(p=0;p<this.oNum;p++)
                this.outputs[p].state = out;
        }
        else if(this.mode=="not"){
            
            for(p=0;p<this.iNum&&p<this.oNum;p++)
                this.outputs[p].state = !this.inputs[p].state
        }
        else{
            ttIndex = 0;
            for(p=0;p<this.iNum;p++)
                if(this.inputs[p].state)
                    ttIndex += pow(2,p);
            
            if(ttIndex < this.truthTable.length)
            for(p=0;p<this.oNum&&p<this.truthTable[ttIndex].length;p++)
                this.outputs[p].state = this.truthTable[ttIndex][p];
            
            
        }
        
        for(p=0;p<this.iNum;p++){
            
            this.inputs[p].update();
        }
        
        for(p=0;p<this.oNum;p++){
            
            this.outputs[p].update();
        }
        
    }
        
    this.draw = function(){
        
        let h = min(this.h/this.iNum,this.h/this.oNum);
        
        for(p=0;p<this.iNum;p++){
            
            this.inputs[p].draw(this.x-this.w/2-h/2,this.y-this.h/2+h/2+h*p,h,h);
        }
        
        for(p=0;p<this.oNum;p++){
            
            this.outputs[p].draw(this.x+this.w/2+h/2,this.y-this.h/2+h/2+h*p,h,h);
        }
        
        fill(this.c);
        rect(this.x-this.w/2,this.y-this.h/2,this.w,this.h,this.w/10);
        
        
    }
}

function Pin(mode){
    
    this.mode = mode;
    
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    
    this.state = 0;
    this.connected = 0;
    
    this.update = function(){
        if(cursorMode==1 && mouseIsPressed &&
           mouseX >= this.x-this.w/2 && mouseX <= this.x+this.w/2 &&
           mouseY >= this.y-this.w/2 && mouseY <= this.y+this.w/2){
                        
            if(wireToAdd!=null && this.mode==0 && !this.connected)
                addNewWire(this);
            else if(wireToAdd==null && this.mode==1)
                addNewWire(this);
            
            this.connected = true
        }
    }
    
    this.draw = function(x,y,w,h){
        
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        
        stroke(this.state*255);
        strokeWeight(this.h/10);
        fill(100);
        rect(this.x-this.w/2,this.y-this.h/2,this.w,this.h,this.h/8);
        noStroke();
    }
}

function Wire(a){
    
    this.a = a;
    this.b = null;
        
    this.show = function(){
        
        stroke(255*this.a.state);
        
        if(this.b != null){
            
            strokeWeight(5);
            line(this.a.x,this.a.y,this.b.x,this.b.y);
            
            this.b.state = this.a.state;
        }
        else{

            strokeWeight(10);
            line(this.a.x,this.a.y,mouseX,mouseY);
        }
        
        noStroke();
    }
}
function addNewWire(connect){
    
    if(wireToAdd == null){
        wireToAdd = new Wire(connect);
    }
    else{
        wireToAdd.b = connect;
        wires.push(wireToAdd);
        wireToAdd = null;
    }
}



function Light(h){
    
    this.x = simWidth-80;
    this.y = height*map(h,0,1,0.05,0.95);
    this.w = min(height*0.9/outputNum,80);
    
    this.state = 0;
    
    this.strength = 0;
    
    this.connected = false;
        
    this.show = function(){
        
        fill(0);
        rect(this.x-this.w/2,this.y-this.w/2,this.w,this.w,this.w/10);
        
        w = this.w*7/8;
        fill(20+this.strength*235,20+this.strength*235,20*(1-this.strength));
        rect(this.x-w/2,this.y-w/2,w,w,this.w/10);
        
        if(this.strength != this.state){
            
            this.strength += (this.state-this.strength)/5;
        }
        
        if(mouseIsPressed && !this.connected && cursorMode == 1 &&
           wireToAdd != null &&
           mouseX >= this.x-this.w/2 && mouseX <= this.x+this.w/2 &&
           mouseY >= this.y-this.w/2 && mouseY <= this.y+this.w/2){
            
            this.connected = true;
            addNewWire(this);
        }
        
    }
}

function Switch(h){
    
    this.x = 100;
    this.y = height*map(h,0,1,0.05,0.95);
    this.w = min((height*0.9)/inputNum,100);
    this.h = this.w/2;
    
    this.state = 0;
    
    this.slidePos = 0;
    
    this.lastPressed = 0;
    
    this.show = function(){
        
        this.update();
        
        fill(0);
        rect(this.x-this.w/2,this.y-this.h/2,this.w,this.h,this.h/5);
        
        stroke(0);
        strokeWeight(this.w/20);
        fill((1-this.slidePos)*255,this.slidePos*255,0);
        rect(this.x-this.w/2+(this.slidePos*this.w/2),
             this.y-this.h/2,this.w/2,this.h,this.h/5);
        noStroke();
    }
    
    this.update = function(){
        
        if(mouseIsPressed && frameCount - this.lastPressed > 10 &&
           mouseX >= this.x-this.w/2 && mouseX <= this.x+this.w/2 &&
           mouseY >= this.y-this.h/2 && mouseY <= this.y+this.h/2){
            
            if(cursorMode==0){
                
                this.state = !this.state;
            }
            else if(cursorMode==1 && wireToAdd==null){
                
                addNewWire(this);
            }
            this.lastPressed = frameCount;
        }
        
        if(this.slidePos-this.state>0.01){
            
            this.slidePos -= 0.1;
        }
        if(this.slidePos-this.state<-0.01){
            
            this.slidePos += 0.1;
        }
            
    }
}

function IOSizeController(){
    
    this.x = simWidth/2;
    this.y = 0;
    this.w = 400;
    this.h = 50;
    
    this.lastPressed = 0;
    
    this.buttons = [0,0,0,0];
    this.buttonLevels = [0,0,0,0];
    
    this.show = function(){
                
        fill(0);
        rect(this.x-this.w/2,this.y,this.w,this.h);
        
        fill(100);
        textAlign(CENTER,TOP);
        textSize(30);
        text("Wesley Goyette",this.x,this.y+10);
        
        
        stroke(0);
        fill(0,255,0);
        rect(this.x-this.w/2,this.y,this.h-this.buttonLevels[0],this.h/2,this.h/8);
        this.checkRect(this.x-this.w/2,this.y,this.h,this.h/2,0);
        rect(this.x+this.w/2-this.h,this.y,this.h,this.h/2,this.h/8);
        this.checkRect(this.x+this.w/2-this.h,this.y,this.h,this.h/2,1);
        
        fill(255,0,0);
        rect(this.x-this.w/2,this.y+this.h/2,this.h,this.h/2,this.h/8);
        this.checkRect(this.x-this.w/2,this.y+this.h/2,this.h,this.h/2,2);
        rect(this.x+this.w/2-this.h,this.y+this.h/2,this.h,this.h/2,this.h/8);
        this.checkRect(this.x+this.w/2-this.h,this.y+this.h/2,this.h,this.h/2,3);
        noStroke();
        
        fill(100);
        rect(this.x-this.w/2-this.h,this.y,this.h,this.h,this.h/14);
        rect(this.x+this.w/2,this.y,this.h,this.h,this.h/14);
        
        fill(200);
        stroke(100);
        strokeWeight(2);
        textAlign(CENTER,TOP);
        textSize(40);
        text(inputNum,this.x-this.w/2-this.h/2,this.y+6);
        text(outputNum,this.x+this.w/2+this.h/2,this.y+6);
        noStroke();
        
        
        
    }
    
    this.checkRect = function(x,y,w,h,mode){
        
        if(mouseIsPressed &&
           mouseX >= x && mouseX < x+w &&
           mouseY >= y && mouseY < y+h){
            
            if(frameCount - this.lastPressed > 10){
                
                if(mode==0){
                    
                    inputNum++;
                    if(inputNum > 32)
                        inputNum = 32;
                }
                else if(mode==2){
                    
                    inputNum--;
                    if(inputNum < 1)
                        inputNum = 1;
                }
                else if(mode==1){
                    
                    outputNum++;
                    if(outputNum > 32)
                        outputNum = 32;
                }
                else if(mode==3){
                    
                    outputNum--;
                    if(outputNum < 1)
                        outputNum = 1;
                }
                
                this.lastPressed = frameCount;
            }
            else{
                
                this.buttons[mode]+=1;
                
            }
        }
    }
}

function ChipController(){
    
    this.x = simWidth;
    this.y = 0;
    this.w = width-simWidth;
    this.h = height;
    
    this.cells = [new Chip("and",2,1),
                  new Chip("or" ,2,1),
                  new Chip("not",1,1),
                  new Register()];
    
    this.lastPressed = 0;
    
    
    this.show = function(){
        
        fill(23);
        rect(this.x,this.y,this.w,this.h);
        
        gridWidth = 3;
        bs = this.w/gridWidth;
        
        c = 0;
        y = 0;
        while(c<=this.cells.length){
            
            for(x=0;x<gridWidth&&c<=this.cells.length;x++){
                
                padd = 5;
                
                fill(100);
                rect(this.x+bs*x+padd/2,this.y+bs*y+padd/2,bs-padd,bs-padd,bs/20);
                
                if(c < this.cells.length){
                    
                    fill(255);
                    textAlign(CENTER,TOP);
                    textSize(20);
                    text(this.cells[c].mode,this.x+bs*x+bs/2,this.y+bs*y+5);
                    this.cells[c].x = 0;
                    this.cells[c].y = 0;
                    scl = min((bs/2)/this.cells[c].h,1);
                    translate(this.x+bs*x+bs/2,this.y+bs*y+bs/2+10);
                    scale(scl);
                    this.cells[c].draw();
                    scale(1/scl);
                    translate(-(this.x+bs*x+bs/2),-(this.y+bs*y+bs/2+10));
                }
                else{
                    fill(255);
                    textAlign(CENTER,CENTER);
                    textSize(30);
                    text("+",this.x+bs*x+bs/2,this.y+bs*y+bs/2);
                }
                
                if(mouseIsPressed && frameCount - this.lastPressed > 30 &&
                   mouseX >= this.x+bs*x+padd/2 && mouseX < this.x+bs*x-padd/2+bs &&
                   mouseY >= this.y+bs*y+padd/2 && mouseY < this.y+bs*y-padd/2+bs){
                    
                    if(c==this.cells.length){
                        cta = new Chip("custom",inputSwitches.length,outputSwitches.length);
                        
                        for(b=0;b<inputSwitches.length;b++)
                            inputSwitches[b].state = 0;
                                                
                        for(pee=0;pee<pow(2,cta.iNum);pee++){
                            
                            decimal = pee;
                            binary = [];
                            while (decimal > 0) {
                                if (decimal & 1) {
                                    binary.push(1);
                                } else {
                                    binary.push(0);
                                }
                                decimal = decimal >> 1;
                            }
                            for(b=0;b<binary.length;b++){
                                
                                inputSwitches[b].state = binary[b];
                            }
                            
                            //update circuitry
                            for(poo=0;poo<20;poo++){
                                for(b=0;b<wires.length;b++){
                                    
                                    wires[b].show();
                                }
                                for(r=0;r<circuitry.length;r++){
                                    
                                    circuitry[r].show();
                                }
                            }
                            
                            cta.truthTable[pee] = [];
                            
                            for(b=0;b<outputSwitches.length;b++){
                                
                                cta.truthTable[pee][b] = outputSwitches[b].state;
                            }
                        }
                        
                        console.log(cta.truthTable);
                        
                        for(b=0;b<inputSwitches.length;b++)
                            inputSwitches[b].state = 0;
                        
                        wires = [];
                        circuitry = [];
                        
                        for(b=0;b<outputSwitches.length;b++)
                            outputSwitches[b].connected = 0;
                        for(b=0;b<outputSwitches.length;b++)
                            outputSwitches[b].state = 0;
                        
                        this.cells.push(cta);
                    }
                    else{
                        
                        cursorMode = 2;
                        wireToAdd = null;
                        
                        if(c!=3){
                            chipToAdd = {...this.cells[c]};
                            chipToAdd.inputs = [];
                            chipToAdd.outputs = [];
                            for(p=0;p<chipToAdd.iNum;p++)
                                chipToAdd.inputs[p] = new Pin(0);
                            for(p=0;p<chipToAdd.oNum;p++)
                                chipToAdd.outputs[p] = new Pin(1);
                        }
                        else{ //register
                            chipToAdd = {...this.cells[c]};
                            chipToAdd.memory = Array(chipToAdd.memSize).fill(0);;
                            chipToAdd.inputs = [];
                            chipToAdd.outputs = [];
                            for(p=0;p<chipToAdd.memSize+2;p++)
                                chipToAdd.inputs[p] = new Pin(0);
                            for(p=0;p<chipToAdd.memSize;p++)
                                chipToAdd.outputs[p] = new Pin(1);
                        }
                        
                        
                    }
                    
                    this.lastPressed = frameCount;
                }
                
                c++;
            }
            y++;
        }
        
    }
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
var width = 450;
var height = 450;
var bombs = 10;
var boxes = 9;
var dim = 9;
var grid = [];
var buttons=[];
var butSide = 50;
var innoLeft; //non-bomb cells
var flagsLeft=bombs;
var gameOver=false;
var gameStarted=false;

//button class
function Button(x,y,side,val, active){
		this.x=x;
		this.y=y;
		this.side=side;
		this.val=val;
		this.active=active;
		this.flagged = false;
}

function onLoad(){
	innoLeft=dim*dim-bombs;
	document.getElementById("flags").innerHTML="Japans left: "+flagsLeft;
	drawLines();
	makeGrid();
	makeButtons();
	// placeBombs();
	// placeNumbers();
	printGrid(); 
	
	// makeButtons();
	//printButtons();
	//drawButtons();
	//drawGrid();
}


//draw grid lines
function drawLines(){
	// first vertical
	for(let ver = butSide; ver<width; ver+=butSide){
		drawLine(ver,0,ver,height);
		drawLine(0,ver,width,ver);
	}
	
	
	
}
//draw  grid line
function drawLine(xF, yF, xT, yT){
	ctx.beginPath();
	ctx.moveTo(xF,yF);
	ctx.lineTo(xT,yT);
	ctx.stroke();
}

//draw the grid
function drawGrid(){
	let px = 20;
	for(let r = 1; r <=dim; r++){
		for(let c = 1; c<=dim; c++){
			if(grid[r][c]!=0){
				ctx.font = "30px arial";
				if(grid[r][c]!='x')
					ctx.fillStyle="black";
				else ctx.fillStyle="red";
				ctx.fillText(grid[r][c],(2*r-1)*25-px/2,(2*c-1)*25+px/2);
			}
			else{
				let but = buttons[r][c];
				console.log("but: "+but.x+"grid: "+grid[r][c]);
				ctx.beginPath();
				ctx.fillStyle="gray";
				ctx.rect(but.x,but.y,but.side,but.side);
				ctx.fill();
			}
		}
	}
}

function makeButtons(){
	buttons=[]
	let butRow=[];
	//outter top
	for(let d =0;d<dim+2;d++)
		butRow.push(new Button(-1,-1,-1,-1,false));
	buttons.push(butRow);
	
	//in between
	for(let r = 1; r <=dim; r++){
		butRow=[new Button(-1,-1,-1,-1,false)];
		for(let c = 1; c<=dim; c++){
			butRow.push(new Button((r-1)*butSide,(c-1)*butSide,butSide,grid[r][c],false));
		}
		butRow.push(new Button(-1,-1,-1,-1,false));
		buttons.push(butRow);
	}
	
	//outter bottom
	for(let d =0;d<dim+2;d++)
		butRow.push(new Button(-1,-1,-1,-1,false));
	buttons.push(butRow);
}

//draw all cells
function drawButtons(){
	let col = "white";
	let but;
	for(let x = 0;x < dim; x++){
		for(let y = 0; y<dim; y++){
			but = buttons[x][y];
			if(but.val==1)
				col="blue";
			else if(but.val==2)
				col="yellow";
			else
				col="red";
			ctx.beginPath();
			ctx.rect(but.x,but.y,but.side,but.side);
			ctx.fillStyle=col;
			ctx.fill();
			ctx.stroke();
		}
		
	}
}

//draw number depending on how many bombs are near
function drawNumber(bX, bY,recall){
	ctx.font = "30px arial";
	ctx.fillStyle="black";
	let but = buttons[bX][bY];
	if(but.val==-1)
		return;
	if(but.val=='x' && recall)
		return; 
	if(!but.active && !but.flagged){

		innoLeft--;
		if(but.val!=0)
			ctx.fillText(but.val,but.x+but.side/2-10, but.y+but.side/2+10);
		else{
			ctx.beginPath();
			ctx.fillStyle="gray"; //color for unselected area
			ctx.rect(but.x,but.y,but.side,but.side);
			ctx.fill();
		}
		but.active=true;
		if(but.val==0){
			for(let c = bY-1; c<bY+2; c++){
				for(let r = bX-1; r<bX+2; r++){
					if(r!=bX || c!=bY)
						drawNumber(r,c,true);
				}
			}
		}
	}
}




function restart(){
	
	document.location.reload();
}


//THIS IS FINE
//cell click function
//left button to select, right button to place flag
function boom(event){
	if(!gameOver){
		event.preventDefault();

		let x = event.clientX-9;
		let y = event.clientY-87-7;
		
		// if(!gameStarted){
			// for(let bX = 1; bX<=dim; bX++){
				// for(let bY=1; bY<=dim; bY++){
					// if(buttonClicked(x,y,bX,bY)){
						// placeBombs(bX,bY);
						// placeNumbers();
						// printGrid();
						// printButtons();
						
					// }
				// }
			// }
			// makeButtons();
			// gameStarted=true;
		// }
		
			for(let bX = 1; bX<=dim; bX++){
				for(let bY=1; bY<=dim; bY++){
					if(buttonClicked(x,y,bX,bY)){
						let val = buttons[bX][bY].val;
						if(event.button==0 && !buttons[bX][bY].flagged){//left button
							if(!gameStarted){
								for(let bX = 1; bX<=dim; bX++){
									for(let bY=1; bY<=dim; bY++){
										if(buttonClicked(x,y,bX,bY)){

											placeBombs(bX,bY);
											placeNumbers();
											printGrid();
											printButtons();
											
										}
									}
								}
								makeButtons();
								gameStarted=true;
							}
						
							if(val == 'x'){
								alert("BOOM");
								gameOver=true;
								clearFlags();
								drawGrid();
								return;
							}
							drawNumber(bX,bY,false);
							break;
						}
						else if(event.button==2){
							putFlag(bX,bY);
							break;
						}
					}
				}
					
			}	
			checkWin();
		}
	
}

//place flag on cell
function putFlag(x,y){

	let but = buttons[x][y];
	if(!but.flagged && !but.active){
		ctx.beginPath()
		ctx.arc(but.x+but.side/2,but.y+but.side/2,10,0,2*Math.PI);
		ctx.fillStyle="red";
		ctx.fill();
		but.flagged=true;
		flagsLeft--;
	}
	else if(!but.active){
		ctx.clearRect(but.x+10,but.y+10,but.side-20,but.side-20);
		but.flagged=false;
		flagsLeft++;
	}
	document.getElementById("flags").innerHTML='<span  style = "color: black">Japans left: '+flagsLeft+" </span>";
	if(flagsLeft<0)
		document.getElementById("flags").innerHTML='<span style = "color: black">Japans left: </span>'+'<span style = "color: red;font-style:italic">'+flagsLeft+"</span>";
}

//clear all flags
function clearFlags(){
	for(let r=1;r<dim+2;r++){
		for(let c=1;c<dim+2;c++){
			let but = buttons[r][c];
			if(but.flagged){
				ctx.clearRect(but.x+10,but.y+10,but.side-20,but.side-20);
				but.flagged=false;
			}
		}
	}
}

//check if a button has been clicked
function buttonClicked(mouseX, mouseY, bX, bY){
	but = buttons[bX][bY];
	let butX = but.x;
	let butY = but.y;
	let butSide = but.side;
	
	if( ((mouseX >= butX) && (mouseX < butX+butSide) ) &&
		((mouseY >= butY) && (mouseY < butY+butSide) )
	) {console.log(mouseX,mouseY );return true;}
	
	return false;
}

//place bombs in random positions
function placeBombs(x,y){
	
	for(let i=0;i<bombs;i++){
		let pos;
		do{
			pos = randomPosition();
		}while(bombInPosition(pos) || (pos[0]==x && pos[1]==y));

		grid[pos[0]][pos[1]] = 'x';
	}
}

//check if bomb is in given position
function bombInPosition(pos){
	if(grid[pos[0]][pos[1]]!=0)
		return true;
	return false;
}

//create the grid
function makeGrid(){
		let dummy =[];
		for(let d=0;d<dim+2;d++)
			dummy.push(-1)
		grid.push();
		
		for(let col = 1; col<dim+2; col++){
			dummy=[-1];
			for(let row = 1; row<dim+2; row++){				
					dummy.push(0);
			}
			
			dummy.push(-1);
			grid.push(dummy);
		}
		dummy=[];
		for(let d=0;d<dim+2;d++)
			dummy.push(-1)
		grid.push(dummy);
}

//place numbers depending on where the bombs are
function placeNumbers(){
	
	for(let col = 1; col<dim+1; col++){
			for(let row = 1; row<dim+1; row++){
					if(grid[row][col]==0){
						bNb = bombsNearby(row,col);
						grid[row][col]=bNb;
					}
			}
		}
	
	
}

//check how many bombs are near the given cell
function bombsNearby(row, col){
	let b = 0;
	for(let r = row-1; r <=row+1; r++){
		for(let c = col-1; c<=col+1; c++){
			if(grid[r][c]=='x')
				b++;
		}
	}
	return b;
}


//return a random position
function randomPosition(){
	let row = Math.floor(Math.random()*(bombs-1))+1; 
	let col = Math.floor(Math.random()*(bombs-1))+1; 
	
	return [row,col];
}


function printGrid(){
	for(let c = 1; c<dim+1; c++){
		console.log(grid[1][c]+" "+grid[2][c]+" "+grid[3][c]+" "+grid[4][c]+" "+grid[5][c]+" "+grid[6][c]+" "+grid[7][c]+" "+grid[8][c]+" "+grid[9][c]);
	}
}

function printButtons(){
	for(let c = 1; c<dim+1; c++){
		console.log(buttons[1][c].val+" "+buttons[2][c].val+" "+buttons[3][c].val+" "+buttons[4][c].val+" "+buttons[5][c].val+" "+buttons[6][c].val+" "+buttons[7][c].val+" "+buttons[8][c].val+" "+buttons[9][c].val);
	}
}

//check if player won
function checkWin(){

	if(innoLeft==0){
		alert("You Win!");
		clearFlags();
		drawGrid();
		gameOver=true;
	}
}

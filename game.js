var cvs = document.createElement("canvas");
var ctx = cvs.getContext("2d");
var imagePath = "image/"
var soundPath = "sound/"
cvs.width = window.innerWidth -15;
cvs.height = window.innerHeight - 20;
var pipeBottomResurse = imagePath+"flappy_bird_pipeBottom.png";
var pipeUpResurse = imagePath+"flappy_bird_pipeUp.png";
var birdResurse = imagePath+"flappy_bird_bird.png";
var fg = imagePath+"flappy_bird_fg.png"
var bg = imagePath+"flappy_bird_bg.png"
var time;
var timePipeAdd = 
document.body.appendChild(cvs);
window.resources.load([
    birdResurse,
    bg,
    fg,
	pipeBottomResurse,
	pipeUpResurse
]);

function PipeBottom(height, y) {
	var time = new Date().getTime();
	this.sprite = pipeBottomResurse;
	this.remove  = false;
	this.width = window.resources.get(this.sprite).width;
	this.height = height;
	this.x = cvs.width;
	this.y = y;
	this.lastCheckTime = time;
	this.lastUpdateTime = time;
	this.incX = function(inc){
		this.x += inc;
	}
	this.render = function() {
		ctx.drawImage(window.resources.get(this.sprite), this.x, this.y, this.width, this.height);
	}

	this.getPosX = function() {
		return this.x + this.width;
	}

	this.getPosY = function() {
		return this.y;
	}
}

function PipeUp(height, y) {
	var time = new Date().getTime();
	this.sprite = pipeUpResurse;
	this.remove  = false;
	this.width = window.resources.get(this.sprite).width;
	this.height = height;
	this.x = cvs.width;
	this.y = y;
	this.lastCheckTime = time;
	this.lastUpdateTime = time;
	this.incX = function(inc){
		this.x += inc;
	}
	this.render = function() {
		ctx.drawImage(window.resources.get(this.sprite), this.x, this.y, this.width, this.height);
	}

	this.getPosX = function() {
		return this.x + this.width;
	}

	this.getPosY = function() {
		return this.height;
	}
}

function Bird() {
	var bgClassObject = new BgClass();
	this.sprite = birdResurse;
	this.grav = 1;
	this.width = window.resources.get(birdResurse).width;
	this.height = window.resources.get(birdResurse).height;
	this.x = 10;
	this.y = Math.ceil(bgClassObject.height * 0,5);
	this.incY = function(inc) {
		this.y += inc;
	}
	this.getPosX = function() {
		return this.x + this.width;
	}
	this.getPosY = function() {
		return this.y + this.height;
	}
	this.render = function() {
		ctx.drawImage(window.resources.get(this.sprite), this.x, this.y);
	}
	this.setGrav = function() {
		this.y += this.grav;
	}
}


function Let() {
	var gap = 200;
	var bgObject = new BgClass(); 
	var indent = bgObject.height - gap;
	var gapPoint = Math.floor(Math.random() * indent);
	this.pipeUp = new PipeUp(gapPoint, 0);
	this.pipeBottom = new PipeBottom(bgObject.height - gap - gapPoint, gapPoint+gap); 
	this.get = function () {
		return {
			pipeUp : this.pipeUp,
			pipeBottom : this.pipeBottom
		}
	}
}

function RenderScene() {
	var fgObjectImage = window.resources.get(fg);
	var bgObjectImage = window.resources.get(bg);
	var bgHieght = cvs.height - fgObjectImage.height
	var bgImageWidth = Math.floor(cvs.width / bgObjectImage.width);
	var fgImageWidth = Math.floor(cvs.width / fgObjectImage.width);
	var yFg = bgHieght;
	var xBg = 0;
	
	for(i = 0; i <= bgImageWidth; i++) {
		ctx.drawImage(bgObjectImage, x1, 0, bgObjectImage.width, bgHieght);
		xBg += bgObjectImage.width
	}
	for (i = 0; i <= fgImageWidth; i++) {
		ctx.drawImage(fg, x2, yFg);
		xFg += fgObjectImage.width
	} 
}

function checkCollision (pipeBottom, pipeUp, bird) {
	var posBirdX = bird.getPosX();
	var posBirdY = bird.getPosY();
	var fgObject = new FgClass();
	if(
		posBirdX >= pipeUp.x
		&& posBirdX <= pipeUp.getPosX()
		&& (
			posBirdY <= pipeUp.getPosY() || posBirdY >= pipeBottom.getPosY() 
		) 
		|| posBirdY >= cvs.height - fgObject.height
	) {
		console.log('end');
		location.reload();
	}
}

function FgClass() {
	this.width = 0; 
	this.height = (cvs.height * 0.2);
	this.x = 0;
	this.y = cvs.height - this.height;
	this.render = function() {
		var fgObjectImage = window.resources.get(fg);
		fgImageWidth = Math.floor(cvs.width / fgObjectImage.width);
		for(i = 0; i <= fgImageWidth; i++) {
			ctx.drawImage(fgObjectImage, this.width, this.y, fgObjectImage.width, this.height);
			this.width += fgObjectImage.width
		}
		this.width = 0;
	}
}

function BgClass() {
	this.width = 0; 
	this.height = cvs.height * 0.8;
	this.x = 0;
	this.y = 0;
	this.render = function() {
		var bgObjectImage = window.resources.get(bg);
		bgImageWidth = Math.floor(cvs.width / bgObjectImage.width)
		for(i = 0; i <= bgImageWidth; i++) {
			ctx.drawImage(bgObjectImage, this.width, 0, bgObjectImage.width, this.height);
			this.width += bgObjectImage.width -1
		}
		this.width = 0;
	}
}



function init() {
	var fgObject = new FgClass();
	var bgObject = new BgClass();
	var letClass = new Let(); 
	var pipes = [];
	pipes[0] = letClass.get();
	var birdClass = new Bird();
	document.addEventListener("keydown", function(){
		birdClass.y -= 25;
	});
	var firstCurrentPipeIndex = -1
	var firstCurrentPipe = cvs.width;
	var timeCount = 0;
	time = new Date().getTime();
	var prevPipeX = -1;
	function game() {
		requestAnimationFrame(game);
		var now = new Date().getTime(),
        dt = now - (time || now);
        time = now;
		fgObject.render();
		bgObject.render();
		birdClass.render();
		var lenghtPipes =  pipes.length;
		for(var i = 0; i < lenghtPipes; i++) {
			var checkPipe
			if (pipes.length === 1) {
				checkPipe = pipes[0];
			} else {
				checkPipe = pipes[pipes.length - 1];                                  
			}
			if (now - checkPipe.pipeUp.lastCheckTime > 1000) {
				checkPipe.pipeUp.lastCheckTime = new Date().getTime();
				if (prevPipeX === -1) {
					prevPipeX = checkPipe.pipeUp.x;
				}
				if (prevPipeX - checkPipe.pipeUp.x > 400) {
					checkPipe.pipeUp.lastCheckTime = new Date().getTime();
					checkPipe.pipeBottom.lastCheckTime = new Date().getTime();
					pipes.push((new Let()).get());
					prevPipeX = cvs.width;
				}
			}
			if (i in pipes) {
				if ( 'pipeUp' in pipes[i] && 'pipeBottom' in pipes[i] && pipes[i].pipeUp.x > -pipes[i].pipeUp.width && pipes[i].pipeBottom.x > -pipes[i].pipeUp.width) {
					pipes[i].pipeUp.render();
					pipes[i].pipeBottom.render();
					pipes[i].pipeUp.x-=1;
					pipes[i].pipeBottom.x-=1;
					checkCollision(pipes[i].pipeBottom, pipes[i].pipeUp, birdClass);
				} else if ('pipeUp' in pipes[i] && 'pipeBottom' in pipes[i]) {
					delete pipes[i].pipeUp
					delete pipes[i].pipeBottom
				} else if (Object.entries(pipes[i]).length === 0) {
					delete pipes[i]
				}
			}
		}
		birdClass.setGrav();
	}
	game();
}
window.resources.onReady(init);

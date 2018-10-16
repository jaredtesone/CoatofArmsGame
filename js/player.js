var tapTime = 500;
var tapMoveLimit = 5;
var doubleTapTime = 500;
var tap = false;
//var tapped = false;
var doubleTap = false;
var chargeTime = 2000;
/*var swipe = false;
var hold = false;
var drag = false;*/
//var startPoint = new Phaser.Point(-1, -1);
//var endPoint = new Phaser.Point(-1, -1);
var destPoint = new Phaser.Point(-1, -1);
var nullPoint = new Phaser.Point(-1, -1);
var startPos = new Phaser.Point(-1, -1);
var playerSpeed = 150;
var touch;
var previousTap = -1;
var dodgeStart = -1;
var dodgeMult = 1;
var dodge = 200;
var dodgeCt = 0;
var resetCt = 0;
var pressCt = 0;
var relCt = 0;
var posUp;
var posDown;
//var firstClick = true;

let Player = function (x, y, skin, shield) {
	Phaser.Sprite.call(this, game, x, y, skin);
	//game.physics.arcade.enable(this);
	game.add.existing(this);

	game.input.maxPointers = 1;
	this.pointer = game.input.activePointer;
	//touch = this.pointer.leftButton;
	this.swipeDir = 0;
	this.swipeAngle = 0;
	this.startPoint = new Phaser.Point(-1, -1);
	this.endPoint = new Phaser.Point(-1, -1);
	this.swipe = false;
	this.hold = false;
	this.drag = false;
	this.pointerCross = false;
	this.swipeCt = 0;
	this.dragCt = 0;
	this.hp = 100;
	this.alive = true;
	this.shieldCharge = 0;
	this.hasShield = shield;
	this.cameraPt = new Phaser.Point(-1, -1);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);

Player.prototype.constructor = Player; 

Player.prototype.update = function() {
	this.movement();
};

Player.prototype.movement = function() {
	if (!this.alive)
		return;
	//stop moving if at destination
	if (samePoint(destPoint, nullPoint) || samePoint(this.body.position, destPoint, 5) || !(tap || doubleTap)) {
		this.body.velocity.x = 0;
		this.body.velocity.y = 0;
	} else {
		//continue moving toward destination
		let velox = (destPoint.x - this.body.x) / getDist(this.body.position, destPoint);
		let veloy = (destPoint.y - this.body.y) / getDist(this.body.position, destPoint);
		let velot = game.math.distance(0, 0, velox*velox, veloy*veloy);
		this.body.velocity.x = velox * dodgeMult * (playerSpeed/velot);
		this.body.velocity.y = veloy * dodgeMult * (playerSpeed/velot);
	}

	if (!this.swipe && !this.drag)
		this.swipeDir = 0;

	touch = this.pointer.leftButton;
	if (touch.justPressed()) {
		//get initial location of tap
		//console.log("justPressed");
		//console.log("Start: (" + this.startPoint.x + "," + this.startPoint.y + ")");	
		relCt = 0;
		if (pressCt === 0) {
			console.log("first click");
			//firstClick = true;
			this.startPoint = screenToWorld(this.pointer.position);
			posUp = this.pointer.position;
		} else
			posUp = this.pointer.positionUp;
		//posUp = this.pointer.positionUp;
		/*else {
			let posUp = this.pointer.positionUp;
			this.cameraPt = new Phaser.Point(game.camera.x, game.camera.y);
			this.startPoint = new Phaser.Point(this.pointer.positionUp.x + this.cameraPt.x, this.pointer.positionUp.y + this.cameraPt.y);
		}*/
		//this.startPoint = screenToWorld(this.pointer.positionUp);
		console.log("Start: (" + this.startPoint.x + "," + this.startPoint.y + ")");		
		//console.log("PositionUp: (" + this.pointer.positionUp.x + "," + this.pointer.positionUp.y + ")");
		//console.log(game.camera.x);
		if (resetCt === 0) {
			this.pointerCross = false;
			resetCt++;
		}
		pressCt++;
	}
	//touch input
	if (touch.justReleased()) {
		pressCt = 0;
		//swipe = hold = drag = false;
		//get final location of tap
		//this.endPoint = screenToWorld(this.pointer.positionDown);
		if (relCt === 0) {
			this.endPoint = screenToWorld(this.pointer.position);
			posDown = this.pointer.position;
		}
		posDown = this.pointer.positionDown;
		console.log("End: (" + this.endPoint.x + "," + this.endPoint.y + ")");
		var movDist = getDist(this.startPoint, this.endPoint);
		resetCt = 0;

		//check for tap or swipe
		if (touch.timeUp - touch.timeDown <= tapTime) {
			/*if (destPoint !== nullPoint && (!doubleTap || !tap))
				destPoint = this.body.position;*/
			//check for tap
			//if (movDist >= 0 && movDist < tapMoveLimit) {
				console.log(getDist(posUp, posDown));
				if (getDist(posUp, posDown) >= 0 && getDist(posUp, posDown) < tapMoveLimit) {
					//check for double tap
					this.hold = this.drag = false;
					if ((previousTap > 0 && (touch.timeDown - previousTap > 0 && touch.timeDown - previousTap <= doubleTapTime)) || doubleTap) {
						//double tap
						if (dodgeCt < 1) {
							startPos = this.body.position;
							console.log("dodgeCt is 0");
							if (this.startPoint.y > startPos.y + 200)
								destPoint = new Phaser.Point(startPos.x, startPos.y + dodge);
							else if (this.startPoint.y < startPos.y - 200)
								destPoint = startPos;
							else if (this.startPoint.x > startPos.x)
								destPoint = new Phaser.Point(startPos.x + dodge, startPos.y);
							else if (this.startPoint.x < startPos.x)
								destPoint = new Phaser.Point(startPos.x - dodge, startPos.y);
						}
						//console.log(dodgeCt);
						//console.log("(" + startPos.x + ", " + startPos.y + ")");
						//console.log("(" + this.body.x + ", " + this.body.y + ")");
						dodgeCt++;
						this.swipeCt = this.dragCt = 0;
						doubleTap = tap = true;
						this.swipe = false;
						console.log("double tap");
						/*if (startPoint.y > startPos.y)
							destPoint = new Phaser.Point(startPos.x, startPos.y + dodge);
						else if (startPoint.y < startPos.y - 100)
							destPoint = startPos;
						else if (startPoint.x > startPos.x)
							destPoint = new Phaser.Point(startPos.x + dodge, startPos.y);
						else if (startPoint.x < startPos.x)
							destPoint = new Phaser.Point(startPos.x - dodge, startPos.y);*/						
						dodgeMult = 2;
						console.log("(" + destPoint.x + ", " + destPoint.y + ")");
					} else {	//single tap
						doubleTap = this.swipe = false;
						dodgeCt = this.swipeCt = this.dragCt = 0;
						tap = true;
						console.log("tap");
						destPoint = this.startPoint;
						dodgeMult = 1;
					}
					previousTap = touch.timeUp;
				//}
			} else {	//swipe
				dodgeCt = this.dragCt = 0;
				tap = doubleTap = false;
				//if (swipeCt === 0) {
				this.swipe = true;
				console.log("swipe");
				//}
				//swipeCt++;
				//get swipe vector
				this.swipeAngle = game.math.angleBetweenPoints(this.startPoint, this.endPoint);
			}
		} else {
			this.swipe = tap = doubleTap = false;
			dodgeCt = this.swipeCt = this.dragCt = 0;
			if (movDist >= 0 && movDist < tapMoveLimit) {
				//tap and hold
				this.hold = true;
				this.drag = false;
				console.log("hold");
			} else {
				//tap and drag
				this.drag = true;
				this.hold = false;
				if (this.hasShield)
					this.shieldCharge = ((touch.timeUp - touch.timeDown) / 2000);
				console.log("drag");
			}
		}
		relCt++;
	} else {
		this.swipe = doubleTap = false;
		dodgeCt = this.swipeCt = this.dragCt = 0;
	}
	/*if (this.cursors.left.isDown && !this.cursors.right.isDown) {
		this.player.body.velocity.x = -150;
		this.player.animations.play("left");
	} else if (this.cursors.right.isDown && !this.cursors.left.isDown) {
		this.player.body.velocity.x = 150;
		this.player.animations.play("right");
	} else {
		this.player.animations.stop();
		this.player.frame = 4;
	}

	if (this.cursors.up.isDown && this.player.body.touching.down) {
		this.player.body.velocity.y = -350;
	}*/
	
};

function getDist(point1, point2) {
	if (samePoint(point1, nullPoint) || samePoint(point2, nullPoint))
		return -1;
	return game.math.distance(point1.x, point1.y, point2.x, point2.y);
};

function samePoint(point1, point2, epsilon) {
	return (game.math.fuzzyEqual(point1.x, point2.x, epsilon) && game.math.fuzzyEqual(point1.y, point2.y, epsilon));
};

function worldToScreen(point) {
	let newPt = new Phaser.Point(point.x - game.camera.x, point.y - game.camera.y);
  	return newPt;
};


function screenToWorld(point) {
	let newPt = new Phaser.Point(point.x + game.camera.x, point.y + game.camera.y);
  	return newPt;
};
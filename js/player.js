var tapTime = 500;
var tapMoveLimit = 5;
var doubleTapTime = 500;
var tap = false;
var tapped = false;
var doubleTap = false;
var swipe = false;
var hold = false;
var drag = false;
var startPoint = new Phaser.Point(-1, -1);
var endPoint = new Phaser.Point(-1, -1);
var destPoint = new Phaser.Point(-1, -1);
var nullPoint = new Phaser.Point(-1, -1);
var playerSpeed = 150;
var pointer;
var touch;
var previousTap = -1;
var dodgeStart = -1;
var dodgeMult = 1;
var dodge = 400;

let Player = function (x, y, skin) {
	Phaser.Sprite.call(this, game, x, y, skin);
	//player = game.add.sprite(x, y, skin);
	//game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.arcade.enable(this);
	game.add.existing(this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);

Player.prototype.constructor = Player; 

Player.prototype.update = function() {
	this.movement();
};

Player.prototype.movement = function() {
	game.input.maxPointers = 1;
	pointer = game.input.activePointer;
	touch = pointer.leftButton;

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

	if (touch.justPressed()) {
		//get initial location of tap
		startPoint = pointer.positionUp;
	}
	//touch input
	if (touch.justReleased()) {
		swipe = hold = drag = false;
		//get final location of tap
		endPoint = pointer.positionDown;
		var movDist = getDist(startPoint, endPoint);

		//check for tap or swipe
		if (touch.timeUp - touch.timeDown <= tapTime) {
			if (destPoint !== nullPoint)
				destPoint = this.body.position;
			//check for tap
			if (movDist >= 0 && movDist < tapMoveLimit) {
				//check for double tap: properly finds double tap but then overwrites double tap as single tap
				if ((previousTap > 0 && (touch.timeDown - previousTap > 0 && touch.timeDown - previousTap <= doubleTapTime)) || doubleTap) {
					//double tap
					doubleTap = true;
					tap = false;
					console.log("double tap");
					if (startPoint.y > this.body.y)
						destPoint = new Phaser.Point(this.body.x, this.body.y + dodge);
					else if (startPoint.y < this.body.y - 100)
						destPoint = this.body.position;
					else if (startPoint.x > this.body.x)
						destPoint = new Phaser.Point(this.body.x + dodge, this.body.y);
					else if (startPoint.x < this.body.x)
						destPoint = new Phaser.Point(this.body.x - dodge, this.body.y);						
					dodgeMult = 2;
					//console.log("(" + destPoint.x + ", " + destPoint.y + ")");
				} else {	//single tap
					doubleTap = false;
					tap = true;
					console.log("tap");
					destPoint = startPoint;
					dodgeMult = 1;
				}
				previousTap = touch.timeUp;
			} else {	//swipe
				tap = doubleTap = false;
				swipe = true;
				console.log("swipe");
				//get swipe vector
			}
		} else {
			tap = doubleTap = false;
			if (movDist >= 0 && movDist < tapMoveLimit) {
				//tap and hold
				hold = true;
				console.log("hold");
			} else {
				//tap and drag
				drag = true;
				console.log("drag");
			}
		}
	} else {
		doubleTap = false;
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
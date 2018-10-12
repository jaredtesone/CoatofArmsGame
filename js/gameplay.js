var tapTime = 500;
var tapMoveLimit = 5;
var tap = false;
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



// gameState constructor
let gameplayState = function() {
	this.score = 0;
};

gameplayState.prototype.create = function() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.input.maxPointers = 1;
	pointer = game.input.activePointer;
	touch = pointer.leftButton;


	game.add.sprite(0, 0, "sky");
	/*this.platforms = game.add.group();
	this.platforms.enableBody = true;

	let ground = this.platforms.create(0, game.world.height - 64, "platform");
	ground.scale.set(2, 2);
	ground.body.immovable = true;
	//game.physics.arcade.enable(this.ground);*/

	this.player = game.add.sprite(1218, 562, "player");
	game.physics.arcade.enable(this.player);

	//this.player.body.bounce.y = 0.2;
	//this.player.body.gravity.y = 300;
	this.player.body.collideWorldBounds = true;

	this.player.animations.add("left", [0, 1, 2, 3], 10, true);
	this.player.animations.add("right", [5, 6, 7, 8], 10, true);

	//this.cursors = game.input.keyboard.createCursorKeys();
};

gameplayState.prototype.update = function() {
	//game.physics.arcade.collide(this.player, this.platforms);

	//stop moving if at destination
	//console.log(destPoint === nullPoint);
	if (samePoint(destPoint, nullPoint) || samePoint(this.player.body.position, destPoint, 5)) {
		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;
	} else {
		//continue moving toward destination
		let velox = (destPoint.x - this.player.body.x) / getDist(this.player.body.position, destPoint);
		let veloy = (destPoint.y - this.player.body.y) / getDist(this.player.body.position, destPoint);
		let velot = game.math.distance(0, 0, velox*velox, veloy*veloy);
		this.player.body.velocity.x = velox * (playerSpeed/velot);
		this.player.body.velocity.y = veloy * (playerSpeed/velot);
	}

	if (touch.justPressed()) {
		//get initial location of tap
		startPoint = pointer.positionUp;
	}
	//touch input
	if (touch.justReleased()) {
		tap = doubleTap = swipe = hold = drag = false;
		//get final location of tap
		endPoint = pointer.positionDown;
		var movDist = getDist(startPoint, endPoint);

		//check for tap or swipe
		if (touch.timeUp - touch.timeDown <= tapTime) {
			if (destPoint !== nullPoint)
				destPoint = this.player.body.position;
			//check for tap
			if (movDist >= 0 && movDist < tapMoveLimit) {
				//check for double tap: properly finds double tap but then overwrites double tap as single tap
				console.log(touch.timeDown - previousTap);
				if (previousTap > 0 && (touch.timeDown - previousTap > 0 && touch.timeDown - previousTap <= tapTime)) {
					//double tap
					doubleTap = true;
					console.log("double tap");
				} else {	//single tap
					tap = true;
					console.log("tap");
					destPoint = startPoint;
					previousTap = touch.timeUp;
				}
			} else {	//swipe
				swipe = true;
				console.log("swipe");
				//get swipe vector
			}
		} else {
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
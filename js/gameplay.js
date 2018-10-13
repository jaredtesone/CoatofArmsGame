var tapTime = 500;
var tapMoveLimit = 5;
var doubleTapTime = 1000;
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


var hostile = false;
var attack = false;
var following = false;
var hp = 50;
var attackTime = 5;
var betweenAttack = 7;

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

	this.enemy = game.add.sprite(10, 10, "star");
	game.physics.arcade.enable(this.enemy);
	//game.physics.enable(enemy, Phaser.Physics.ARCADE);

	this.enemy.body.collideWorldBounds = true;
	this.enemy.body.velocity.x = 80;
};

gameplayState.prototype.update = function() {
	//game.physics.arcade.collide(this.player, this.platforms);

	//stop moving if at destination
	//console.log(destPoint === nullPoint);
	if (samePoint(destPoint, nullPoint) || samePoint(this.player.body.position, destPoint, 5) || !tap) {
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
		swipe = hold = drag = false;
		//get final location of tap
		endPoint = pointer.positionDown;
		var movDist = getDist(startPoint, endPoint);

		//check for tap or swipe
		//console.log(touch.timeUp - touch.timeDown);
		if (touch.timeUp - touch.timeDown <= tapTime) {
			if (destPoint !== nullPoint)
				destPoint = this.player.body.position;
			//check for tap
			if (movDist >= 0 && movDist < tapMoveLimit) {
				//check for double tap: properly finds double tap but then overwrites double tap as single tap
				console.log(touch.timeDown - previousTap);
				if ((previousTap > 0 && (touch.timeDown - previousTap > 0 && touch.timeDown - previousTap <= doubleTapTime)) || doubleTap) {
					//double tap
					doubleTap = true;
					tap = false;
					console.log("double tap");
				} else {	//single tap
					doubleTap = false;
					tap = true;
					console.log("tap");
					destPoint = startPoint;
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
	if (getDist(this.player.body.position, this.enemy.body.position) < 200){
		following = true;
	}
	if (following === true){
		if (this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0 && getDist(this.player.body.position, this.enemy.body.position) < 50){
			this.enemy.body.velocity.x = 0;
			this.enemy.body.velocity.y = 0;
			attack = true;
		}
		else {
			let enemyVelocityX = (this.player.body.position.x - this.enemy.body.x) / getDist(this.enemy.body.position, this.player.body.position);
			let enemyVelocityY = (this.player.body.position.y - this.enemy.body.y) / getDist(this.enemy.body.position, this.player.body.position);
			let enemyVelocityMult = game.math.distance(0, 0, enemyVelocityX*enemyVelocityX, enemyVelocityY*enemyVelocityY);
			this.enemy.body.velocity.x = enemyVelocityX * (100/enemyVelocityMult);
			this.enemy.body.velocity.y = enemyVelocityY * (100/enemyVelocityMult);
		}

	}
	
};

function getDist(point1, point2) {
	if (samePoint(point1, nullPoint) || samePoint(point2, nullPoint))
		return -1;
	return game.math.distance(point1.x, point1.y, point2.x, point2.y);
};

function samePoint(point1, point2, epsilon) {
	return (game.math.fuzzyEqual(point1.x, point2.x, epsilon) && game.math.fuzzyEqual(point1.y, point2.y, epsilon));
};

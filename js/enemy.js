// JavaScript source code
var hostile = false;
var attack = false;
var attackTime = 40;
var lungeWait = 5;
var retreatWait = 50; 

let Enemy = function (x, y, skin, kind, evil) {
	Phaser.Sprite.call(this, game, x, y, skin);
	game.physics.arcade.enable(this);
	game.add.existing(this);
	this.hp = 50;
	this.damage = 10;
	this.attack = false;
	this.attacking = false;
	this.retreating = false;
	this.lunging = false;
	this.hostile = false;
	this.body.velocity.x = 0;
	this.body.velocity.y = 0;
	this.follow = false;
	this.kind = kind;
	this.lastX = 0;
	this.lastY = 0;
	this.lastVeloX = 0;
	this.lastVeloY = 0;
	this.targeted = false;
	this.alive = true; 
	this.lungeCt = 0;
	this.evil = evil;

	if (this.kind === "dark knight") {
		this.hp = 1000;
		this.damage = 25;
	} else if (this.kind = "bandit") {
		this.animations.add("idleDown", [0], 1, false);
		this.animations.add("idleUp", [12], 1, false);
		this.animations.add("idleRight", [22], 1, false);
		this.animations.add("idleLeft", [45], 1, false);
		this.animations.add("down", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 15, true);
		this.animations.add("up", [13, 14, 15, 16, 17, 18, 19, 20, 21], 15, true);
		this.animations.add("right", [23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33], 15, true);
		this.animations.add("left", [44, 43, 42, 41, 40, 39, 38, 37, 36, 35], 15, true);
		this.hp = 50;
		this.damage = 10;
	}
	else if (this.kind = "king") {
		this.hp = 400;
		this.damage = 50;
	}

};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);

Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
	if (!this.alive || !this.evil)
		return;
	if (this.hostile === true) {
		
		retreatWait--;
		if (retreatWait <= 0) {
			if (retreatWait === 0)
				attackTime = 40;
			if (attackTime === 8 && this.attacking)
				this.attack = true;
			else 
				this.attack = false;

			//initiate lunge
			if (attackTime > 0 && attackTime <= 40 && !this.retreating) {
				this.lunging = true;
				this.body.velocity.x = this.lastVeloX;
				this.body.velocity.y = this.lastVeloY; 
				attackTime--;
			}

			if (attackTime === 0) {
				lungeWait--;
				if (lungeWait <= 0) {
					this.retreat();
				}
			}
		}
	}
	if (this.body.velocity.x === 0 && this.body.velocity.y ===0) {
		this.animations.play("idleDown");
	} else {
		//x dominant
		if (game.math.distance(this.body.velocity.x, 0, 0, 0) >= game.math.distance(0, this.body.velocity.y, 0, 0)) {
			if (this.body.velocity.x > 0) {
				this.animations.play("right");
			} else {
				this.animations.play("left");
			}
		} else {
			if (this.body.velocity.y > 0) {
				this.animations.play("down");
			} else {
				this.animations.play("up");
			}
		}
	}
};

Enemy.prototype.retreat = function() {
	if (!this.alive || !this.evil)
		return;
	this.retreating = true;
	this.body.velocity.x = 0 - this.lastVeloX;
	this.body.velocity.y = 0 - this.lastVeloY;
	this.retreating = true; 
	let lastPos = new Phaser.Point(this.lastX, this.lastY);
	if (samePoint(this.body.position, lastPos, 0.1)) {
		this.retreating = false;
		retreatWait = 50;
		lungeWait = 5;
	}
};

function samePoint(point1, point2, epsilon) {
	return (game.math.fuzzyEqual(point1.x, point2.x, epsilon) && game.math.fuzzyEqual(point1.y, point2.y, epsilon));
};
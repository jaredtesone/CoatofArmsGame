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
// JavaScript source code
var hostile = false;
var attack = false;
var attackTime = 40;
var lungeWait = 5;
var retreatWait = 50; 
//var hp = 50;
//var type;

let Enemy = function (x, y, skin, kind) {
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
	this.body.velocity.x = 50;
	this.follow = false;
	this.kind = kind;
	this.lastX = 0;
	this.lastY = 0;
	this.lastVeloX = 0;
	this.lastVeloY = 0;
	this.targeted = false;
	this.alive = true; 
	this.lungeCt = 0;
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);

Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
	if (!this.alive)
		return;
	//this.retreating = false;
	if (this.hostile === true) {
		
		retreatWait--;
		//console.log(retreatWait);
		if (retreatWait <= 0) {
			//console.log(betweenAttack);
			if (retreatWait === 0)
				attackTime = 40;
			///	console.log("Reset");
			if (attackTime === 8 && this.attacking)
				this.attack = true;
			else 
				this.attack = false;
			//console.log(this.attack);
			
			//console.log(attackTime);
			//initiate lunge
			if (attackTime > 0 && attackTime <= 40 && !this.retreating) {
				console.log("lunge");
				this.lunging = true;
				//this.lungeCt++;
				this.body.velocity.x = this.lastVeloX;
				this.body.velocity.y = this.lastVeloY; 
				attackTime--;
			}
			//this.body.velocity.x = this.lastVeloX;
			//this.body.velocity.y = this.lastVeloY; 
			if (attackTime === 0) {
				//this.attack = false;
				lungeWait--;
				if (lungeWait <= 0) {
					this.retreat();
				}
				//if (this.lastX > 0 && this.lastY > 0) {
				//this.retreat();
				/*else
					this.retreating = false;*/
				//attackTime = 8;
			} /*else
				this.retreating = false;*/
			//console.log(this.retreating);
		}
	}
};

Enemy.prototype.retreat = function() {
	if (!this.alive)
		return;
	console.log("retreat");
	this.retreating = true;
	this.body.velocity.x = 0 - this.lastVeloX;
	this.body.velocity.y = 0 - this.lastVeloY;
	this.retreating = true; 
	//console.log(this.body.velocity.x);
	let lastPos = new Phaser.Point(this.lastX, this.lastY);
	if (samePoint(this.body.position, lastPos, 0.1)) {
		//this.body.velocity.x = 0;
		//this.body.velocity.y = 0;
		//console.log(this.body.velocity.x);
		this.retreating = false;
		retreatWait = 50;
		lungeWait = 5;
	}
	//this.retreating = true;
	//console.log(this.retreating);
	//attackTime = 5;
	//return 0;
};

function samePoint(point1, point2, epsilon) {
	return (game.math.fuzzyEqual(point1.x, point2.x, epsilon) && game.math.fuzzyEqual(point1.y, point2.y, epsilon));
};
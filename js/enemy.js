// JavaScript source code
var hostile = false;
var attack = false;
var attackTime = 8;
var betweenAttack = 12;
//var hp = 50;
//var type;

let Enemy = function (x, y, skin, kind) {
	Phaser.Sprite.call(this, game, x, y, skin);
	game.physics.arcade.enable(this);
	game.add.existing(this);
	this.hp = 50;
	this.damage = 5;
	this.attack = false;
	this.attacking = false;
	this.retreating = false;
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
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);

Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
	if (!this.alive)
		return;
	//this.retreating = false;
	if (this.hostile === true) {
		betweenAttack--;
		if (betweenAttack <= 0) {
			//console.log(betweenAttack);
			if (betweenAttack === 0)
				attackTime = 8;
			if (attackTime === 8 && this.attacking)
				this.attack = true;
			else 
				this.attack = false;
			//console.log(this.attack);
			attackTime--;
			this.body.velocity.x = this.lastVeloX;
			this.body.velocity.y = this.lastVeloY; 
			if (attackTime === 0){
				//this.attack = false;
				betweenAttack = 80;
				if (this.lastX > 0 && this.lastY > 0){
					this.retreat();
				} /*else
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
	this.body.velocity.x = 0 - this.lastVeloX;
	this.body.velocity.y = 0 - this.lastVeloY;
	if (this.body.position.x === this.lastX && this.body.position === this.lastY){
		this.body.velocity.x = 0;
		this.body.velocity.y = 0;
	}
	//this.retreating = true;
	//console.log(this.retreating);
	//attackTime = 5;
	//return 0;
};

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
	this.damage = 0.5;
	this.attack = false;
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
	if (this.hostile === true){
		betweenAttack--;
		if (betweenAttack <= 0){
			this.attack = true;
			attackTime -= 1;
			this.body.velocity.x = this.lastVeloX;
			this.body.velocity.y = this.lastVeloY; 
			if (attackTime === 0){
				this.attack = false;
				betweenAttack = 12;
				if (this.lastX > 0 && this.lastY > 0){
					this.retreat();
				}
				attackTime = 8;
			}
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
	attackTime = 5;
	return 0;
};

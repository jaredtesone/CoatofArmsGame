var detectRadius = 300;
var weaponRadius = 100;
var attackRadius = 100;
var slashDamage = 10;
var thrustDamage = 30;
var strikeDamage = 20;

// gameState constructor
let levelOneState = function() {
	this.score = 0;
};

levelOneState.prototype.create = function() {
	game.physics.startSystem(Phaser.Physics.ARCADE);

	game.add.sprite(0, 0, "sky");
	this.enemies = game.add.group();
	this.enemies.enableBody = true;
	/*this.platforms = game.add.group();
	this.platforms.enableBody = true;

	let ground = this.platforms.create(0, game.world.height - 64, "platform");
	ground.scale.set(2, 2);
	ground.body.immovable = true;
	//game.physics.arcade.enable(this.ground);*/

	this.player = new Player(1218, 562, "player");

	this.enemy1 = new Enemy(10, 10, "player", "generic");
	this.enemies.add(this.enemy1);
	this.enemy2 = new Enemy(300, 58, "player", "dragon");
	this.enemies.add(this.enemy2);


	//this.player.body.bounce.y = 0.2;
	//this.player.body.gravity.y = 300;
	//this.player.body.collideWorldBounds = true;

	//this.player.animations.add("left", [0, 1, 2, 3], 10, true);
	//this.player.animations.add("right", [5, 6, 7, 8], 10, true);

	//this.cursors = game.input.keyboard.createCursorKeys();
	
};

levelOneState.prototype.update = function() {
	//working++;
	this.enemies.forEachAlive(followPlayer, this, this.player);
	game.physics.arcade.collide(this.enemies);
	/*if (checkDist(enemy.body.position, player.body.position) < detectRadius){
			this.enemy.follow = true;
		}
		if (this.enemy.follow === true){
			followPlayer(this.enemy, this.player);
			//followPlayer(this.enemy2, this.player);
		}
	}*/

	//if swiping over enemy, establish enemy as targeted
	this.enemies.forEachAlive(this.target, this, true);
	//if not swiping over any enemies, clear targets
	if (!this.player.pointerCross)
		this.enemies.forEachAlive(this.target, this, false);
	//console.log(this.player.pointerCross);
	//console.log(this.player.swipe);
	//console.log(swipeCt);
	if (this.player.swipe) {
		//player attack
		let pi = game.math.PI2 / 2;
		let angle = game.math.normalizeAngle(this.player.swipeAngle);
		let damage = 0;
		if (angle >= 7*pi/4 || angle < pi/4) {	//swipe left (angle rotated because y is down)
			console.log("slash left");
			damage = slashDamage;
		} else if (angle >= pi/4 && angle < 3*pi/4) {	//swipe up
			console.log("thrust");
			damage = thrustDamage;
		} else if (angle >= 3*pi/4 && angle < 5*pi/4) {	//swipe right (angle rotated because y is down)
			console.log("slash right");
			damage = slashDamage;
		} else {	//swipe down
			console.log("strike");
			damage = strikeDamage;
		}
		//console.log(this.player.pointerCross);
		if (this.player.pointerCross && this.player.swipeCt === 0) {
			console.log("attack");
			this.enemies.forEachAlive(this.attack, this, damage);
			this.player.swipeCt++;
		}
		//this.player.swipe = false;	//only deal damage once per swipe
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

levelOneState.prototype.attack = function(enemy, damage) {
	//deal damage to enemy if targeted
	//console.log("attack");
	if (enemy.targeted)
		enemy.hp -= damage;
	console.log(enemy.hp);
	if (enemy.hp <= 0)
		enemy.kill();
};

levelOneState.prototype.target = function(enemy, attacking) {
	//must be swiping within 5 pixels of enemy, and player can be no farther than 5 pixels away from enemy in order to target enemy
	//console.log("swipe over: " + (samePoint(enemy.body.position, this.player.pointer.position, weaponRadius) && this.player.pointer.isDown));
	//console.log("close: " + samePoint(enemy.body.position, this.player.body.position, attackRadius));
	if (samePoint(enemy.body.position, this.player.pointer.position, weaponRadius) && samePoint(enemy.body.position, this.player.body.position, attackRadius)) {
		this.player.pointerCross = attacking;
		enemy.targeted = attacking;
		//console.log(enemy.targeted);
	}
};

function followPlayer(enemy, player){
	if (checkDist(enemy.body.position, player.body.position) < detectRadius){
		if (player.body.velocity.x === 0 && player.body.velocity.y === 0 && getDist(player.body.position, enemy.body.position) < 50 ){
			if (enemy.body.velocity.x !== 0 && enemy.body.velocity.y !== 0){
				enemy.lastVeloX = enemy.body.velocity.x;
				enemy.lastVeloY = enemy.body.velocity.y;
				enemy.lastX = enemy.body.position.x;
				enemy.lastY = enemy.body.position.y;
			}
			enemy.body.velocity.x = 0;
			enemy.body.velocity.y = 0;
		}
		else {
			let enemyVelocityX = (player.body.x - enemy.body.x) / getDist(enemy.body.position, player.body.position);
			let enemyVelocityY = (player.body.y - enemy.body.y) / getDist(enemy.body.position, player.body.position);
			let enemyVelocityMult = game.math.distance(0, 0, enemyVelocityX*enemyVelocityX, enemyVelocityY*enemyVelocityY);
			enemy.body.velocity.x = enemyVelocityX * (100/enemyVelocityMult);
			enemy.body.velocity.y = enemyVelocityY * (100/enemyVelocityMult);
			enemy.hostile = true;
			enemy.lastVeloX = enemy.body.velocity.x;
			enemy.lastVeloY = enemy.body.velocity.y;
		}
	}
};
function getDist(point1, point2) {
	if (samePoint(point1, nullPoint) || samePoint(point2, nullPoint))
		return -1;
	return game.math.distance(point1.x, point1.y, point2.x, point2.y);
};

function checkDist(point1, point2){
	return getDist(point1, point2);
};

function samePoint(point1, point2, epsilon) {
	return (game.math.fuzzyEqual(point1.x, point2.x, epsilon) && game.math.fuzzyEqual(point1.y, point2.y, epsilon));
};
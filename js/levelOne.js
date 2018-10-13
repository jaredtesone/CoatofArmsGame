var working = 0;

// gameState constructor
let levelOneState = function() {
	this.score = 0;
};

levelOneState.prototype.create = function() {
	game.physics.startSystem(Phaser.Physics.ARCADE);

	game.add.sprite(0, 0, "sky");
	/*this.platforms = game.add.group();
	this.platforms.enableBody = true;

	let ground = this.platforms.create(0, game.world.height - 64, "platform");
	ground.scale.set(2, 2);
	ground.body.immovable = true;
	//game.physics.arcade.enable(this.ground);*/

	this.player = new Player(1218, 562, "player");

	

	this.enemy = new Enemy(10, 10, "player", "generic");

	this.enemy2 = new Enemy(300, 58, "player", "dragon");


	//this.player.body.bounce.y = 0.2;
	//this.player.body.gravity.y = 300;
	//this.player.body.collideWorldBounds = true;

	//this.player.animations.add("left", [0, 1, 2, 3], 10, true);
	//this.player.animations.add("right", [5, 6, 7, 8], 10, true);

	//this.cursors = game.input.keyboard.createCursorKeys();
	
};

levelOneState.prototype.update = function() {
	working++;
	
	if (checkDist(this.enemy.body.position, this.player.body.position) < 300){
		this.enemy.follow = true;
	}
	if (this.enemy.follow === true){
		followPlayer(this.enemy, this.player);
		//followPlayer(this.enemy2, this.player);
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

function followPlayer(enemy, player){
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
		let enemyVelocityX = (player.position.x - enemy.body.x) / getDist(enemy.body.position, player.body.position);
		let enemyVelocityY = (player.body.position.y - enemy.body.y) / getDist(enemy.body.position, player.body.position);
		let enemyVelocityMult = game.math.distance(0, 0, enemyVelocityX*enemyVelocityX, enemyVelocityY*enemyVelocityY);
		enemy.body.velocity.x = enemyVelocityX * (100/enemyVelocityMult);
		enemy.body.velocity.y = enemyVelocityY * (100/enemyVelocityMult);
		enemy.hostile = true;
		enemy.lastVeloX = enemy.body.velocity.x;
		enemy.lastVeloY = enemy.body.velocity.y;
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
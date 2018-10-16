var detectRadius = 300;
var weaponRadius = 100;
var attackRadius = 100;
var damageRadius = 5;
var slashDamage = 10;
var thrustDamage = 30;
var strikeDamage = 20;
var smashThreshold = 1;
var damageReduc = 1;
var shieldDamage = 50;
var stageCounter = 0;
var map;
var layerMain;
var layerBack;
var text;
var textA;
var textB;
var scepter;
var level3Music;

// gameState constructor
let levelThreeState = function() {
	this.score = 0;
};

levelThreeState.prototype.create = function() {
	
	level3Music = game.add.audio('level3Music');
	level3Music.play();
	
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	this.map = this.game.add.tilemap("TileMap3", 125, 125, 125, 75);
	this.map.addTilesetImage("TileSheetv2", "TileSheetv2");
	this.layerMain = this.map.createLayer("main");
	this.layerBack = this.map.createLayer("back");
	//layerMain.resizeWorld();
	this.layerBack.resizeWorld();
	this.layerBack.wrap = true;
	this.map.setCollision([14, 15], true, this.layerMain);
	game.physics.arcade.enable(this.layerMain);
	//layerMain.wrap = true;

	this.enemies = game.add.group();
	this.enemies.enableBody = true;
	/*this.platforms = game.add.group();
	this.platforms.enableBody = true;

	let ground = this.platforms.create(0, game.world.height - 64, "platform");
	ground.scale.set(2, 2);
	ground.body.immovable = true;
	//game.physics.arcade.enable(this.ground);*/

	this.player = new Player(1125, 800, "player", true, true);
	game.physics.arcade.enable(this.player);
	game.camera.follow(this.player, game.camera.FOLLOW_TOPDOWN);

	this.dragon = new Dragon(1125, 500, "dragon", false);
	this.enemies.add(this.dragon);

	//add peaceful NPCs	
/*	this.peasant1 = game.add.sprite(4750, 4650, "character");
	this.peasant2 = game.add.sprite(4750, 4600, "character");
	this.knight = game.add.sprite(4625, 4675, "player");
	this.blacksmith = game.add.sprite(2250, 2375, "character");

	this.sign = game.add.sprite(4625, 4625, "player");*/

	//add five bandits that are initially peaceful but will turn hostile
/*	this.bandit1 = new Enemy(1625, 1250, "character", "bandit", false);
	this.enemies.add(this.bandit1);
	this.bandit2 = new Enemy(2125, 1250, "character", "bandit", false);
	this.enemies.add(this.bandit2);
	this.bandit3 = new Enemy(2125, 1625, "character", "bandit", false);
	this.enemies.add(this.bandit3);
	this.bandit4 = new Enemy(1625, 1625, "character", "bandit", false);
	this.enemies.add(this.bandit4);*/
/*	this.bandit5 = new Enemy(1875, 1500, "bandit", "bandit", false);
	this.enemies.add(this.bandit5);*/

	this.button = game.add.button(0, 875, "buttonBackground", this.loadText, this);
	this.button.fixedToCamera = true;

	text = game.add.text(0, 875, "Don Quixote wanders out of the clearing and continues aimlessly walking through the forest without a map or supplies \nuntil somehow he ends up near his destination, a foreboding mountain. He begins to climb the mountain and search for \nsigns of a dragon, until he notices a huge cave. He enters the cave.", {fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
	text.setTextBounds(0, 0, 2436, 250);
	text.fixedToCamera = true;

	this.buttonA = game.add.button(0, 875, "buttonBackSmall", this.clickA, this);
	this.buttonA.kill();
	this.buttonB = game.add.button(1218, 875, "buttonBackSmall", this.clickB, this);
	this.buttonB.kill();


	textA = new Phaser.Text(game, 0, 0, "");
	textB = new Phaser.Text(game, 0, 0, "");
	//this.player.body.bounce.y = 0.2;
	//this.player.body.gravity.y = 300;
	//this.player.body.collideWorldBounds = true;

	//this.player.animations.add("left", [0, 1, 2, 3], 10, true);
	//this.player.animations.add("right", [5, 6, 7, 8], 10, true);

	//this.cursors = game.input.keyboard.createCursorKeys();
	
};

levelThreeState.prototype.update = function() {
	game.physics.arcade.collide(this.enemies);
	game.physics.arcade.collide(this.enemies, this.layerMain);
	game.physics.arcade.collide(this.player, this.layerMain);

	if (this.button.alive || this.buttonA.alive || this.buttonB.alive)
		this.player.buttonPressed = true;
	else
		this.player.buttonPressed = false;

	//if clicked through beginning text and within 200px of blacksmith, display blacksmith text
	/*if (stageCounter === 7 && getDist(this.player.position, new Phaser.Point(2250, 2375)) <= 200) {
		this.loadText();
	}*/

	/*if (stageCounter === 11 && getDist(this.player.position, new Phaser.Point(1950, 2000)) <= 200) {
		this.loadText();
	}*/

	if (stageCounter === 8 && this.dragon.hp <= 25) {
		this.loadText();
	}

	if (stageCounter === 20 && getDist(this.player.position, scepter.position) <= 10)
		this.loadText();
	//enemies will chase down player within certain detection radius
	this.enemies.forEachAlive(followPlayer, this, this.player);

	//if swiping over enemy, mark enemy as targeted
	this.enemies.forEachAlive(this.target, this, true);
	//if not swiping over any enemies, clear targets
	if (!this.player.pointerCross)
		this.enemies.forEachAlive(this.target, this, false);
	
	//player attack
	if (this.player.swipe && this.player.alive) {
		//determine attack move based on swipe direction
		let pi = game.math.PI2 / 2;
		let angle = game.math.normalizeAngle(this.player.swipeAngle);
		let damage = 0;
		if (angle >= 7*pi/4 || angle < pi/4) {	//swipe right
			console.log("slash right");
			damage = slashDamage;
		} else if (angle >= pi/4 && angle < 3*pi/4) {	//swipe up (angle rotated because y is down)
			console.log("strike");
			damage = strikeDamage;
		} else if (angle >= 3*pi/4 && angle < 5*pi/4) {	//swipe left
			console.log("slash left");
			damage = slashDamage;
		} else {	//swipe down (angle rotated because y is down)
			console.log("thrust");
			damage = thrustDamage;
		}
		//attack all enemies targeted by swipe
		if (this.player.pointerCross && this.player.swipeCt === 0) {
			//console.log("attackEnemy");
			this.enemies.forEachAlive(this.attackEnemy, this, damage);
			this.player.swipeCt++;
		}
	}

	if (this.player.drag && this.player.shieldCharge >= smashThreshold && this.player.alive) {
		if (this.player.pointerCross && this.player.dragCt === 0) {
			console.log("shield smash");
			this.enemies.forEachAlive(this.attackEnemy, this, shieldDamage);
			this.player.hasShield = false;
			this.player.dragCt++;
		}
	}

	//enemies within attack radius damage player
	this.enemies.forEachAlive(this.damagePlayer, this);
	
	
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

levelThreeState.prototype.damagePlayer = function(enemy) {
	if (!this.player.alive || !enemy.evil)
		return;
	//deal damage to player if attacking and player is not shielding
	if (enemy.attack && !(this.player.hasShield && this.player.pointer.isDown))
		this.player.hp -= enemy.damage;
	console.log("Player health: " + this.player.hp);
	//kill player if health is depleted
	if (this.player.hp <= 0) {
		this.player.alive = false;
		this.player.kill();
		//game over?
	}
}

levelThreeState.prototype.attackEnemy = function(enemy, damage) {
	if (!this.player.alive)
		return;	
	//deal damage to enemy if targeted
	if (enemy.targeted)
		enemy.hp -= damage/damageReduc;
	console.log("Enemy health: " + enemy.hp);
	//kill enemy if health is depleted
	if (enemy.hp <= 0) {
		enemy.alive = false;
		enemy.kill();
	}
};

levelThreeState.prototype.target = function(enemy, attacking) {
	if (!this.player.alive)
		return;	
	//must be swiping within 5 pixels of enemy, and player can be no farther than 5 pixels away from enemy in order to target enemy
	if (samePoint(enemy.body.position, screenToWorld(this.player.pointer.position), weaponRadius) && samePoint(enemy.body.position, this.player.body.position, attackRadius)) {
		this.player.pointerCross = attacking;
		enemy.targeted = attacking;
	}
};

function followPlayer(enemy, player){
	if (!this.player.alive || !enemy.evil)
		return;	
	let dist = getDist(enemy.body.position, player.body.position);
	if (dist >= 0 && dist < detectRadius) {
		if (player.body.velocity.x === 0 && player.body.velocity.y === 0 && getDist(player.body.position, enemy.body.position) < 100){
			if (enemy.body.velocity.x !== 0 && enemy.body.velocity.y !== 0) {
				if (!enemy.retreating) {
					enemy.lastVeloX = enemy.body.velocity.x;
					enemy.lastVeloY = enemy.body.velocity.y;
				}
			} else if (enemy.body.velocity.x === 0 && enemy.body.velocity.y === 0 && !enemy.lunging) {
				enemy.lastX = enemy.body.x;
				enemy.lastY = enemy.body.y;
			}
			enemy.body.velocity.x = 0;
			enemy.body.velocity.y = 0;
			enemy.hostile = true;
		}
		else {
			let enemyVelocityX = (player.body.x - enemy.body.x) / getDist(enemy.body.position, player.body.position);
			let enemyVelocityY = (player.body.y - enemy.body.y) / getDist(enemy.body.position, player.body.position);
			let enemyVelocityMult = game.math.distance(0, 0, enemyVelocityX*enemyVelocityX, enemyVelocityY*enemyVelocityY);
			enemy.body.velocity.x = enemyVelocityX * (100/enemyVelocityMult);
			enemy.body.velocity.y = enemyVelocityY * (100/enemyVelocityMult);
			enemy.lunging = false;
			enemy.hostile = false;
		}
	}
	if (dist >= 0 && dist < attackRadius)
		enemy.attacking = true;
	else
		enemy.attacking = false;
};

levelThreeState.prototype.loadText = function() {
	//this.player.stationary = true;
	//this.player.buttonPressed = true;
	stageCounter++;
	//text.kill();
	text.fixedToCamera = true;
	text.setTextBounds(0, 875, 2436, 250);
	if (stageCounter === 1) {
		text = game.add.text(0, 875, "Jose: Who dares enter my sanctuary!", {fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
		//this.player.tap = this.player.doubleTap = this.player.swipe = this.player.hold = this.player.drag = false;
	} else if (stageCounter === 2) {
		text = game.add.text(0, 875, "Don Quixote: I am here to stop your reign of terror and reclaim the sacred treasure you foul wyrm!", {fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
		//this.player.tap = this.player.doubleTap = this.player.swipe = this.player.hold = this.player.drag = false;
	} else if (stageCounter === 3) {
		text = game.add.text(0, 875, "Jose: Not another one of you “knights”! You’re all the sa- Wait. You’re not like the others… Do you even know what you are being asked to seek?", {fill: "white", boundsAlignH: "center", boundsAlignV: "middle", strokeThickness: 10});
		/*this.bandit1 = new Enemy(1250, 1500, "character", "bandit", false);
		this.enemies.add(this.bandit1);
		this.bandit2 = new Enemy(2375, 1500, "character", "bandit", false);
		this.enemies.add(this.bandit2);
		this.bandit3 = new Enemy(2125, 875, "character", "bandit", false);
		this.enemies.add(this.bandit3);
		this.bandit4 = new Enemy(1375, 1125, "character", "bandit", false);
		this.enemies.add(this.bandit4);*/
		//this.player.tap = this.player.doubleTap = this.player.swipe = this.player.hold = this.player.drag = false;
	} else if (stageCounter === 4) {
		text = game.add.text(0, 875, "Don Quixote: The Scepter of Life, the most powerful artifact for good in Valencia!", {fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
		//this.player.tap = this.player.doubleTap = this.player.swipe = this.player.hold = this.player.drag = false;
	} else if (stageCounter === 5) {
		text = game.add.text(0, 875, "The dragon begins to laugh.", {fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
		//this.player.tap = this.player.doubleTap = this.player.swipe = this.player.hold = this.player.drag = false;
	} else if (stageCounter === 6) {
		text = game.add.text(0, 875, "Jose: The scepter of life, is that truly what you think? You must be a fool! I shall tell you the tru-", {fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
		//this.player.tap = this.player.doubleTap = this.player.swipe = this.player.hold = this.player.drag = false;
		//this.bandit5.evil = true;
	}/* else if (stageCounter === 7) {
		text = game.add.text(0, 875, "", {fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
		//this.player.tap = this.player.doubleTap = this.player.swipe = this.player.hold = this.player.drag = false;
		this.button.revive();
		//return;
	}*/ else if (stageCounter === 7) {
		text = game.add.text(0, 875, "Don Quixote: I don’t care! I came here to eat paella and kick dragon butt, and I’m all out of paella!", {fill: "white", boundsAlignH: "center", boundsAlignV: "middle", strokeThickness: 10});
		//this.player.tap = this.player.doubleTap = this.player.swipe = this.player.hold = this.player.drag = false;
	} else if (stageCounter === 8) {
		text = game.add.text(0, 875, "", {fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
		//this.player.tap = this.player.doubleTap = this.player.swipe = this.player.hold = this.player.drag = false;
		this.button.kill();
		this.dragon.evil = true;
		this.dragon.hp = 500;
	} else if (stageCounter === 9) {
		text = game.add.text(0, 875, "As the fight continues, the Dragon becomes weaker and weaker until finally he shouts out! \nJose: WAIT! Please stop, let me tell you the truth of your quest!", {fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
		//this.player.tap = this.player.doubleTap = this.player.swipe = this.player.hold = this.player.drag = false;
		this.dragon.evil = false;
		this.dragon.hp = 1500;
		this.button.revive();
	} else if (stageCounter === 10) {
		text = game.add.text(0, 875, "Don Quixote: No tricks wyrm, you die now!", {fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
	} else if (stageCounter === 11) {
		text = game.add.text(0, 875, "Jose: Please just listen for a minute, otherwise Valencia is doomed!", {fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
	} else if (stageCounter === 12) {
		text = game.add.text(0, 875, "Don Quixote: I guess I could spare a second. What do you have to say?", {fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
	} else if (stageCounter === 13) {
		text = game.add.text(0, 875, "Jose: The artifact you seek is not the Scepter of Life, it is the Scepter of Death. \nPeter the Pious is actually Peter the Necromancer, and he seeks the Scepter of Death to turn all of Valencia into undead abominations that follow his every command. \nIf you give him the Scepter, we are all doomed.", {fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
	} else if (stageCounter === 14) {
		text = game.add.text(0, 875, "Don Quixote: Surely you must be lying! But…", {fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
	} else if (stageCounter === 15) {
		text = game.add.text(0, 875, "Jose: On my honor I am not!", {fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
	} else if (stageCounter === 16) {
		text = game.add.text(0, 625, "Don Quixote doesn’t know what to believe. Surely the king couldn't be evil? Do you \nA: Trust the dragon and confront the king or \nB: Kill the dragon and return the Scepter to the king.", {fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
		this.button.kill();
		//this.buttonA = game.add.button(0, 875, "buttonBackSmall", this.clickA, this);
		this.buttonA.revive();
		textA = game.add.text(0, 875, "Kill dragon", {fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
		//this.buttonB = game.add.button(1218, 875, "buttonBackSmall", this.clickB, this);
		this.buttonB.revive();
		textB = game.add.text(1218, 875, "Trust dragon", {fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
	} else if (stageCounter === 17) {
		if (this.joinDragon)
			text = game.add.text(0, 875, "Don Quixote: I believe you! I shall confront the king!", {fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
		else
			text = game.add.text(0, 875, "Don Quixote: You are clearly lying foul wyrm, and I shall -", {fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
		this.button.revive();
	} else if (stageCounter === 18) {
		if (this.joinDragon)
			text = game.add.text(0, 875, "Jose: I will help you, brave adventurer. Hop on my back!", {fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
		else
			text = game.add.text(0, 875, "Before Don Quixote can finish his sentence, Jose flies out of his cave and leaves Valencia forever.", {fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
	} else if (stageCounter === 19) {
		if (this.joinDragon) {
			//next level
			game.state.start("LevelFour");
			console.log("join the dragon");
			text.kill();
			this.button.kill();
		} else
			text = game.add.text(0, 875, "Don Quixote: Hmmm. That was kind of easy wasn’t it…", {fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
	} else if (stageCounter === 20) {
		text = game.add.text(0, 875, "Don Quixote searches for the scepter, and upon picking it up wanders out of the cave and towards the castle.", {fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
		scepter = game.add.sprite(2000, 250, "scepter");
		this.button.kill();
	} else if (stageCounter === 21) {
		text = game.add.text(0, 875, "You have received the Scepter of Life! Or is it the Scepter of Death?!", {fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
		scepter.kill();
		this.button.revive();
	} else if (stageCounter === 22) {
		//next level
		game.state.start("LevelFive");
	}
	text.setTextBounds(0, 0, 2436, 250);
	textA.setTextBounds(0, 0, 1218, 250);
	textB.setTextBounds(0, 0, 1218, 250);
	text.fixedToCamera = true;
	textA.fixedToCamera = true;
	textB.fixedToCamera = true;
	//this.player.buttonPressed = false;


};

levelThreeState.prototype.clickA = function() {
	this.joinDragon = false;
	this.loadText();
	this.buttonA.kill();
	this.buttonB.kill();
	textA.kill();
	textB.kill();
};

levelThreeState.prototype.clickB = function() {
	this.joinDragon = true;
	this.loadText();
	this.buttonA.kill();
	this.buttonB.kill();
	textA.kill();
	textB.kill();
};

//get distance between points, returning -1 if points uninitialized
function getDist(point1, point2) {
	if (samePoint(point1, nullPoint) || samePoint(point2, nullPoint))
		return -1;
	return game.math.distance(point1.x, point1.y, point2.x, point2.y);
};

//determine if two points are within epsilon pixels of each other
function samePoint(point1, point2, epsilon) {
	return (game.math.fuzzyEqual(point1.x, point2.x, epsilon) && game.math.fuzzyEqual(point1.y, point2.y, epsilon));
};

function worldToScreen(point) {
	let newPt = new Phaser.Point(point.x - game.camera.x, point.y - game.camera.y);
  	return newPt;
};


function screenToWorld(point) {
	let newPt = new Phaser.Point(point.x + game.camera.x, point.y + game.camera.y);
  	return newPt;
};
// preloadState constructor

let preloadState = function() {
		
};

preloadState.prototype.preload = function() {
	//game.load.spritesheet("player", "assets/character.png", 32, 48);
	game.load.spritesheet("character", "assets/CHaracters.png", 125, 125);
	game.load.spritesheet("player", "assets/mc_all.png", 70, 125);
	game.load.spritesheet("bandit", "assets/banditFinal.png", 70, 125);
	game.load.spritesheet("darkKnight", "assets/knightAll.png", 70, 125);
	game.load.spritesheet("dragon", "assets/dragon.png", 250, 125);
	game.load.spritesheet("king", "assets/king.png", 70, 125);
	game.load.image("scepter", "assets/scepter.png", 125, 125);
	game.load.tilemap('TileMap1', 'assets/start.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('TileSheetv2', 'assets/TileSheetv2.png');
	
	// Music
	game.load.audio('level1Music', 'assets/audio/music/Level 1 (Village).mp3');
	game.load.audio('level2Music', 'assets/audio/music/Level 2 (Wilderness).mp3');
	game.load.audio('level3Music', 'assets/audio/music/Level 3 (Dragon Cave).mp3');
	game.load.audio('level4Music', 'assets/audio/music/Level 4 (Castle, Betray King, Triumphant).mp3');
	game.load.audio('level5Music', 'assets/audio/music/Level 5 (Castle, Help King, Sinister).mp3');
	
	// Sound
	game.load.audio('collect', 'assets/audio/sound/collect.wav')
	game.load.audio('dragon-death', 'assets/audio/sound/dragon-death.wav');
	game.load.audio('dragon-fire-ball', 'assets/audio/sound/dragon-fire-ball.wav');
	game.load.audio('dragon-growl', 'assets/audio/sound/dragon-growl.wav');
	game.load.audio('hit', 'assets/audio/sound/hit.wav');
	game.load.audio('ouch', 'assets/audio/sound/ouch.wav');
	game.load.audio('shield-bash', 'assets/audio/sound/shield-bash.wav');
	game.load.audio('sword', 'assets/audio/sound/sword.wav');
	game.load.audio('sword2', 'assets/audio/sound/sword2.wav');
	game.load.audio('sword3', 'assets/audio/sound/sword3.wav');

	game.load.image("buttonBackground", "assets/buttonBackground.png");
	game.load.image("buttonBackSmall", "assets/buttonBackSmall.png");
	game.load.tilemap("TileMap2", "assets/woods.json", null, Phaser.Tilemap.TILED_JSON);
	game.load.tilemap("TileMap2", "assets/woods.json", null, Phaser.Tilemap.TILED_JSON);
	game.load.tilemap("TileMap3", "assets/cave.json", null, Phaser.Tilemap.TILED_JSON);
	game.load.tilemap("TileMap4", "assets/castle.json", null, Phaser.Tilemap.TILED_JSON);

};

preloadState.prototype.create = function() {
	game.state.start("LevelFour");
};

preloadState.prototype.update = function() {
	
};
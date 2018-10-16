// preloadState constructor

let preloadState = function() {
		
};

preloadState.prototype.preload = function() {
	game.load.spritesheet("player", "assets/character.png", 32, 48);
	game.load.spritesheet("character", "assets/CHaracters.png", 125, 125);
	game.load.tilemap('TileMap1', 'assets/start.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('TileSheetv2', 'assets/TileSheetv2.png');
	game.load.audio('level1Music', 'assets/audio/music/Level 1 (Village).mp3');
	game.load.audio('level2Music', 'assets/audio/music/Level 2 (Wilderness).mp3');
	game.load.audio('level3Music', 'assets/audio/music/Level 3 (Dragon Cave).mp3');
	game.load.audio('level4Music', 'assets/audio/music/Level 4 (Castle, Betray King, Triumphant).mp3');
	game.load.audio('level5Music', 'assets/audio/music/Level 5 (Castle, Help King, Sinister).mp3');
	game.load.image("buttonBackground", "assets/buttonBackground.png");
	game.load.image("buttonBackSmall", "assets/buttonBackSmall.png");
	game.load.tilemap("TileMap2", "assets/woods.json", null, Phaser.Tilemap.TILED_JSON);
	game.load.tilemap("TileMap2", "assets/woods.json", null, Phaser.Tilemap.TILED_JSON);
	game.load.tilemap("TileMap3", "assets/cave.json", null, Phaser.Tilemap.TILED_JSON);
	game.load.tilemap("TileMap4", "assets/castle.json", null, Phaser.Tilemap.TILED_JSON);
};

preloadState.prototype.create = function() {
	game.state.start("LevelOne");
};

preloadState.prototype.update = function() {
	
};
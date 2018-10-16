// preloadState constructor

let preloadState = function() {
		
};

preloadState.prototype.preload = function() {
	game.load.spritesheet("player", "assets/character.png", 32, 48);
	game.load.spritesheet("character", "assets/CHaracters.png", 125, 125);
	game.load.tilemap('TileMap1', 'assets/start.json', null, Phaser.Tilemap.TILED_JSON);
	//game.load.tilemap("TileMap2", "assets/woods.json", null, Phaser.Tilemap.TILED_JSON);
	game.load.image('TileSheetv2', 'assets/TileSheetv2.png');
	game.load.image("buttonBackground", "assets/buttonBackground.png");
};

preloadState.prototype.create = function() {
	game.state.start("LevelOne");
};

preloadState.prototype.update = function() {
	
};
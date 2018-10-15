// preloadState constructor

let preloadState = function() {
		
};

preloadState.prototype.preload = function() {
	game.load.image("sky", "assets/sky.png");
	//game.load.image("platform", "assets/platform.png");
	game.load.image("star", "assets/star.png");
	game.load.spritesheet("player", "assets/character.png", 32, 48);
	//game.load.tilemap('TileMap1', 'assets/start.json', null, Phaser.Tilemap.TILED_JSON);
	//game.load.image('TileSheetv2', 'assets/TileSheetv2.png')
};

preloadState.prototype.create = function() {
	game.state.start("LevelOne");
};

preloadState.prototype.update = function() {
	
};
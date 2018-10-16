// preloadState constructor

let preloadState = function() {
		
};

preloadState.prototype.preload = function() {
	game.load.spritesheet("player", "assets/character.png", 32, 48);
	game.load.tilemap('TileMap1', 'assets/start.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('TileSheetv2', 'assets/TileSheetv2.png');
	
	// Music
	game.load.audio('level1Music', 'assets/audio/music/Level 1 (Village).mp3');
	game.load.audio('level2Music', 'assets/audio/music/Level 2 (Wilderness).mp3');
	game.load.audio('level3Music', 'assets/audio/music/Level 3 (Dragon Cave).mp3');
	game.load.audio('level4Music', 'assets/audio/music/Level 4 (Castle, Betray King, Triumphant).mp3');
	game.load.audio('level5Music', 'assets/audio/music/Level 5 (Castle, Help King, Sinister).mp3');
};

var level1Music;

preloadState.prototype.create = function() {
	game.state.start("LevelOne");
	level1Music = game.add.audio('level1Music');
	level1Music.play();
};

preloadState.prototype.update = function() {
	
};
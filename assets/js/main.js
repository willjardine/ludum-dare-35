//////////////////////////////////////////////////
// CONSTANTS
//////////////////////////////////////////////////

	var GRID_WIDTH = 16;
	var GRID_HEIGHT = 16;
	var GAME_WIDTH = GRID_WIDTH * 10;
	var GAME_HEIGHT = GRID_HEIGHT * 9;

	var KEYCODE_ENTER = 13;
	var KEYCODE_SPACE = 32;
	var KEYCODE_UP = 38;
	var KEYCODE_LEFT = 37;
	var KEYCODE_RIGHT = 39;
	var KEYCODE_W = 87;
	var KEYCODE_A = 65;
	var KEYCODE_D = 68;

	var LEVELS = [
		{
			map: [
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
				[1, 1, 0, 0, 1, 1, 1, 1, 1, 1],
				[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			],
			player: [1, 6]
		}
	];


//////////////////////////////////////////////////
// VARIABLES
//////////////////////////////////////////////////

	var canvas, manifest, preload, stage;
	var playerSpriteSheet, tilesSpriteSheet;
	var background, fpsLabel, player, room;

	var jumpKeyHeld = false;
	var leftKeyHeld = false;
	var rightKeyHeld = false;


//////////////////////////////////////////////////
// INIT & LOADING
//////////////////////////////////////////////////

	function init() {

		if (!createjs.Sound.initializeDefaultPlugins()) {
			// can't load sound plugins
			return;
		}

		if (createjs.BrowserDetect.isIOS || createjs.BrowserDetect.isAndroid || createjs.BrowserDetect.isBlackberry) {
			// mobile isn't supported
			return;
		}

		// canvas
		canvas = document.getElementById('canvas');
		canvas.imageSmoothingEnabled = false;
		canvas.width = GAME_WIDTH;
		canvas.height = GAME_HEIGHT;

		// window
		window.addEventListener('resize', resizeWindow);
		window.addEventListener('orientationchange', resizeWindow);
		resizeWindow();

		// stage
		stage = new createjs.Stage(canvas);
		stage.snapToPixelEnabled = true;

		// preload
		manifest = [
			// images
			{id:'background',	src:'assets/img/background.gif'},
			{id:'boom',			src:'assets/img/boom.gif'},
			{id:'coin',			src:'assets/img/coin.gif'},
			{id:'player',		src:'assets/img/player.gif'},
			{id:'spikes',		src:'assets/img/spikes.gif'},
			{id:'tiles',		src:'assets/img/tiles.gif'},
			// sounds
			{id:'hit',			src:'assets/snd/fx-hit.ogg'},
			{id:'jump',			src:'assets/snd/fx-jump.ogg'},
			{id:'pickup',		src:'assets/snd/fx-pickup.ogg'},
			{id:'powerup',		src:'assets/snd/fx-powerup.ogg'},
			{id:'music',		src:'assets/snd/music.ogg'}
		];
		createjs.Sound.alternateExtensions = ['mp3', 'wav'];
		preload = new createjs.LoadQueue(true);
		preload.installPlugin(createjs.Sound);
		preload.addEventListener('complete', doneLoading);
		preload.loadManifest(manifest);

	}
	function doneLoading(event) {

		// background
		background = new createjs.Bitmap( preload.getResult('background') );
		stage.addChild(background);

		// fps label
		fpsLabel = new createjs.Text('', '24px Arial', '#000');
		fpsLabel.x = 4;
		fpsLabel.y = 0;
		stage.addChild(fpsLabel);

		// player sprite sheet
		playerSpriteSheet = new createjs.SpriteSheet({
			framerate: 8,
			images: [ preload.getResult('player') ],
			frames: {width:GRID_WIDTH, height:GRID_WIDTH, count:10, regX:GRID_WIDTH/2, regY:GRID_WIDTH/2, spacing:0, margin:0},
			animations: {
				idle: {
					frames: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3],
					speed: 0.7
				},
				hurt: 4,
				walk: [5, 7],
				jump: 8,
				fall: 9
			}
		});

		// tiles sprite sheet
		var tilesSpriteSheetAnimations = {};
		var tilesSpriteSheetTotalFrames = 18;
		for (var i=0; i<18; ++i) {
			tilesSpriteSheetAnimations['tile-'+i] = i;
		}
		tilesSpriteSheet = new createjs.SpriteSheet({
			framerate: 1,
			images: [ preload.getResult('tiles') ],
			frames: {width:GRID_WIDTH, height:GRID_WIDTH, count:tilesSpriteSheetTotalFrames, regX:0, regY:0, spacing:0, margin:0},
			animations: tilesSpriteSheetAnimations
		});

		// setup room
		player = new createjs.Sprite(playerSpriteSheet, 'idle');
		room = new createjs.Container();
		stage.addChild(room);
		changeLevel(0);

		// play music
		//createjs.Sound.play('music', {interrupt:createjs.Sound.INTERRUPT_NONE, loop:-1, volume:0.4});

		// start game loop
		createjs.Ticker.timingMode = createjs.Ticker.RAF;
		createjs.Ticker.addEventListener('tick', tick);

		// register events
		//canvas.onclick = handleClick;
		document.onkeydown = handleKeyDown;
		document.onkeyup = handleKeyUp;

	}


//////////////////////////////////////////////////
// CHANGE LEVEL
//////////////////////////////////////////////////

	function changeLevel(level) {

		room.removeAllChildren();
		jumpKeyHeld = leftKeyHeld = rightKeyHeld = false;

		var map = LEVELS[level].map;
		for (var y=0; y<map.length; ++y) {
			for (var x=0; x<map[y].length; ++x) {
				if (parseInt(map[y][x]) == 1) {
					var tile = new createjs.Sprite(tilesSpriteSheet, 'tile-16');
					tile.x = x * GRID_WIDTH;
					tile.y = y * GRID_WIDTH;
					room.addChild(tile);
				}
			}
		}

		player.x = (LEVELS[level].player[0] * GRID_WIDTH) + (GRID_WIDTH / 2);
		player.y = (LEVELS[level].player[1] * GRID_HEIGHT) + (GRID_HEIGHT / 2);
		player.gotoAndPlay('idle');
		room.addChild(player);

		stage.update();
	}


//////////////////////////////////////////////////
// CONTROLS
//////////////////////////////////////////////////

	function handleClick() {
		canvas.onclick = null;
		createjs.Sound.play('powerup');
		return false;
	}
	function handleKeyDown(event) {
		if (!event) {
			var event = window.event;
		}
		switch (event.keyCode) {
			case KEYCODE_SPACE:
			case KEYCODE_W:
			case KEYCODE_UP:
				jumpKeyHeld = true;
				return false;
			case KEYCODE_A:
			case KEYCODE_LEFT:
				leftKeyHeld = true;
				return false;
			case KEYCODE_D:
			case KEYCODE_RIGHT:
				rightKeyHeld = true;
				return false;
			case KEYCODE_ENTER:
				if (canvas.onclick == handleClick) {
					handleClick();
				}
				return false;
		}
	}
	function handleKeyUp(event) {
		if (!event) {
			var event = window.event;
		}
		switch (event.keyCode) {
			case KEYCODE_SPACE:
			case KEYCODE_W:
			case KEYCODE_UP:
				jumpKeyHeld = false;
				break;
			case KEYCODE_A:
			case KEYCODE_LEFT:
				leftKeyHeld = false;
				break;
			case KEYCODE_D:
			case KEYCODE_RIGHT:
				rightKeyHeld = false;
				break;
		}
	}


//////////////////////////////////////////////////
// UPDATE LOOP
//////////////////////////////////////////////////

	function tick(event) {

		/*
		var deltaTime = event.delete / 1000;

		if (jumpKeyHeld) {
			player.gotoAndPlay('jump');
		}
		if (leftKeyHeld) {
			player.scaleX = -1;
		}
		if (rightKeyHeld) {
			player.gotoAndPlay('walk');
			player.scaleX = 1;
		}
		*/

		fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + ' fps';
		stage.update(event);
	}


//////////////////////////////////////////////////
// RESIZE WINDOW
//////////////////////////////////////////////////

	function resizeWindow() {
		var winWidth = Math.floor(window.innerWidth / GRID_WIDTH) * GRID_WIDTH;
		var winHeight = Math.floor(window.innerHeight / GRID_HEIGHT) * GRID_HEIGHT;
		var winRatio = winWidth / winHeight;
		var imgRatio = GAME_WIDTH / GAME_HEIGHT;
		var newWidth, newHeight;
		if (winRatio < imgRatio) {
			newWidth = winWidth;
			newHeight = (winWidth / GAME_WIDTH) * GAME_HEIGHT;
		} else {
			newWidth = (winHeight / GAME_HEIGHT) * GAME_WIDTH;
			newHeight = winHeight;
		}
		canvas.style.width = newWidth + 'px';
		canvas.style.height = newHeight + 'px';
	}


//////////////////////////////////////////////////
// GO!
//////////////////////////////////////////////////

	init();

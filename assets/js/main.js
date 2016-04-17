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

	var PLAYER_HITAREA_WIDTH = 12;
	var PLAYER_HITAREA_HEIGHT = 12;

	var PLAYER_MOVE_SPEED = 64;
	var PLAYER_JUMP_SPEED = 180;
	var PLAYER_GRAVITY_ACCELERATION = 400;
	var PLAYER_MAX_FALL_SPEED = 180;
	var PLAYER_



//////////////////////////////////////////////////
// VARIABLES
//////////////////////////////////////////////////

	var canvas, manifest, preload, stage;
	var playerSpriteSheet, tilesSpriteSheet;
	var background, fpsLabel, player, room;

	var currentLevel = 0;

	var jumpKeyHeld = false;
	var leftKeyHeld = false;
	var rightKeyHeld = false;


//////////////////////////////////////////////////
// HELPERS
//////////////////////////////////////////////////

	Math.clamp = function(value, min, max) {
		value = value > max ? max : value;
		value = value < min ? min : value;
		return value;
	};


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
		canvas = document.createElement('canvas');
		canvas.imageSmoothingEnabled = false;
		canvas.width = GAME_WIDTH;
		canvas.height = GAME_HEIGHT;
		document.body.appendChild(canvas);

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

		// player
		player = new createjs.Sprite(playerSpriteSheet, 'idle');
		player.currentAnimation = 'idle';
		player.velocity = {x:0, y:0};
		player.onGround = false;

		// room
		room = new createjs.Container();
		stage.addChild(room);
		changeLevel(0);

		// play music
		//createjs.Sound.play('music', {interrupt:createjs.Sound.INTERRUPT_NONE, loop:-1, volume:0.4});

		// start game loop
		createjs.Ticker.timingMode = createjs.Ticker.RAF;
		createjs.Ticker.addEventListener('tick', update);

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
		currentLevel = level;

		var map = LEVELS[level].map;
		for (var y=0; y<map.length; ++y) {
			for (var x=0; x<map[y].length; ++x) {
				if (parseInt(map[y][x]) == 1) {
					var tile = new createjs.Sprite(tilesSpriteSheet, 'tile-16');
					tile.x = getTileX(x);
					tile.y = getTileY(y);
					room.addChild(tile);
				}
			}
		}

		player.currentAnimation = 'idle';
		player.x = (LEVELS[level].player[0] * GRID_WIDTH) + (GRID_WIDTH / 2);
		player.y = (LEVELS[level].player[1] * GRID_HEIGHT) + (GRID_HEIGHT / 2);
		player.velocity.x = 0;
		player.velocity.y = 0;
		player.scaleX = 1;
		player.gotoAndPlay('idle');
		room.addChild(player);

		stage.update();
	}


//////////////////////////////////////////////////
// UPDATE LOOP
//////////////////////////////////////////////////

	function update(event) {

		var deltaTime = event.delta / 1000;

		// 1. update enemies

		updatePlayer(deltaTime);

		// 3. check for enemy/player collisions

		// 4. check for item/player collisions

		// 5. update camera

		fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + ' fps';
		stage.update(event);
	}
	function updatePlayer(deltaTime) {

		// remember current animation
		var animation = player.currentAnimation;

		// get direction
		var dirX = 0;
		dirX += leftKeyHeld ? -1 : 0;
		dirX += rightKeyHeld ? 1 : 0;

		// update velocity
		player.velocity.x = dirX * PLAYER_MOVE_SPEED;
		player.velocity.y = Math.clamp(player.velocity.y + PLAYER_GRAVITY_ACCELERATION * deltaTime, -PLAYER_MAX_FALL_SPEED, PLAYER_MAX_FALL_SPEED);

		// start jumping?
		if (jumpKeyHeld && player.onGround) {
			animation = 'jump';
			player.velocity.y = -PLAYER_JUMP_SPEED;
		} if (dirX !== 0) {
			animation = 'walk';
		} else {
			animation = 'idle';
		}

		// update x position
		player.x += player.velocity.x * deltaTime;
		if (player.x < PLAYER_HITAREA_WIDTH / 2) {
			player.x = PLAYER_HITAREA_WIDTH / 2;
			player.velocity.x = 0;
			animation = (animation === 'walk') ? 'idle' : animation;
		} else if (player.x > (LEVELS[currentLevel].map[0].length * GRID_WIDTH) - (PLAYER_HITAREA_WIDTH / 2)) {
			player.x = (LEVELS[currentLevel].map[0].length * GRID_WIDTH) - (PLAYER_HITAREA_WIDTH / 2);
			player.velocity.x = 0;
			animation = (animation === 'walk') ? 'idle' : animation;
		}
		updateTileCollision(player, dirX, 0, PLAYER_HITAREA_WIDTH, PLAYER_HITAREA_HEIGHT);

		// update y position
		var dirY = 0;
		dirY = (player.velocity.y < 0) ? -1 : dirY;
		dirY = (player.velocity.y > 0) ? 1 : dirY;
		player.y += player.velocity.y * deltaTime;
		if (player.y < PLAYER_HITAREA_HEIGHT / 2) {
			player.y = PLAYER_HITAREA_HEIGHT / 2;
			player.velocity.y = 0;
			//animation = (animation === 'walk') ? 'idle' : animation;
		} else if (player.y > (LEVELS[currentLevel].map.length * GRID_HEIGHT) - (PLAYER_HITAREA_HEIGHT / 2)) {
			player.y = (LEVELS[currentLevel].map.length * GRID_HEIGHT) - (PLAYER_HITAREA_HEIGHT / 2);
			player.velocity.y = 0;
			animation = 'fall';
		}
		//player.y = Math.clamp(player.y, PLAYER_HITAREA_HEIGHT / 2, (LEVELS[currentLevel].map.length * GRID_HEIGHT) - (PLAYER_HITAREA_HEIGHT / 2));
		updateTileCollision(player, 0, dirY, PLAYER_HITAREA_WIDTH, PLAYER_HITAREA_HEIGHT);

		// on ground?
		player.onGround = isSolidTileAt(player.x, player.y + (PLAYER_HITAREA_WIDTH / 2));

		// update flipping
		player.scaleX = (dirX < 0) ? -1 : player.scaleX;
		player.scaleX = (dirX > 0) ? 1 : player.scaleX;

		//animation = 'fall';

		// update animation
		if (animation !== player.currentAnimation) {
			player.currentAnimation = animation;
			player.gotoAndPlay(animation);
		}

	}


//////////////////////////////////////////////////
// TILEMAP
//////////////////////////////////////////////////

	function updateTileCollision(element, dirX, dirY, width, height) {

		var row, col;

		var left = element.x - (width / 2);
		var right = element.x + (width / 2) - 0.5;
		var top = element.y - (height / 2);
		var bottom = element.y + (height / 2) - 0.5;

		// check for collisions on sprite sides
		var collision =
			isSolidTileAt(left, top) ||
			isSolidTileAt(right, top) ||
			isSolidTileAt(right, bottom) ||
			isSolidTileAt(left, bottom);
		if (collision === false) {
			return;
		}

		if (dirY > 0) {
			row = getTileRow(bottom);
			element.y = -(height / 2) + getTileY(row);
			element.velocity.y = 0;
		} else if (dirY < 0) {
			row = getTileRow(top);
			element.y = (height / 2) + getTileY(row + 1);
			element.velocity.y = 0;
		} else if (dirX > 0) {
			col = getTileCol(right);
			element.x = -(width / 2) + getTileX(col);
			element.velocity.x = 0;
		} else if (dirX < 0) {
			col = getTileCol(left);
			element.x = (width / 2) + getTileX(col + 1);
			element.velocity.x = 0;
		}

	}
	function isSolidTileAt(x, y) {
		var col = Math.floor(x / GRID_WIDTH);
		var row = Math.floor(y / GRID_HEIGHT);
		var tile = LEVELS[currentLevel].map[row][col];
		return (tile > 0) ? true : false;
	}
	function getTileCol(x) {
		return Math.floor(x / GRID_WIDTH);
	}
	function getTileRow(y) {
		return Math.floor(y / GRID_HEIGHT);
	}
	function getTileX(col) {
		return col * GRID_WIDTH;
	}
	function getTileY(row) {
		return row * GRID_HEIGHT;
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

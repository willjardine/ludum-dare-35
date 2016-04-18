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

	var BIRD_MOVE_SPEED = 32;

	var LEVELS = [
		{
			map: [
				[00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
				[00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
				[00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
				[00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
				[00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
				[00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
				[00, 00, 00, 00, 00, 00, 00, 03, 00, 00],
				[00, 00, 00, 00, 00, 10, 11, 11, 11, 11],
				[11, 11, 11, 11, 11, 16, 14, 14, 14, 14]
			],
			coin: [7, 5],
			enemies: [],
			player: [1, 7]
		},
		{
			map: [
				[00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
				[00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
				[00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
				[00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 17, 17, 17, 00, 00, 00],
				[00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 17],
				[00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 17, 17, 00, 00, 00, 00, 00, 00, 00],
				[00, 00, 00, 00, 00, 00, 17, 17, 17, 00, 00, 00, 00, 00, 00, 00, 00, 17, 17, 00],
				[00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
				[00, 00, 17, 17, 17, 00, 00, 00, 00, 01, 02, 00, 00, 00, 17, 17, 00, 00, 00, 00],
				[02, 00, 00, 00, 00, 00, 00, 06, 06, 04, 05, 06, 06, 00, 00, 00, 00, 00, 00, 00],
				[05, 00, 00, 00, 07, 09, 10, 11, 11, 11, 11, 11, 12, 07, 08, 08, 09, 00, 03, 00],
				[11, 12, 07, 09, 10, 11, 16, 14, 14, 14, 14, 14, 18, 11, 11, 11, 11, 11, 11, 11],
				[14, 18, 11, 11, 16, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14]
			],
			coin: [18, 9],
			enemies: [],
			player: [1, 10]
		},
		{
			map: [
				[00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
				[00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
				[00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
				[00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
				[00, 00, 00, 00, 00, 00, 00, 00, 03, 00],
				[00, 00, 00, 00, 00, 00, 00, 10, 11, 11],
				[00, 00, 00, 00, 00, 00, 10, 16, 14, 14],
				[11, 12, 00, 00, 00, 10, 16, 14, 14, 14],
				[14, 18, 11, 11, 11, 16, 14, 14, 14, 14]
			],
			coin: [8, 3],
			enemies: [
				{type:'spikes', x:2, y:7, rangeX:0, rangeY:0, speed:0},
				{type:'spikes', x:3, y:7, rangeX:0, rangeY:0, speed:0},
				{type:'spikes', x:4, y:7, rangeX:0, rangeY:0, speed:0},
				{type:'bird', x:0, y:3, rangeX:5, rangeY:0, speed:BIRD_MOVE_SPEED},
				{type:'bird', x:7, y:0, rangeX:0, rangeY:4, speed:BIRD_MOVE_SPEED}
			],
			player: [1, 6]
		}
	];

	var PLAYER_HITAREA_WIDTH = 12;
	var PLAYER_HITAREA_HEIGHT = 12;
	var PLAYER_HITAREA_RADIUS = 6;
	var COIN_HITAREA_RADIUS = 6;
	var ENEMY_HITAREA_RADIUS = 6;

	var PLAYER_MOVE_SPEED = 64;
	var PLAYER_JUMP_SPEED = 180;
	var PLAYER_GRAVITY_ACCELERATION = 400;
	var PLAYER_MAX_FALL_SPEED = 180;

	var SOLID_TILES_START_AT = 10;


//////////////////////////////////////////////////
// VARIABLES
//////////////////////////////////////////////////

	var canvas, manifest, preload, stage;
	var spriteSheet, tilesSheet;
	var background, coin, fpsLabel, player, room;
	var logo, outro, outro1, outro2, outro3, outro4;

	var currentLevel = 0;
	var cameraMaxX, cameraMaxY;
	var playerIsActive = false;

	var enemies = [];
	var movingEnemies = [];

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
			{id:'logo',			src:'assets/img/logo.gif'},
			{id:'outro-1',		src:'assets/img/outro-1.gif'},
			{id:'outro-2',		src:'assets/img/outro-2.gif'},
			{id:'outro-3',		src:'assets/img/outro-3.gif'},
			{id:'outro-4',		src:'assets/img/outro-4.gif'},
			{id:'sprites',		src:'assets/img/sprites.gif'},
			{id:'tiles',		src:'assets/img/tiles.gif'},
			// sounds
			{id:'music',		src:'assets/snd/music.ogg'},
			{id:'explosion',	src:'assets/snd/fx-explosion.ogg'},
			{id:'hit',			src:'assets/snd/fx-hit.ogg'},
			{id:'hurt',			src:'assets/snd/fx-hurt.ogg'},
			{id:'jump',			src:'assets/snd/fx-jump.ogg'},
			{id:'pickup',		src:'assets/snd/fx-pickup.ogg'},
			{id:'powerup',		src:'assets/snd/fx-powerup.ogg'}
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
		fpsLabel = new createjs.Text('', '12px Arial', '#000');
		fpsLabel.x = 3;
		fpsLabel.y = 0;
		stage.addChild(fpsLabel);

		// sprite sheet
		spriteSheet = new createjs.SpriteSheet({
			framerate: 8,
			images: [ preload.getResult('sprites') ],
			frames: {width:GRID_WIDTH, height:GRID_WIDTH, regX:GRID_WIDTH/2, regY:GRID_WIDTH/2, spacing:0, margin:0},
			animations: {
				idle: {
					frames: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3],
					speed: 0.7
				},
				hurt: 4,
				walk: [5, 7],
				jump: 8,
				fall: 9,
				boom: [10, 14, 'empty'],
				coin: {
					frames: [15, 16, 17, 18],
					speed: 0.7
				},
				empty: 19,
				bird: [20, 23],
				spikes: 24
			}
		});

		// tiles sprite sheet
		var tilesSheetAnimations = {};
		var tilesSheetTotalFrames = 18;
		for (var i=0; i<18; ++i) {
			tilesSheetAnimations['tile-'+(i+1)] = i;
		}
		tilesSheet = new createjs.SpriteSheet({
			framerate: 1,
			images: [ preload.getResult('tiles') ],
			frames: {width:GRID_WIDTH, height:GRID_WIDTH, count:tilesSheetTotalFrames, regX:0, regY:0, spacing:0, margin:0},
			animations: tilesSheetAnimations
		});

		// coin
		coin = new createjs.Sprite(spriteSheet, 'coin');

		// player
		player = new createjs.Sprite(spriteSheet, 'idle');
		player.currentAnimation = 'idle';
		player.velocity = {x:0, y:0};
		player.onGround = false;

		// room
		room = new createjs.Container();
		stage.addChild(room);

		// logo
		logo = new createjs.Bitmap( preload.getResult('logo') );

		// outro
		outro = new createjs.Container();
		outro1 = new createjs.Bitmap( preload.getResult('outro-1') );
		outro2 = new createjs.Bitmap( preload.getResult('outro-2') );
		outro3 = new createjs.Bitmap( preload.getResult('outro-3') );
		outro4 = new createjs.Bitmap( preload.getResult('outro-4') );
		stage.addChild(outro);

		// load first level
		changeLevel(0);

		// start game loop
		createjs.Ticker.timingMode = createjs.Ticker.RAF;
		createjs.Ticker.addEventListener('tick', update);

		// register events
		document.onkeydown = handleKeyDown;
		document.onkeyup = handleKeyUp;

	}


//////////////////////////////////////////////////
// CHANGE LEVEL
//////////////////////////////////////////////////

	function changeLevel(level) {

		enemies = [];
		movingEnemies = [];
		outro.removeAllChildren();
		room.removeAllChildren();
		room.x = room.y = 0;
		jumpKeyHeld = leftKeyHeld = rightKeyHeld = false;

		if (level >= LEVELS.length) {
			createjs.Sound.stop();
			outro.addChild(outro1);
			createjs.Sound.play('hit', {volume:0.1});
			setTimeout(function(){
				outro.addChild(outro2);
				createjs.Sound.play('hit', {volume:0.1});
				setTimeout(function(){
					outro.addChild(outro3);
					createjs.Sound.play('pickup', {volume:0.1});
					setTimeout(function(){
						outro.addChild(outro4);
						canvas.onclick = handleClick;
						createjs.Sound.play('powerup', {volume:0.1});
					}, 1500);
				}, 1500);
			}, 1500);
			return;
		}

		currentLevel = level;

		var map = LEVELS[level].map;
		for (var y=0; y<map.length; ++y) {
			for (var x=0; x<map[y].length; ++x) {
				if (parseInt(map[y][x]) > 0) {
					var tile = new createjs.Sprite(tilesSheet, 'tile-' + map[y][x]);
					tile.x = getTileX(x);
					tile.y = getTileY(y);
					room.addChild(tile);
				}
			}
		}

		var baddies = LEVELS[level].enemies;
		for (var i=0; i<baddies.length; ++i) {
			var enemy = new createjs.Sprite(spriteSheet, baddies[i].type);
			enemy.x = (baddies[i].x * GRID_WIDTH) + (GRID_WIDTH / 2);
			enemy.y = (baddies[i].y * GRID_HEIGHT) + (GRID_HEIGHT / 2);
			room.addChild(enemy);
			enemies.push(enemy);
			if (baddies[i].speed !== 0) {

				enemy.minX = enemy.x;
				enemy.minY = enemy.y;
				enemy.x += (baddies[i].rangeX * GRID_WIDTH);
				enemy.y += (baddies[i].rangeY * GRID_HEIGHT);
				enemy.maxX = enemy.x;
				enemy.maxY = enemy.y;

				enemy.velocity = {x:0, y:0};
				if (baddies[i].rangeX !== 0) {
					enemy.velocity.x = baddies[i].speed;
				}
				if (baddies[i].rangeY !== 0) {
					enemy.velocity.y = baddies[i].speed;
				}
				enemy.scaleX = -1;

				movingEnemies.push(enemy);
			}
		}

		cameraMaxX = (map[0].length * GRID_WIDTH) - GAME_WIDTH;
		cameraMaxY = (map.length * GRID_HEIGHT) - GAME_HEIGHT;
		playerIsActive = true;

		coin.x = (LEVELS[level].coin[0] * GRID_WIDTH) + (GRID_WIDTH / 2);
		coin.y = (LEVELS[level].coin[1] * GRID_HEIGHT) + (GRID_HEIGHT / 2);
		coin.gotoAndPlay('coin');
		room.addChild(coin);

		player.currentAnimation = 'idle';
		player.onGround = true;
		player.x = (LEVELS[level].player[0] * GRID_WIDTH) + (GRID_WIDTH / 2);
		player.y = (LEVELS[level].player[1] * GRID_HEIGHT) + GRID_HEIGHT - (PLAYER_HITAREA_HEIGHT / 2);
		player.velocity.x = 0;
		player.velocity.y = 0;
		player.scaleX = 1;
		player.gotoAndPlay('idle');
		room.addChild(player);

		if (level === 0) {
			room.addChild(logo);
			createjs.Sound.play('music', {interrupt:createjs.Sound.INTERRUPT_NONE, loop:-1, volume:0.1});
		}

		stage.update();
	}


//////////////////////////////////////////////////
// UPDATE LOOP
//////////////////////////////////////////////////

	function update(event) {

		var deltaTime = event.delta / 1000;
		deltaTime = Math.clamp(deltaTime, 0, 0.05);

		updateEnemies(deltaTime);
		if (playerIsActive) {
			updatePlayer(deltaTime);
			updateEnemyPlayerCollisions();
			updateCoinPlayerCollisions();
			updateCamera();
		}

		fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + ' fps';
		stage.update(event);
	}
	function updatePlayer(deltaTime) {

		// get direction
		var dirX = 0;
		dirX += leftKeyHeld ? -1 : 0;
		dirX += rightKeyHeld ? 1 : 0;

		// update velocity
		player.velocity.x = dirX * PLAYER_MOVE_SPEED;
		player.velocity.y = Math.clamp(player.velocity.y + PLAYER_GRAVITY_ACCELERATION * deltaTime, -PLAYER_MAX_FALL_SPEED, PLAYER_MAX_FALL_SPEED);

		// start jumping?
		if (jumpKeyHeld && player.onGround) {
			jumpKeyHeld = false;
			createjs.Sound.play('jump', {volume:0.1});
			player.velocity.y = -PLAYER_JUMP_SPEED;
		}

		// update x position
		player.x += player.velocity.x * deltaTime;
		if (player.x < PLAYER_HITAREA_WIDTH / 2) {
			dirX = 0;
			player.x = PLAYER_HITAREA_WIDTH / 2;
			player.velocity.x = 0;
		} else if (player.x > (LEVELS[currentLevel].map[0].length * GRID_WIDTH) - (PLAYER_HITAREA_WIDTH / 2)) {
			dirX = 0;
			player.x = (LEVELS[currentLevel].map[0].length * GRID_WIDTH) - (PLAYER_HITAREA_WIDTH / 2);
			player.velocity.x = 0;
		}
		updateTileCollision(player, dirX, 0, PLAYER_HITAREA_WIDTH, PLAYER_HITAREA_HEIGHT);

		// update y position
		var dirY = 0;
		dirY = (player.velocity.y < 0) ? -1 : dirY;
		dirY = (player.velocity.y > 0) ? 1 : dirY;
		player.y += player.velocity.y * deltaTime;
		if (player.y < PLAYER_HITAREA_HEIGHT / 2) {
			dirY = 0;
			player.y = PLAYER_HITAREA_HEIGHT / 2;
			player.velocity.y = 0;
		} else if (player.y > (LEVELS[currentLevel].map.length * GRID_HEIGHT) - (PLAYER_HITAREA_HEIGHT / 2)) {
			dirY = 0;
			player.y = (LEVELS[currentLevel].map.length * GRID_HEIGHT) - (PLAYER_HITAREA_HEIGHT / 2);
			player.velocity.y = 0;
		}
		updateTileCollision(player, 0, dirY, PLAYER_HITAREA_WIDTH, PLAYER_HITAREA_HEIGHT);

		// on ground?
		var wasOnGround = player.onGround;
		player.onGround = isSolidTileAt(player.x - (PLAYER_HITAREA_WIDTH / 2) + 1, player.y + (PLAYER_HITAREA_HEIGHT / 2)) || isSolidTileAt(player.x + (PLAYER_HITAREA_WIDTH / 2) - 1, player.y + (PLAYER_HITAREA_HEIGHT / 2));
		if (wasOnGround === false && player.onGround) {
			createjs.Sound.play('hit', {volume:0.1});
		}

		// update flipping
		player.scaleX = (dirX < 0) ? -1 : player.scaleX;
		player.scaleX = (dirX > 0) ? 1 : player.scaleX;

		// update animation
		var animation = player.currentAnimation;
		if (player.onGround) {
			if (dirX !== 0) {
				animation = 'walk';
			} else {
				animation = 'idle';
			}
		} else {
			if (dirY < 0) {
				animation = 'jump';
			} else {
				animation = 'fall';
			}
		}
		if (animation !== player.currentAnimation) {
			player.currentAnimation = animation;
			player.gotoAndPlay(animation);
		}

	}
	function updateEnemies(deltaTime) {
		for (var i=0; i<movingEnemies.length; ++i) {
			movingEnemies[i].x += movingEnemies[i].velocity.x * deltaTime;
			movingEnemies[i].y += movingEnemies[i].velocity.y * deltaTime;
			if (movingEnemies[i].x < movingEnemies[i].minX) {
				movingEnemies[i].x = movingEnemies[i].minX;
				movingEnemies[i].velocity.x *= -1;
				movingEnemies[i].scaleX = 1;
			} else if (movingEnemies[i].x > movingEnemies[i].maxX) {
				movingEnemies[i].x = movingEnemies[i].maxX;
				movingEnemies[i].velocity.x *= -1;
				movingEnemies[i].scaleX = -1;
			}
			if (movingEnemies[i].y < movingEnemies[i].minY) {
				movingEnemies[i].y = movingEnemies[i].minY;
				movingEnemies[i].velocity.y *= -1;
			} else if (movingEnemies[i].y > movingEnemies[i].maxY) {
				movingEnemies[i].y = movingEnemies[i].maxY;
				movingEnemies[i].velocity.y *= -1;
			}
		}
	}
	function updateEnemyPlayerCollisions() {
		for (var i=0; i<enemies.length; ++i) {
			if (playerIsActive && checkSpriteCollision(player, enemies[i], PLAYER_HITAREA_RADIUS, ENEMY_HITAREA_RADIUS)) {
				playerIsActive = false;
				player.gotoAndPlay('hurt');
				createjs.Sound.play('hurt', {volume:0.1});
				setTimeout(function(){
					changeLevel(currentLevel);
					createjs.Sound.play('explosion', {volume:0.1});
				}, 500);
			}
		}
	}
	function updateCoinPlayerCollisions() {
		if (playerIsActive && checkSpriteCollision(player, coin, PLAYER_HITAREA_RADIUS, COIN_HITAREA_RADIUS)) {
			playerIsActive = false;
			coin.gotoAndPlay('boom');
			player.gotoAndPlay('boom');
			createjs.Sound.play('pickup', {volume:0.1});
			setTimeout(function(){
				changeLevel(currentLevel + 1);
				createjs.Sound.play('powerup', {volume:0.1});
			}, 1000);
		}
	}
	function updateCamera() {
		var x = player.x - (GAME_WIDTH * 0.4);
		var y = player.y - (GAME_HEIGHT / 2);
		x = Math.clamp(x, 0, cameraMaxX);
		y = Math.clamp(y, 0, cameraMaxY);
		room.x = -x;
		room.y = -y;
	}


//////////////////////////////////////////////////
// CHECK COLLISIONS
//////////////////////////////////////////////////

	function checkSpriteCollision(sprite1, sprite2, radius1, radius2) {
		var dx = sprite1.x - sprite2.x;
		var dy = sprite1.y - sprite2.y;
		var distance = Math.sqrt(dx * dx + dy * dy);
		if (distance < radius1 + radius2) {
			return true;
		}
		return false;
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
		if (LEVELS[currentLevel].map[row] === undefined || LEVELS[currentLevel].map[row][col] === undefined) {
			return false;
		}
		var tile = LEVELS[currentLevel].map[row][col];
		return (tile >= SOLID_TILES_START_AT) ? true : false;
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
		changeLevel(0);
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

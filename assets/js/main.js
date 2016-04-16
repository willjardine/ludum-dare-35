
//////////////////////////////////////////////////
// CONSTANTS
//////////////////////////////////////////////////

	var GRID_WIDTH = 16,
		GRID_HEIGHT = 16,
		GAME_WIDTH = GRID_WIDTH * 9,
		GAME_HEIGHT = GRID_HEIGHT * 6;


//////////////////////////////////////////////////
// SETUP CANVAS
//////////////////////////////////////////////////

	var canvas = document.getElementById('canvas');
	canvas.width = GAME_WIDTH;
	canvas.height = GAME_HEIGHT;


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
	window.addEventListener('resize', resizeWindow);
	window.addEventListener('orientationchange', resizeWindow);
	resizeWindow();

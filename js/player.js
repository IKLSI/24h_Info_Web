function throttle(func, limit) {
	let lastFunc;
	let lastRan;

	return function () {
		const context = this;
		const args = arguments;

		if (!lastRan) {
			func.apply(context, args);
			lastRan = Date.now();
		} else {
			clearTimeout(lastFunc);
			lastFunc = setTimeout(function () {
				if ((Date.now() - lastRan) >= limit) {
					func.apply(context, args);
					lastRan = Date.now();
				}
			}, limit - (Date.now() - lastRan));
		}
	};
}

const throttledMovePlayer = throttle(movePlayer, 100);

document.addEventListener('keydown', function (event) {

	switch (event.key) {
		case 'ArrowUp':
			movePlayer("up");
			event.preventDefault();
			break;
		case 'ArrowDown':
			movePlayer("down");
			event.preventDefault();
			break;
		case 'ArrowLeft':
			movePlayer("left");
			event.preventDefault();
			break;
		case 'ArrowRight':
			movePlayer("right");
			event.preventDefault();
			break;
		default:
			break;
	}

	redrawCanvas();
});

function movePlayer(dir) {
	const teamPassword = "wQwJPoMI8v";
	const teamPlayerNb = "8";

	const requestBody = {
		direction: dir
	};

	fetch('https://24hweb.iutv.univ-paris13.fr/server/move', {
		method: 'POST',
		headers: {
			'TeamPassword': teamPassword,
			'TeamPlayerNb': teamPlayerNb,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(requestBody)
	})
}

function redrawCanvas() {
	const canvas = document.getElementById('tileset');
	const ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	loadClient();
}
let mapData = [];
let playerName = "";

window.onload = function () {
	loadJSONMap2();
	loadJSONMapAPI();
	redrawCanvas();
};

function drawLayer(ctx, layer, tilesetImage, tileWidth, tileHeight) {
	const tilesPerRow = Math.floor(tilesetImage.width / tileWidth);

	layer.forEach((row, y) => {
		row.forEach((tileID, x) => {
			if (tileID >= 0) {
				const sx = (tileID % tilesPerRow) * tileWidth;
				const sy = Math.floor(tileID / tilesPerRow) * tileHeight;
				const dx = x * tileWidth;
				const dy = y * tileHeight;

				ctx.drawImage(tilesetImage, sx, sy, tileWidth, tileHeight, dx, dy, tileWidth, tileHeight);
			}
		});
	});
}

function loadJSONMap2() {
	fetch('/data/map2.json')
		.then(response => {
			if (!response.ok) {
				throw new Error('Erreur HTTP! statut: ' + response.status);
			}
			return response.json();
		})
		.then(data => {
			mapData = data;
			mapData.forEach(data => {
				const canvas = document.getElementById('tileset');
				const ctx = canvas.getContext('2d');
				const tileWidth = 16;
				const tileHeight = 16;
				const tilesetImage = new Image();

				tilesetImage.src = '/assets/tileset.png';

				tilesetImage.onload = function () {
					drawLayer(ctx, data.view, tilesetImage, tileWidth, tileHeight);
				};
			});
		})
		.catch(error => {
			console.error('Erreur lors de la récupération du fichier JSON : ', error);
		}
	);
}

function loadJSONMapAPI() {
	const teamPassword = "wQwJPoMI8v";
	const teamPlayerNb = "8";

	fetch('https://24hweb.iutv.univ-paris13.fr/server/get-update', {
		method: 'GET',
		headers: {
			'TeamPassword': teamPassword,
			'TeamPlayerNb': teamPlayerNb
		}
	})
	.then(response => response.json())
	.then(data => {
		var paragraphe = document.getElementById("namePlayer");

		mapData = data.layers;
		playerName = data.player.name;

		if (paragraphe) {
			var texte = document.createTextNode(playerName);
			paragraphe.textContent = "Nom du joueur : " + playerName;
		}

		mapData.forEach(data => {
			const canvas = document.getElementById('tileset');
			const ctx = canvas.getContext('2d');
			const tileWidth = 16;
			const tileHeight = 16;
			const tilesetImage = new Image();

			tilesetImage.src = '/assets/tileset.png';

			tilesetImage.onload = function () {
				drawLayer(ctx, data.view, tilesetImage, tileWidth, tileHeight);
			};
		});
	})
	.catch(error => console.error('Erreur:', error));
}

function drawPlayer(ctx, x, y, tilesetImage, tileWidth, tileHeight, direction, name, team) {
	var tileID = -1;

	switch (direction) {
		case "up":
			tileID = 9254;
			break;
		case "down":
			tileID = 9114;
			break;
		case "left":
			tileID = 9394;
			break;
		case "right":
			tileID = 9534;
			break;
		default:
			break;
	}

	const tilesPerRow = Math.floor(tilesetImage.width / tileWidth);
	const sx = (tileID % tilesPerRow) * tileWidth;
	const sy = Math.floor(tileID / tilesPerRow) * tileHeight;
	const dx = x * tileWidth;
	const dy = y * tileHeight;

	ctx.drawImage(tilesetImage, sx, sy, tileWidth * 2, tileHeight * 4, dx, dy, tileWidth * 2, tileHeight * 4);
	ctx.fillText(team, dx, dy);
}

function loadClient() {

	const chat = document.getElementById('chat');
	const teamPassword = "wQwJPoMI8v";
	const teamPlayerNb = "8";
	const canvas = document.getElementById('tileset');
	const ctx = canvas.getContext('2d');
	const tileWidth = 16;
	const tileHeight = 16;
	const tilesetImage = new Image();

	tilesetImage.src = '/assets/tileset.png';

	fetch('https://24hweb.iutv.univ-paris13.fr/server/get-update', {
		method: 'GET',
		headers: {
			'TeamPassword': teamPassword,
			'TeamPlayerNb': teamPlayerNb
		}
	})
	.then(response => response.json())
	.then(data => {

		while (chat.firstChild) {
			chat.removeChild(chat.firstChild);
		}

		playerMessages = data.player.messages;
		playerMessages.forEach(message => {
			const p = document.createElement('p');
			p.textContent = message.name + ': ' + message.text;

			if (message.important)
				p.className = 'text-red-500';

			chat.appendChild(p);
		});

		mapData = data.layers;
		mapData.forEach(data => {
			drawLayer(ctx, data.view, tilesetImage, tileWidth, tileHeight);
		});

		playersData = data.players;
		playersData.forEach(data => {
			drawPlayer(ctx, data.viewX, data.viewY, tilesetImage, tileWidth, tileHeight, data.lastDirection, data.name, data.team);
		});
	})
	.catch(error => console.error('Erreur:', error));
}
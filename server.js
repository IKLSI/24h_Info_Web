const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;
const fs = require('fs');

app.use(express.static('public'));
app.use(express.static('html'));
app.use(express.static('css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/html', express.static(__dirname + '/html'));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

function genereMap() {
	let mapData = JSON.parse(fs.readFileSync('map-dev.json', 'utf8'));
	let layers = mapData.layers;

	let width = mapData.width;
	let height = mapData.height;

	let centerX = 3+4;
	let centerY = 5;

	let windowWidth = 21;
	let windowHeight = 21;

	let startX = Math.max(0, centerX - Math.floor(windowWidth / 2));
	let startY = Math.max(0, centerY - Math.floor(windowHeight / 2));
	let endX = Math.min(width, startX + windowWidth);
	let endY = Math.min(height, startY + windowHeight);

	let tabLayers = [];

	for (let l = 0; l < layers.length; l++) {
		let layer = layers[l];
		let cells = [];
		for (let y = 0; y < windowHeight; y++) {
			let row = [];
			for (let x = 0; x < windowWidth; x++) {
				let globalX = startX + x;
				let globalY = startY + y;
				if (globalX >= 0 && globalX < width && globalY >= 0 && globalY < height) {
					let index = globalY * width + globalX;
					row.push(layer.data[index] - 1);
				} else {
					row.push(-1);
				}
			}
			cells.push(row);
		}

		let tabCellsCentre = [];
		for (let y = 0; y < windowHeight; y++) {
			let row = [];
			for (let x = 0; x < windowWidth; x++) {
				try {
					if(cells[y-centerY][x-centerX] != null)
						row.push(cells[y-centerY][x-centerX]);
					else
						row.push(-1);
				} catch (error) {
					row.push(-1);
				}
			}
			tabCellsCentre.push(row);
		}

		let newLayer = {};
		newLayer.view = tabCellsCentre;
		newLayer.name = layer.name;
		tabLayers.push(newLayer);
	}

	return tabLayers;
}

app.get('/get-update', (req, res) => {
	let data = {
		player: {
			id: 101,
			teamPlayerNb: 8,
			name: "Player-10-8",
			team: "Feur",
			x: 3,
			y: 5,
			lastDirection: "right",
			messages: []
		},
		teams: {
			food: 0,
			devkarma: 0,
			crystal: 0
		},
		layers: genereMap(),
		players: [
			{
				id: 38,
				name: "Player-4-5",
				team: "Breizh Power",
				x: 68,
				y: 93,
				lastDirection: "right",
				viewX: 8,
				viewY: 18
			},
			{
				id: 101,
				name: "Player-10-8",
				team: "Feur",
				x: 70,
				y: 85,
				lastDirection: "right",
				viewX: 10,
				viewY: 10
			},
			{
				id: 106,
				name: "Player-11-3",
				team: "Les Synazes",
				x: 69,
				y: 87,
				lastDirection: "right",
				viewX: 9,
				viewY: 12
			},
			{
				id: 173,
				name: "Player-18-0",
				team: "Les Htmlspecialchars",
				x: 70,
				y: 87,
				lastDirection: "right",
				viewX: 10,
				viewY: 12
			},
			{
				id: 174,
				name: "Player-18-1",
				team: "Les Htmlspecialchars",
				x: 69,
				y: 83,
				lastDirection: "down",
				viewX: 9,
				viewY: 8
			},
			{
				id: 192,
				name: "Player-19-9",
				team: "En legende",
				x: 69,
				y: 89,
				lastDirection: "right",
				viewX: 9,
				viewY: 14
			},
			{
				id: 245,
				name: "Player-25-2",
				team: "\"Error 418: We Are Teapots\"",
				x: 69,
				y: 87,
				lastDirection: "right",
				viewX: 9,
				viewY: 12
			},
			{
				id: 251,
				name: "Player-25-8",
				team: "\"Error 418: We Are Teapots\"",
				x: 69,
				y: 87,
				lastDirection: "up",
				viewX: 9,
				viewY: 12
			},
			{
				id: 304,
				name: "Player-31-1",
				team: "Bourg Force Two",
				x: 69,
				y: 88,
				lastDirection: "left",
				viewX: 9,
				viewY: 13
			},
			{
				id: 325,
				name: "Player-33-2",
				team: "Dream t'IFS",
				x: 68,
				y: 86,
				lastDirection: "right",
				viewX: 8,
				viewY: 11
			},
			{
				id: 344,
				name: "Player-35-1",
				team: "La haine",
				x: 71,
				y: 82,
				lastDirection: "left",
				viewX: 11,
				viewY: 7
			}
		],
		test_get_update_1: true
	};

	res.json(data);
});

app.get('/hello', (req, res) => {
	const name = req.query.hello;
	res.send('Hello ' + name);
  });

app.listen(port, () => {
	console.log('Server app listening on port ' + port);
});
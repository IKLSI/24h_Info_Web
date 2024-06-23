document.addEventListener('DOMContentLoaded', () => {
	const playerForm = document.getElementById('playerForm');
	const canvas = document.getElementById('tileset');

	redrawCanvas();

	const storedPlayerName = localStorage.getItem('playerName');
	const storedPlayerNumber = localStorage.getItem('playerNumber');
	const storedTeamPassword = localStorage.getItem('teamPassword');

	if (storedPlayerName && storedPlayerNumber && storedTeamPassword) {
		document.getElementById('playerName').value = storedPlayerName;
		document.getElementById('playerNumber').value = storedPlayerNumber;
		document.getElementById('teamPassword').value = storedTeamPassword;
		canvas.classList.remove('hidden');
	}

	playerForm.addEventListener('submit', (event) => {
		event.preventDefault();

		const playerName = document.getElementById('playerName').value;
		const playerNumber = document.getElementById('playerNumber').value;
		const teamPassword = document.getElementById('teamPassword').value;

		localStorage.setItem('playerName', playerName);
		localStorage.setItem('playerNumber', playerNumber);
		localStorage.setItem('teamPassword', teamPassword);

		const data = {
			name: playerName
		};

		fetch('https://24hweb.iutv.univ-paris13.fr/server/set-player-name', {
			method: 'POST',
			headers: {
				'TeamPassword': teamPassword,
				'TeamPlayerNb': playerNumber,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		})
		.then(response => response.json())
		.then(data => {
			canvas.classList.remove('hidden');
			socket.send(JSON.stringify({ action: "register", teamPassword: 'wQwJPoMI8v', teamPlayerNb: playerNumber }));
			document.getElementById('playerName').value = '';
			document.getElementById('playerNumber').value = '';
			document.getElementById('teamPassword').value = '';
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	});
});
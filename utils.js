const rectangularCollision = ({ rectangle1, rectangle2 }) => {
	return (
		rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
		rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
		rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
		rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
	);
};

const determineWinner = ({ player, enemy }) => {
	clearTimeout(timerId);
	const displayText = document.querySelector('#displayText');
	if (player.health === enemy.health) {
		displayText.innerHTML = 'Tie!';
	} else if (player.health > enemy.health) {
		displayText.innerHTML = 'Player 1 Wins!';
	} else {
		displayText.innerHTML = 'Player 2 Wins!';
	}
	displayText.style.display = 'flex';
};

const decreaseTimer = (timer) => {
	if (timer <= 0) {
		determineWinner({ player, enemy });
		return;
	}
	document.querySelector('#timer').innerHTML = timer;
	timerId = setTimeout(() => {
		decreaseTimer(timer - 1);
	}, 1000);
};
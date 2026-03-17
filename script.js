const board = document.querySelector(".board");
const startBtn = document.querySelector(".btn-start");
const restartBtn = document.querySelector(".btn-restart");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const modal = document.querySelector(".modal");
let scoreElement = document.querySelector("#score");
let highScoreElement = document.querySelector("#high-score");
let timeElement = document.querySelector("#time");

const blockHeight = 50;
const blockWeight = 50;

let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = `00:00`;

highScoreElement.innerHTML = highScore;

const rows = Math.floor(board.clientHeight / blockHeight);
const colms = Math.floor(board.clientWidth / blockWeight);
let intervalId = null;
let timerIntervalId = null;

let food = {
	x: Math.floor(Math.random() * rows),
	y: Math.floor(Math.random() * colms),
};
const blocks = [];
let snake = [
	{
		x: 1,
		y: 3,
	},
	{
		x: 1,
		y: 4,
	},
	{
		x: 1,
		y: 5,
	},
];

let direction = "right";

for (let row = 0; row < rows; row++) {
	for (let colm = 0; colm < colms; colm++) {
		const block = document.createElement("div");
		block.classList.add("block");
		board.appendChild(block);
		blocks[`${row}-${colm}`] = block;
	}
}

function render() {
	let head = null;
	blocks[`${food.x}-${food.y}`].classList.add("food");
	if (direction === "left") {
		head = { x: snake[0].x, y: snake[0].y - 1 };
	} else if (direction === "right") {
		head = { x: snake[0].x, y: snake[0].y + 1 };
	} else if (direction === "down") {
		head = { x: snake[0].x + 1, y: snake[0].y };
	} else if (direction === "up") {
		head = { x: snake[0].x - 1, y: snake[0].y };
	}

	if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= colms) {
    clearInterval(timerIntervalId)
		restartGame();
		clearInterval(intervalId);
	}

	if (head.x == food.x && head.y == food.y) {
		blocks[`${food.x}-${food.y}`].classList.remove("food");
		food = {
			x: Math.floor(Math.random() * rows),
			y: Math.floor(Math.random() * colms),
		};
		blocks[`${food.x}-${food.y}`].classList.add("food");
		snake.push(head);

		score += 1;
		scoreElement.innerHTML = score;

		if (score > highScore) {
			highScore = score;
			highScoreElement.innerHTML = score;
			localStorage.setItem("highScore", highScore);
		}
	}

	snake.forEach((body) => {
		blocks[`${body.x}-${body.y}`].classList.remove("fill");
	});
	snake.unshift(head);
	snake.pop();
	snake.forEach((body) => {
		blocks[`${body.x}-${body.y}`].classList.add("fill");
	});
}

startBtn.addEventListener("click", () => {
	modal.style.display = "none";
	intervalId = setInterval(() => {
		render();
	}, 400);
	timerIntervalId = setInterval(() => {
		let [min, sec] = time.split(":").map(Number);
		if (sec == 59) {
			min += 1;
			sec = 0;
		} else {
			sec += 1;
		}
		time = `${min}:${sec}`;
		timeElement.innerHTML = time;
	}, 1000);
});

restartBtn.addEventListener("click", () => {
	modal.style.display = "none";
	snake = [
		{
			x: 1,
			y: 3,
		},
		{
			x: 1,
			y: 4,
		},
		{
			x: 1,
			y: 5,
		},
	];
	direction = "right";
	timerIntervalId = setInterval(() => {
		let [min, sec] = time.split(":").map(Number);
		if (sec == 59) {
			min += 1;
			sec = 0;
		} else {
			sec += 1;
		}
		time = `${min}:${sec}`;
		timeElement.innerHTML = time;
	}, 1000);
	intervalId = setInterval(() => {
		render();
	}, 400);
});

function restartGame() {
	score = 0;
	time = `00:00`;
	scoreElement.innerHTML = score;
	timeElement.innerHTML = time;
	highScoreElement.innerHTML = highScore;
	modal.style.display = "flex";
	startGameModal.style.display = "none";
	gameOverModal.style.display = "flex";
}

addEventListener("keydown", (event) => {
	if (event.key == "ArrowRight") {
		direction = "right";
	} else if (event.key == "ArrowLeft") {
		direction = "left";
	} else if (event.key == "ArrowUp") {
		direction = "up";
	} else if (event.key == "ArrowDown") {
		direction = "down";
	}
});

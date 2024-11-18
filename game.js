// Initialize game
const moves = ['rock', 'paper', 'scissors'];
const qTableKey = 'rps_q_table';

// Load Q-table from localStorage or initialize it
let qTable = JSON.parse(localStorage.getItem(qTableKey)) || {
    rock: { rock: 0, paper: 0, scissors: 0 },
    paper: { rock: 0, paper: 0, scissors: 0 },
    scissors: { rock: 0, paper: 0, scissors: 0 }
};

// Q-learning parameters
const epsilon = 0.1;  // Exploration vs Exploitation
const alpha = 0.5;    // Learning rate
const gamma = 0.9;    // Discount factor

// Function to get winner
function getWinner(playerMove, aiMove) {
    if (playerMove === aiMove) {
        return 'draw';
    } else if (
        (playerMove === 'rock' && aiMove === 'scissors') ||
        (playerMove === 'paper' && aiMove === 'rock') ||
        (playerMove === 'scissors' && aiMove === 'paper')
    ) {
        return 'player';
    } else {
        return 'ai';
    }
}

// AI move selection (based on Q-learning)
function chooseAIMove(playerMove) {
    if (Math.random() < epsilon) {
        return moves[Math.floor(Math.random() * 3)];  // Exploration (random move)
    } else {
        return getBestAIMove(playerMove);  // Exploitation (best learned move)
    }
}

// Get the best move for the AI based on the player's move
function getBestAIMove(playerMove) {
    return Object.keys(qTable[playerMove]).reduce((bestMove, move) => {
        return qTable[playerMove][move] > qTable[playerMove][bestMove] ? move : bestMove;
    });
}

// Update Q-table based on the result
function updateQTable(playerMove, aiMove, reward) {
    const currentQ = qTable[playerMove][aiMove];
    const futureMaxQ = Math.max(...Object.values(qTable[aiMove]));  // Max future Q-value
    const newQ = currentQ + alpha * (reward + gamma * futureMaxQ - currentQ);
    qTable[playerMove][aiMove] = newQ;

    // Save updated Q-table to localStorage
    localStorage.setItem(qTableKey, JSON.stringify(qTable));
}

// Play the game when a button is clicked
function playGame(playerMove) {
    const aiMove = chooseAIMove(playerMove);
    const winner = getWinner(playerMove, aiMove);

    // Determine reward based on the result
    let reward;
    if (winner === 'draw') {
        reward = 0;
    } else if (winner === 'player') {
        reward = -1;  // Loss for AI
    } else {
        reward = 1;  // Win for AI
    }

    // Update Q-table based on the game outcome
    updateQTable(playerMove, aiMove, reward);

    // Display results
    document.getElementById('player-move').textContent = playerMove;
    document.getElementById('ai-move').textContent = aiMove;
    document.getElementById('result').textContent = winner.charAt(0).toUpperCase() + winner.slice(1);
}

// Add event listeners for game buttons
document.getElementById('rock').addEventListener('click', () => playGame('rock'));
document.getElementById('paper').addEventListener('click', () => playGame('paper'));
document.getElementById('scissors').addEventListener('click', () => playGame('scissors'));

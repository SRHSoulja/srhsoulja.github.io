// Game Settings
let gameBoard = [];
let breakawaysRemaining = 0;
let lastRemovedTask = '';

// Prompt the player to set up the game
const numberOfSpaces = promptPositiveInteger("Enter the number of spaces on the game board:");
const numberOfBreakaways = promptPositiveInteger("Enter the number of breakaways for the game:");
initializeGame();

// Initialize the game board and breakaways
function initializeGame() {
  gameBoard = Array(numberOfSpaces).fill('');
  breakawaysRemaining = numberOfBreakaways;
}

// Generate the game board tiles
const boardTilesContainer = document.querySelector('.board-tiles');
for (let i = 0; i < numberOfSpaces; i++) {
  const tile = createBoardTile(i + 1); // Pass the tile number as an argument
  boardTilesContainer.appendChild(tile);
}

function createBoardTile(tileNumber) {
  const tile = document.createElement('div');
  tile.classList.add('board-tile');
  tile.setAttribute('data-tile-number', tileNumber);
  return tile;
}

// Update the game board display
function updateGameBoardDisplay() {
  const tiles = document.querySelectorAll('.board-tile');
  tiles.forEach((tile, index) => {
    tile.textContent = gameBoard[index];
  });
}

// Update the breakaways count display
function updateBreakawaysDisplay() {
  const breakawaysCount = document.querySelector('.breakaways .count');
  breakawaysCount.textContent = breakawaysRemaining;
}

// Update the last removed task display
function updateLastRemovedTaskDisplay() {
  const lastRemovedTaskElement = document.querySelector('.last-removed-task .task');
  lastRemovedTaskElement.textContent = lastRemovedTask;
}

// Roll the dice
function rollDice(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

// Handle roll dice button click
const rollDiceButton = document.querySelector('.roll-dice');
rollDiceButton.addEventListener('click', handleRollDice);

function handleRollDice() {
  rollDiceButton.removeEventListener('click', handleRollDice); // Remove the click event listener temporarily

  const diceRoll = rollDice(numberOfSpaces);

  const spot = gameBoard[diceRoll - 1];
  let alertMessage = "You landed on spot " + diceRoll + "!";
  if (spot !== '') {
    alertMessage += "\nTask: " + spot;
  }
  alert(alertMessage);

  // Check the spot
  if (spot === '') {
    // Spot is blank, prompt the player to enter a task
    const task = prompt("Enter a task for the spot:");
    if (task !== null) {
      gameBoard[diceRoll - 1] = task;
      updateGameBoardDisplay();
    }
  } else {
    // Spot has a task, prompt the player to attempt a breakaway or complete the task
    if (breakawaysRemaining > 0) {
      let choice;
      do {
        choice = prompt("Choose an option:\n1. Attempt a breakaway\n2. Complete the task");
        if (choice === '1') {
          // Attempt a breakaway
          const breakawayRoll = rollDice(6);
          alert("You rolled a " + breakawayRoll + "!");

          if ([2, 4, 5].includes(breakawayRoll)) {
            // Failed breakaway, remove a breakaway
            breakawaysRemaining--;
            alert("Breakaway failed! Breakaways Remaining: " + breakawaysRemaining);
            if (breakawaysRemaining === 0) {
              alert("No breakaways remaining. Task must be completed.");
              // Task must be completed if no breakaways remaining
              lastRemovedTask = spot;
              gameBoard[diceRoll - 1] = '';
              updateGameBoardDisplay();
              updateBreakawaysDisplay();
              updateLastRemovedTaskDisplay();
              break;
            }
          } else if (breakawayRoll === 3) {
            alert("Breakaway failed! Task must be completed.");
            // Task must be completed
            lastRemovedTask = spot;
            gameBoard[diceRoll - 1] = '';
            updateGameBoardDisplay();
            updateBreakawaysDisplay();
            updateLastRemovedTaskDisplay();
            break;
          } else if (breakawayRoll === 1) {
            // Successful breakaway, prompt the player to replace the task
            const newTask = prompt("Enter a new task for the spot:");
            if (newTask !== null) {
              gameBoard[diceRoll - 1] = newTask;
              updateGameBoardDisplay();
              updateBreakawaysDisplay();
            }
            break; // Exit the loop to return to the roll screen
          } else if (breakawayRoll === 6) {
            alert("Successful Breakaway! Splot stays");
            break; // Exit the loop to return to the roll screen
          }
        } else if (choice === '2') {
          // Complete the task
          lastRemovedTask = spot;
          gameBoard[diceRoll - 1] = '';
          updateGameBoardDisplay();
          updateLastRemovedTaskDisplay();
        }
      } while (choice !== '2' && gameBoard[diceRoll - 1] !== '');
    } else {
      alert("No breakaways remaining. Task must be completed.");
      // Task must be completed if no breakaways remaining
      lastRemovedTask = spot;
      gameBoard[diceRoll - 1] = '';
      updateGameBoardDisplay();
      updateLastRemovedTaskDisplay();
    }
  }

  // Update the breakaways count display
  updateBreakawaysDisplay();

  rollDiceButton.addEventListener('click', handleRollDice); // Add the click event listener back
}

// Handle add breakaways button click
const addBreakawaysButton = document.querySelector('.add-breakaways');
addBreakawaysButton.addEventListener('click', () => {
  const additionalBreakaways = promptPositiveInteger("Enter the number of additional breakaways:");
  breakawaysRemaining += additionalBreakaways;
  updateBreakawaysDisplay();
});

// Initialize the game board display
updateGameBoardDisplay();
updateBreakawaysDisplay();
updateLastRemovedTaskDisplay();

// Prompt the user to enter a positive integer
function promptPositiveInteger(message) {
  let input;
  do {
    input = parseInt(prompt(message));
  } while (isNaN(input) || input <= 0);
  return input;
}

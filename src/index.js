/**
 * US-01: Use querySelector() to access the elements in index.js
 */

const startButton = document.querySelector(".js-start-button");
const statusSpan = document.querySelector(".js-status");
const heading = document.querySelector(".js-heading");
const padContainer = document.querySelector(".js-pad-container");

/**
 * VARIABLES
 */
let computerSequence = []; // track the computer-generated sequence of pad presses
let playerSequence = []; // track the player-generated sequence of pad presses
let maxRoundCount = 0; // the max number of rounds, varies with the chosen level
let roundCount = 0; // track the number of rounds that have been played so far

/**
 * The `pads` array contains an array of pad objects.
 * Each pad object contains the data related to a pad: `color`, `sound`, and `selector`.
 */
const pads = [
  {
    color: "red",
    selector: document.querySelector(".js-pad-red"),
    sound: new Audio("../assets/simon-says-sound-1.mp3"),
  },
  {
    color: "blue",
    selector: document.querySelector(".js-pad-blue"),
    sound: new Audio("../assets/simon-says-sound-3.mp3"),
  },
  {
    color: "green",
    selector: document.querySelector(".js-pad-green"),
    sound: new Audio("../assets/simon-says-sound-2.mp3"),
  },
  {
    color: "yellow",
    selector: document.querySelector(".js-pad-yellow"),
    sound: new Audio("../assets/simon-says-sound-4.mp3"),
  }
];



/**
 * EVENT LISTENERS
 */
padContainer.addEventListener("click", padHandler);
startButton.addEventListener("click", startButtonHandler);

/**
 * EVENT HANDLERS
 */

/**
 * Called when the start button is clicked.
 */
function startButtonHandler() {
  setLevel();
  roundCount++;
  startButton.classList.add("hidden");
  statusSpan.classList.remove("hidden");
  playComputerTurn();
}

/**
 * Called when one of the pads is clicked.
 */
function padHandler(event) {
  const { color } = event.target.dataset;
  if (!color) return;

  const pad = pads.find(pad => pad.color === color);
  pad.sound.play();
  checkPress(color);
  return color;
}

/**
 * HELPER FUNCTIONS
 */

/**
 * Sets the level of the game given a `level` parameter.
 */
function setLevel(level = 1) {
  switch (level) {
    case 1:
      maxRoundCount = 8;
      break;
    case 2:
      maxRoundCount = 14;
      break;
    case 3:
      maxRoundCount = 20;
      break;
    case 4:
      maxRoundCount = 31;
      break;
    default:
      alert("Please enter level 1, 2, 3, or 4");
      break;
  }
}

/**
 * Activates a pad of a given color by playing its sound and light.
 */
function activatePad(color) {
  const pad = pads.find(pad => pad.color === color);
  pad.selector.classList.add("activated");
  pad.sound.play();
  setTimeout(() => {
    pad.selector.classList.remove("activated");
  }, 500);
}

/**
 * Activates a sequence of colors passed as an array to the function.
 */
function activatePads(sequence) {
  sequence.forEach((color, index) => {
    setTimeout(() => {
      activatePad(color);
    }, (index + 1) * 600);
  });
}

/**
 * Allows the computer to play its turn.
 */
function playComputerTurn() {
  padContainer.classList.add("unclickable");
  setText(statusSpan, "The computer's turn...");
  setText(heading, `Round ${roundCount} of ${maxRoundCount}`);
  const color = getRandomItem(["red", "blue", "green", "yellow"]);
  computerSequence.push(color);
  activatePads(computerSequence);
  setTimeout(() => playHumanTurn(), (computerSequence.length * 600) + 1000);
}

/**
 * Allows the player to play their turn.
 */
function playHumanTurn() {
  padContainer.classList.remove("unclickable");
  setText(statusSpan, `Your turn: ${computerSequence.length - playerSequence.length} press(es) left.`);
}

/**
 * Checks the player's selection every time the player presses on a pad during their turn.
 */
function checkPress(color) {
  playerSequence.push(color);
  const index = playerSequence.length - 1;
  const remainingPresses = computerSequence.length - playerSequence.length;
  setText(statusSpan, `Your turn: ${remainingPresses} press(es) left.`);

  if (computerSequence[index] !== playerSequence[index]) {
    resetGame("Oops! You made a mistake.");
    return;
  }

  if (remainingPresses === 0) {
    checkRound();
  }
}

/**
 * Checks each round to see if the player has completed all the rounds of the game or advance to the next round if the game has not finished.
 */
function checkRound() {
  if (playerSequence.length === maxRoundCount) {
    resetGame("Congratulations! You completed all rounds.");
  } else {
    roundCount++;
    playerSequence = [];
    setText(statusSpan, "Nice! Keep going!");
    setTimeout(() => playComputerTurn(), 1000);
  }
}

/**
 * Resets the game. Called when either the player makes a mistake or wins the game.
 */
function resetGame(text) {
  computerSequence = [];
  playerSequence = [];
  roundCount = 0;
  alert(text);
  setText(heading, "Simon Says");
  startButton.classList.remove("hidden");
  statusSpan.classList.add("hidden");
  padContainer.classList.add("unclickable");
}

/**
 * Returns a randomly selected item from a given array.
 */
function getRandomItem(collection) {
  if (collection.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * collection.length);
  return collection[randomIndex];
}

/**
 * Sets the status text of a given HTML element with a given message.
 */
function setText(element, text) {
  element.textContent = text;
}

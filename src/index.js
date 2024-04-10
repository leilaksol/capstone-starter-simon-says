/**
 * DOM SELECTORS
 */

 
 // TODO: Add the missing query selectors:
const startButton = document.querySelector(".js-start-button");
const statusSpan = document.querySelector(".js-status"); // Selects the status element
const heading = document.querySelector(".js-heading"); // Selects the heading element
const padContainer = document.querySelector(".js-pad-container"); // Selects the pad container element


/**
 * VARIABLES
 */
let computerSequence = []; // track the computer-generated sequence of pad presses
let humanSequence = []; // track the player-generated sequence of pad presses
let maxRoundCount = 0; // the max number of rounds, varies with the chosen level
let roundCount = 0; // track the number of rounds that have been played so far


 const pads = [
  {
    color: "red",
    selector: document.querySelector(".js-pad-red"),
    sound: new Audio("../assets/simon-says-sound-1.mp3"),
  },
  // Added the objects for the green, blue, and yellow pads. Use object for the red pad above as an example.
  {
    color: "green",
    selector: document.querySelector(".js-pad-green"),
    sound: new Audio("../assets/simon-says-sound-2.mp3"),
  },
  {
    color: "blue",
    selector: document.querySelector(".js-pad-blue"),
    sound: new Audio("../assets/simon-says-sound-3.mp3"),
  },
  {
    color: "yellow",
    selector: document.querySelector(".js-pad-yellow"),
    sound: new Audio("../assets/simon-says-sound-4.mp3"),
  },
];

/**
 * EVENT LISTENERS
 */

padContainer.addEventListener("click", padHandler);
// TODO: Add an event listener `startButtonHandler()` to startButton.

/**
 * EVENT HANDLERS
 */

/**
 * Called when the start button is clicked.
 *
 * 1. Call setLevel() to set the level of the game
 *
 * 2. Increment the roundCount from 0 to 1
 *
 * 3. Hide the start button by adding the `.hidden` class to the start button
 *
 * 4. Unhide the status element, which displays the status messages, by removing the `.hidden` class
 *
 * 5. Call `playComputerTurn()` to start the game with the computer going first.
 *
 */
// Now, let's define the startButtonHandler function:
function startButtonHandler() {
  // Call setLevel() to set the level of the game
  const roundsNeededToWin = setLevel(); // You can pass the level parameter if you have a way to get it from the user

  // Check if setLevel returned an error message and handle it
  if (typeof roundsNeededToWin === 'string') {
    alert(roundsNeededToWin); // Alert the user or handle the error as appropriate for your game
    return; // Exit the function to prevent further execution
  }

  // Increment the roundCount from 0 to 1
  let roundCount = 1;

  // Hide the start button by adding the 'hidden' class to the start button
  startButton.classList.add('hidden');

  // Unhide the status span by removing the 'hidden' class
  statusSpan.classList.remove('hidden');

  // Call playComputerTurn() to start the game with the computer going first
  playComputerTurn();

  // Return the elements for further use if needed
  return { startButton, statusSpan };
}

// Add the event listener to the start button outside of the startButtonHandler function
startButton.addEventListener("click", startButtonHandler);

/**
 * Called when one of the pads is clicked.
 *
 * 1. `const { color } = event.target.dataset;` extracts the value of `data-color`
 * attribute on the element that was clicked and stores it in the `color` variable
 *
 * 2. `if (!color) return;` exits the function if the `color` variable is falsy
 *
 * 3. Use the `.find()` method to retrieve the pad from the `pads` array and store it
 * in a variable called `pad`
 *
 * 4. Play the sound for the pad by calling `pad.sound.play()`
 *
 * 5. Call `checkPress(color)` to verify the player's selection
 *
 * 6. Return the `color` variable as the output
 */
function padHandler(event) {
  const { color } = event.target.dataset;
  if (!color) return;

  // Use the .find() method to retrieve the pad from the pads array
  const pad = pads.find(pad => pad.color === color);

  // Play the sound for the pad
  if (pad && pad.sound) {
    pad.sound.play();
  }

  // Call checkPress(color) to verify the player's selection
  checkPress(color);

  // Return the color variable as the output
  return color;
}

function setLevel(level = 1) {
  switch (level) {
    case 1:
      return 8;
    case 2:
      return 14;
    case 3:
      return 20;
    case 4:
      return 31;
    default:
      return "Please enter level 1, 2, 3, or 4";
  }
}


function getRandomItem(collection) {
   if (collection.length === 0) return null;
   const randomIndex = Math.floor(Math.random() * collection.length);
   return collection[randomIndex];
}

/**
 * Sets the status text of a given HTML element with a given a message
 */
function setText(element, text) {
  // Set the text content of the element to the provided text
  element.textContent = text;

  // Return the element with the updated text content
  return element;
}



function activatePad(color) {
  // Use the .find() method to retrieve the pad from the pads array
  const pad = pads.find(pad => pad.color === color);

  if (pad) {
    // Add the "activated" class to the selected pad
    pad.selector.classList.add("activated");

    // Play the sound associated with the pad
    pad.sound.play();

    // After 500ms, remove the "activated" class from the pad
    setTimeout(() => {
      pad.selector.classList.remove("activated");
    }, 500);
  }
}


function activatePads(sequence) {
  sequence.forEach((color, index) => {
    // Calculate the delay for each pad activation
    const delay = 600 * (index + 1);

    // Use setTimeout to schedule the activation of each pad
    setTimeout(() => {
      activatePad(color);
    }, delay);
  });
    activatePad("red");
    activatePad("green");
    activatePad("blue");
    activatePad("yellow");
}


function playComputerTurn() {
  // 1. Add the "unclickable" class to padContainer
  padContainer.classList.add('unclickable');

  // 2. Update the status message
  statusSpan.textContent = "The computer's turn...";

  // 3. Update the heading with the round information
  heading.textContent = `Round ${roundCount} of ${maxRoundCount}`;

  // 4. Push a randomly selected pad into the computerSequence array
const randomPad = pads[Math.floor(Math.random() * pads.length)];
computerSequence.push(randomPad.color);

  // 5. Call activatePads(computerSequence) to light up each pad
  activatePads(computerSequence);

  // 6. Call playHumanTurn() after the computer's turn is over
  setTimeout(() => {
    // Remove the "unclickable" class to allow user interaction
    padContainer.classList.remove('unclickable');
    playHumanTurn(roundCount);
  }, roundCount * 600 + 1000);
}

// You would call playComputerTurn() to start the computer's turn

/**
 * Allows the player to play their turn.
 *
 * 1. Remove the "unclickable" class from the pad container so that each pad is clickable again
 *
 * 2. Display a status message showing the player how many presses are left in the round
 */
function playHumanTurn() {
  // 1. Remove the "unclickable" class from the pad container
  padContainer.classList.remove('unclickable');

  // 2. Display a status message showing the player how many presses are left
  const pressesLeft = computerSequence.length - humanSequence.length;
  statusSpan.textContent = `Your turn: ${pressesLeft} press${pressesLeft === 1 ? '' : 'es'} left`;
}

/**
 * Checks the player's selection every time the player presses on a pad during
 * the player's turn
 *
 * 1. Add the `color` variable to the end of the `playerSequence` array
 *
 * 2. Store the index of the `color` variable in a variable called `index`
 *
 * 3. Calculate how many presses are left in the round using
 * `computerSequence.length - playerSequence.length` and store the result in
 * a variable called `remainingPresses`
 *
 * 4. Set the status to let the player know how many presses are left in the round
 *
 * 5. Check whether the elements at the `index` position in `computerSequence`
 * and `playerSequence` match. If they don't match, it means the player made
 * a wrong turn, so call `resetGame()` with a failure message and exit the function
 *
 * 6. If there are no presses left (i.e., `remainingPresses === 0`), it means the round
 * is over, so call `checkRound()` instead to check the results of the round
 *
 */
function checkPress(color) {
  // Add the color variable to the end of the playerSequence array
  playerSequence.push(color);

  // Store the index of the color variable
  const index = playerSequence.length - 1;

  // Calculate how many presses are left in the round
  const remainingPresses = computerSequence.length - playerSequence.length;

  // Set the status to let the player know how many presses are left in the round
  // Assuming you have a function or a way to update the status on the UI
  updateStatus(`Presses remaining: ${remainingPresses}`);

  // Check whether the elements at the index position match
  if (computerSequence[index] !== playerSequence[index]) {
    resetGame('Oops! Wrong sequence. Try again.');
    return; // Exit the function
  }

  // If there are no presses left, it means the round is over
  if (remainingPresses === 0) {
    checkRound();
  }
}

/**
 * Checks each round to see if the player has completed all the rounds of the game * or advance to the next round if the game has not finished.
 *
 * 1. If the length of the `playerSequence` array matches `maxRoundCount`, it means that
 * the player has completed all the rounds so call `resetGame()` with a success message
 *
 * 2. Else, the `roundCount` variable is incremented by 1 and the `playerSequence` array
 * is reset to an empty array.
 * - And the status text is updated to let the player know to keep playing (e.g., "Nice! Keep going!")
 * - And `playComputerTurn()` is called after 1000 ms (using setTimeout()). The delay
 * is to allow the user to see the success message. Otherwise, it will not appear at
 * all because it will get overwritten.
 *
 */

function checkRound() {
  // TODO: Write your code here.
}

/**
 * Resets the game. Called when either the player makes a mistake or wins the game.
 *
 * 1. Reset `computerSequence` to an empty array
 *
 * 2. Reset `playerSequence` to an empty array
 *
 * 3. Reset `roundCount` to an empty array
 */
function resetGame(text) {
  // TODO: Write your code here.

  // Uncomment the code below:
  // alert(text);
  // setText(heading, "Simon Says");
  // startButton.classList.remove("hidden");
  // statusSpan.classList.add("hidden");
  // padContainer.classList.add("unclickable");
}

/**
 * Please do not modify the code below.
 * Used for testing purposes.
 *
 */
window.statusSpan = statusSpan;
window.heading = heading;
window.padContainer = padContainer;
window.pads = pads;
window.computerSequence = computerSequence;
window.playerSequence = playerSequence;
window.maxRoundCount = maxRoundCount;
window.roundCount = roundCount;
window.startButtonHandler = startButtonHandler;
window.padHandler = padHandler;
window.setLevel = setLevel;
window.getRandomItem = getRandomItem;
window.setText = setText;
window.activatePad = activatePad;
window.activatePads = activatePads;
window.playComputerTurn = playComputerTurn;
window.playHumanTurn = playHumanTurn;
window.checkPress = checkPress;
window.checkRound = checkRound;
window.resetGame = resetGame;

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
let playerSequence = [];


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

//Code for the padHandler 
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

function setLevel(level) {
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

// Example usage
console.log(setLevel(1));  // Output: 8
console.log(setLevel(3));  // Output: 20
console.log(setLevel(5));  // Output: Please enter level 1, 2, 3, or 4



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
 */

function checkPress(color) {
  // Add the color variable to the end of the playerSequence array
  playerSequence.push(color);

  // Store the index of the color variable
  const index = playerSequence.length - 1;

  // Calculate how many presses are left in the round
  const remainingPresses = computerSequence.length - playerSequence.length;

  // Set the status to let the player know how many presses are left in the round
  // Update the text content of the statusSpan DOM element
statusSpan.textContent = `Presses remaining: ${remainingPresses}`;
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
 */

function checkRound() {
  if (playerSequence.length === maxRoundCount) {
    // The player has completed all the rounds
    resetGame('Congratulations! You have completed all the rounds!');
  } else {
    // Increment the round count and reset the playerSequence for the next round
    roundCount++;
    playerSequence = [];

    // Update the status text to let the player know to keep playing
    statusSpan.textContent = 'Nice! Keep going!'; // Corrected line

    // Call playComputerTurn() after a delay to allow the user to see the success message
    setTimeout(playComputerTurn, 1000);
  }
}


function resetGame(text) {
 
   alert(text);
   setText(heading, "Simon Says");
   startButton.classList.remove("hidden");
   statusSpan.classList.add("hidden");
  padContainer.classList.add("unclickable");
}

// Game audio, will play once 'start button' is clicked 
const audioHit = new Audio("https://github.com/gabrielsanchez/erddiagram/blob/main/hit.mp3?raw=true");
const song = new Audio("https://github.com/gabrielsanchez/erddiagram/blob/main/molesong.mp3?raw=true");

function playAudio(audioObject) {
  audioObject.play();
}

function loopAudio(audioObject) {
  audioObject.loop = true;
  playAudio(audioObject);
}

function stopAudio(audioObject) {
  audioObject.pause();
}

function play(){
  playAudio(song);
}

// Ensure the DOM is fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {
  const skillLevelSelect = document.getElementById('skillLevel');
  

  skillLevelSelect.addEventListener('change', function() {
    const selectedSkillLevel = this.value;
    setLevel(selectedSkillLevel);
  });
});

// Function to set the game difficulty based on the selected skill level
function setLevel(level) {
const sequenceLength = parseInt(level, 10);
  
console.log('Setting game difficulty to sequence length:', sequenceLength);
  // ... (rest of your game logic here)
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

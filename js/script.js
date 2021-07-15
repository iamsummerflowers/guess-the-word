//global variables
const guessedLettersElement = document.querySelector(".guessed-letters");
const guessButton = document.querySelector(".guess");
const guessInput = document.querySelector(".letter");
const currentWord = document.querySelector(".word-in-progress");
const remainingGuessesElement = document.querySelector(".remaining");
const remainingGuessesSpan = document.querySelector(".remaining span");
const message = document.querySelector(".message");
const playAgainButton = document.querySelector(".play-again");

let word = "magnolia"; //test word
let guessedLetters = []; //holds guesses
let remainingGuesses = 8; //max guesses player can make

//fetching random words
const getWord = async function (){
    const response = await fetch ("https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt");
    const words = await response.text();
    const wordArray = words.split("\n");
    const randomIndex = Math.floor(Math.random() * wordArray.length);
    word = wordArray[randomIndex].trim();
    hiddenLetters(word);
};

//Inititates game
getWord();

//display word with placeholder symbols
const hiddenLetters = function (word){
    const hiddenLetters = [];
    for (const letter of word) {
        console.log(letter);
        hiddenLetters.push("●");
    }
    currentWord.innerText = hiddenLetters.join(""); //solution code puts "" in .join() --> .join("");
};


//add button function for guessing letter
guessButton.addEventListener("click", function(e){
    e.preventDefault();
    //??A ---  Is the first part of this function is simply to set the form input section to blank?
    
    message.innerText = ""; //?1 --- code seems to work without this line// 
    
    const guess = guessInput.value; 
    //guessInput.value = ""; //??a -- Why does solution code removes this in phase 2 of instructions. // moved below conditional statement
    
    //??-B --- Instructions in 12.3 starting with "Validate.." #2 says to pass the input valye as an argument.
    //??-B cont. ---but the solution code passes it the guess variable as the argument.
    
    const goodGuess = checkInput(guess); //?2 --- code seems to work without this line// 
    if (goodGuess) {
        makeGuess(guess);
    } 
    guessInput.value = "";  //?3 --- would checkInput(guess) be a valid replacement for this line?  
    
});

const checkInput = function (input) {
    const lettersOnly = /[a-zA-Z]/;
    if(input.length === 0) {
        message.innerText = `Hey, where's the letter?!`; //?4 --- What if we use input.length = "" instead.
         
    } else if (input.length > 1 ){
        message.innerText = `Nice try! Only one letter per guess is allowed!`;

    } else if (!input.match(lettersOnly)){
        message.innerText = `Entry must be a letter between A and Z.`;
       
    } else {
        return input;
    }
    //??D --- Why does the solution code not use the new variable created in the button event listener function("guess") and instead uses "input"?
};

//function that accepts a letter as the parameter
const makeGuess = function (guess){
    guess = guess.toUpperCase();
    if (guessedLetters.includes(guess)) {
        message.innerText = "You've already guessed this letter. Try Again.";
    } else {
        guessedLetters.push(guess);
        console.log(guessedLetters);
        updateGuessesRemaining(guess);
        showGuesses(); //---solution = "showGuessedLetters" add/remving this line seems to bring/remove the "Uncaught TypeError"
        updateCurrentWord(guessedLetters); //<----HERE (prev. updateWord)
    }   
};

//function that allows us to show elements
const showGuesses = function (){
    guessedLettersElement.innerHTML = ""; //clears list
    for (const letter of guessedLetters) {
        const li = document.createElement("li");
        li.innerText = letter;
        guessedLettersElement.append(li);
    }
};

const updateCurrentWord = function(guessedLetters){
    const wordUpper = word.toUpperCase();
    const wordArray = wordUpper.split(""); //have to include ""?
    const showWord = [];
    for (const letter of wordArray){
        if(guessedLetters.includes(letter)){
            showWord.push(letter.toUpperCase()) 
        } else {
            showWord.push("●")
        }
    }
    currentWord.innerText = showWord.join("");
    gameOutcome();
};

const updateGuessesRemaining = function(guess){
    const upperWord = word.toUpperCase();
    if(!upperWord.includes(guess)){
        message.innerText = "Sorry, that letter is not in this word. Try again.";
        remainingGuesses -= 1;
    } else {
        message.innerText = "Great guess!";
    }

    if (remainingGuesses === 0){
        message.innerText = `You have no more guesses remaining. The word was ${word}. TRY AGAIN.`;
        startOver();
    } else if (remainingGuesses === 1){
        remainingGuessesSpan.innerText = "You have 1 guess remaining";
    } else { //if I add condition in else stating "remainingGuesses > 1" then dots are removed from display. Why is that?
        remainingGuessesSpan.innerText = `You have ${remainingGuesses} remaining.`
    }
};

const gameOutcome = function () {
    if (word.toUpperCase() === currentWord.innerText) { //showWord.length === word.length
        message.classList.add("win");
        message.innerHTML = `<p class="highlight"> You guessed the correct word! Congrats! </p>`;
    
        startOver();
    } 
};

const startOver = function () {
    guessButton.classList.add("hide");
    remainingGuessesElement.classList.add("hide");
    guessedLettersElement.classList.add("hide");
    playAgainButton.classList.remove("hide");
  };

playAgainButton.addEventListener("click", function () {
    message.classList.remove("win");
    guessedLetters = [];
    remainingGuesses = 8;
    remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
    guessedLettersElement.innerHTML = "";
    message.innerText = "";
    getWord();

  // show the right UI elements
  guessButton.classList.remove("hide");
  playAgainButton.classList.add("hide");
  remainingGuessesElement.classList.remove("hide");
  guessedLettersElement.classList.remove("hide");
});

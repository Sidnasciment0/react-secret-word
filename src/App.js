// CSS
import "./App.css";

// React Hooks
import { useCallback, useEffect, useState } from "react";

// Data
import { wordsList } from "./data/words";

// Components
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "endgame" },
];

const guessedQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);
  // console.log(words);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessedQty);
  const [score, setScore] = useState(0);

  // Function = Pick word and pick category
  const pickWordAndCategory = useCallback(() => {
    // Pick a randow category
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];
    // console.log(category);

    // Pick a randow word
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];
    // console.log(word)

    return { word, category };
  }, [words]);

  // Starts The Secret Word Game
  const startGame = useCallback(() => {
    // Clear all letters
    clearLetterStates();

    // Executing Pick word and pick category
    const { word, category } = pickWordAndCategory();
    // console.log(word, category);

    // Create an array of letter
    let wordLetters = word.split("");
    // console.log(wordLetters);
    // JavaScript is Case-sensitive, put the letters in LowerCase
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    // Fill states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  // Process the Letter Input
  const verifyLetter = (letter) => {
    // console.log(letter);
    const normalizedLetter = letter.toLowerCase();

    // Check if letter has already been utilized
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    // Push guessed letter or remove a chance
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };
  // console.log(guesses);
  // console.log(wrongLetters);

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  // Check if guesses ended
  useEffect(() => {
    if (guesses <= 0) {
      // Reset all states
      clearLetterStates();

      setGameStage(stages[2].name);
    }
  }, [guesses]);

  // Check win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    // Win condition
    if (guessedLetters.length === uniqueLetters.length) {
      // Add score
      setScore((actualScore) => actualScore + 100);

      // Restart game with new word
      startGame();
    }

    // console.log(uniqueLetters);
  }, [guessedLetters, letters, startGame]);

  // Restarts the game
  const retry = () => {
    setScore(0);
    setGuesses(guessedQty);

    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "endgame" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;

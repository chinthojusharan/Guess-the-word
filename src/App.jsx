import "./App.css";
import { languages } from "./languages";
import { useState } from "react";
import clsx from "clsx";
import { getFarewellText, getRandomWord } from "./util";
import Confetti from "react-confetti";
import { words } from "./words";
import { hints } from "./hints";

function App() {
  const [currentWord, setcurrentWord] = useState(() => getRandomWord());

  const [guessedLetters, setgussedLetters] = useState([]);
  // console.log(guessedLetters);

  const wrongGuessesArray = guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  );
  // console.log(wrongGuessesArray);

  const numGuessesLeft = languages.length - 1;
  const wrongGuessCount = wrongGuessesArray.length;

  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const isGameLost = wrongGuessCount >= numGuessesLeft;
  const isGameOver = isGameWon || isGameLost;

  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];
  const isLastGuessedIncorrect =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  function addGuessedletter(letter) {
    setgussedLetters((prevLetters) =>
      prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
    );
  }

  function startNewGame() {
    setcurrentWord(getRandomWord());
    setgussedLetters([]);
  }

  const languageElements = languages.map((lang, index) => {
    const isLanguageLost = index < wrongGuessCount;
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color,
    };
    // const className = clsx("chip", isLanguageLost && "lost")
    return (
      <span
        className={"chip" + (isLanguageLost ? " lost" : "")}
        style={styles}
        key={lang.name}
      >
        {lang.name}
      </span>
    );
  });

  const letterElements = currentWord.split("").map((letter, index) => {
    const shouldRevealletter = isGameLost || guessedLetters.includes(letter);
    const letterClassName = clsx(
      isGameLost && !guessedLetters.includes(letter) && "missed-letter"
    );
    return (
      <span key={index} className={letterClassName}>
        {shouldRevealletter ? letter.toUpperCase() : ""}
      </span>
    );
  });

  const keyboardElements = alphabet.split("").map((letter, index) => {
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter);
    const isWrong = isGuessed && !currentWord.includes(letter);
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    });
    // console.log(className);

    return (
      <button
        className={className}
        onClick={() => addGuessedletter(letter)}
        disabled={isGameOver}
        aria-disabled={guessedLetters.includes(letter)}
        aria-label={`letter ${letter}`}
        key={index}
      >
        {letter.toUpperCase()}
      </button>
    );
  });
  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessedIncorrect,
  });

  function renderGameStatus() {
    if (!isGameOver && isLastGuessedIncorrect) {
      return (
        <p className="farewell-message">
          {getFarewellText(languages[wrongGuessCount - 1].name)}
        </p>
      );
    }
    if (isGameWon) {
      return (
        <>
          <h2>You Win!!</h2>
          <p>Well done</p>
        </>
      );
    }
    if (isGameLost) {
      return (
        <>
          <h2>Game over! You Lost!!</h2>
          <p>You better start learnig assembly</p>
        </>
      );
    }
  }
  // function getHintForWord(word) {
  //   const wordIndex = languages.findIndex((lang) => lang.name.toLowerCase() === word.toLowerCase());

  //   if (wordIndex !== -1) {
  //     return hints[wordIndex]; // Assuming hints correspond to the index of languages
  //   }
  //   return "No hint available"; // If no match found
  // }


  // function getHintForWord(word) {
  //   const wordIndex = languages.findIndex(
  //     (lang) => lang.name.trim().toLowerCase() === word.trim().toLowerCase()
  //   );
  //   console.log("Word:", word, "Index:", wordIndex);
  //   if (wordIndex !== -1 && hints[wordIndex]) {
  //     return hints[wordIndex];
  //   }
  //   return "No hint available";
  // }

  function getHintForWord(word) {
    const normalizedWord = word.trim().toLowerCase(); // Normalize word for matching
    const wordIndex = words.findIndex(w => w.trim().toLowerCase() === normalizedWord); // Find index of the word

    // If the word is found in the list, return the corresponding hint
    if (wordIndex !== -1) {
      return hints[wordIndex];  // Get the hint at the same index
    }

    return "No hint available";  // Default message if no hint is found
  }
  
  
  
  return (
    <>
      <main>
        {isGameWon && <Confetti recycle={false} numberOfPieces={1000} />}
        <header>
          <h1>Assembly: Endgame</h1>
          <p>Guess the word within 8 attempts to keep the program Assembly!</p>
        </header>
        <section aria-live="polite" role="status" className={gameStatusClass}>
          {renderGameStatus()}
        </section>
        <section className="language-chips">{languageElements}</section>
        <section className="word">{letterElements}</section>
        <section className="sr-only" aria-live="polite" role="status">
          <p>
            {currentWord.includes(lastGuessedLetter)
              ? `Correct! ${lastGuessedLetter} is in the word`
              : `Incorrect! ${lastGuessedLetter} is not in the word`}
            You have {numGuessesLeft} attempts left
          </p>
          <p>
            Current word:{" "}
            {currentWord
              .split("")
              .map((letter) =>
                guessedLetters.includes(letter) ? letter : "blank"
              )
              .join(" ")}
          </p>
        </section>
        <section className="keyboard">{keyboardElements}</section>
        <section className="hint">
          <p>Hint: {getHintForWord(currentWord)}</p>
        </section>
        {isGameOver && (
          <button className="new-game" onClick={startNewGame}>
            New Game
          </button>
        )}
        
      </main>
    </>
  );
}

export default App;

import { useState, useEffect } from 'react'
import './App.css'
import { getRandomWord } from './word'
import Grid from './components/Grid'
import Keyboard from './components/Keyboard' 

function checkGuess(guess, answer) {
  const colors = Array(5).fill("gray")
  const answerLetters = answer.split("")
  const guessLetters = guess.split("")

  guessLetters.forEach((letter, i) => {
    if (letter === answerLetters[i]) {
      colors[i] = "green"
      answerLetters[i] = null
    }
  })

  guessLetters.forEach((letter, i) => {
    if (colors[i] === "green") return
    const idx = answerLetters.indexOf(letter)
    if (idx !== -1) {
      colors[i] = "yellow"
      answerLetters[idx] = null
    }
  })

  return { letters: guessLetters, colors }
}

function App() {

  const [answer] = useState(() => {
    const saved = localStorage.getItem("wordle-answer")
    if (saved) return saved
    const newWord = getRandomWord()
    localStorage.setItem("wordle-answer", newWord)
    return newWord
  })

  const [guesses, setGuesses] = useState(() => {
    const saved = localStorage.getItem("wordle-guesses")
    if (saved) return JSON.parse(saved)
    return []
  })

  const [currentGuess, setCurrentGuess] = useState("")

  const [gameStatus, setGameStatus] = useState(() => {
    const saved = localStorage.getItem("wordle-status")
    if (saved) return saved
    return "playing"
  })

  useEffect(() => {
    localStorage.setItem("wordle-guesses", JSON.stringify(guesses))
  }, [guesses])

  useEffect(() => {
    localStorage.setItem("wordle-status", gameStatus)
  }, [gameStatus])

  const handleKey = (key) => {
    if (gameStatus !== "playing") return

    if (key === "Enter" || key === "ENTER") {
      if (currentGuess.length !== 5) return

      const result = checkGuess(currentGuess, answer)
      const newGuesses = [...guesses, result]
      setGuesses(newGuesses)
      setCurrentGuess("")

      if (currentGuess === answer) {
        setGameStatus("won")
      } else if (newGuesses.length === 6) {
        setGameStatus("lost")
      }
    }

    else if (key === "⌫" || key === "Backspace") {
      setCurrentGuess(prev => prev.slice(0, -1))
    }

    else if (/^[a-zA-Z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key.toUpperCase())
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => handleKey(e.key)
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentGuess, guesses, gameStatus, answer])

  const resetGame = () => {
    localStorage.removeItem("wordle-answer")
    localStorage.removeItem("wordle-guesses")
    localStorage.removeItem("wordle-status")
    window.location.reload()
  }

  return (
    <div className='w-full min-h-screen bg-[#222831] flex flex-col items-center justify-center gap-4 lg:gap-6 joti'>
      <h1 className='text-white text-4xl font-bold'>Wordle</h1>

      <Grid
        guesses={guesses}
        currentGuess={currentGuess}
      />

      <Keyboard
        onKey={handleKey}
        guesses={guesses}
      />

      {gameStatus === "won" && (
        <div className="bg-green-500 text-white lg:px-8 px-4 lg:py-4 py-2 rounded-xl text-2xl lg:font-bold text-center lg:w-auto w-[90%]">
          🎉 You Won! The word was {answer}
          <button className="ml-4 bg-white text-green-500 lg:px-4 px-2 lg:py-2 py-1 rounded-xl lg:font-bold" onClick={resetGame}>
            Play Again
          </button>
        </div>
      )}

      {gameStatus === "lost" && (
        <div className="bg-red-500 text-white lg:px-8 px-4 lg:py-4 py-2 rounded-xl text-2xl lg:font-bold text-center lg:w-auto w-[90%]">
          😢 Game Over! The word was {answer}
          <button className="ml-4 bg-white text-red-500 lg:px-4 px-2 lg:py-2 py-1 rounded-xl lg:font-bold" onClick={resetGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  )
}

export default App
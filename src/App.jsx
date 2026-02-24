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
    <div className='w-full min-h-screen bg-[#252A34] flex flex-col items-center justify-center gap-4 lg:gap-6 joti'>
      <div className="flex items-center gap-15">
      <h1 className='text-gray-500 lg:text-[50px] text-[30px] font-bold'><span className='text-red-500'>W</span>o<span className='text-yellow-500'>r</span>d<span className='text-green-500'>l</span>e</h1>
     <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="currentColor" 
        strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
         onClick={resetGame}
         className="stroke-white hover:stroke-gray-300 hover:scale-105 transition duration-200 icon icon-tabler icons-tabler-outline icon-tabler-refresh">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
        </svg>
      </div>

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
          <button className="ml-4 bg-white text-green-500 lg:px-4 px-2 lg:py-2 py-1 rounded-xl lg:font-bold cursor-pointer hover:bg-white/90 active:opacity-70 transition duration-100" onClick={resetGame}>
            Play Again
          </button>
        </div>
      )}

      {gameStatus === "lost" && (
        <div className="bg-red-500 text-white lg:px-8 px-4 lg:py-4 py-2 rounded-xl text-2xl lg:font-bold text-center lg:w-auto w-[90%]">
          😢 Game Over! The word was {answer}
          <button className="ml-4 bg-white text-red-500 lg:px-4 px-2 lg:py-2 py-1 rounded-xl lg:font-bold cursor-pointer hover:bg-white/90 active:opacity-70 transition duration-100" onClick={resetGame}>
            Play Again
          </button>
        </div>
      )}
      <div className='text-gray-100 text-sm mt-4 flex flex-col justify-center items-center p-4 lg:text-xl text-lg'>Instructions
        <ul className='text-gray-200 text-sm mt-2 gap-1 flex flex-col justify-center items-start'>
          <li>1. Guess the 5-letter word in 6 tries.</li>
          <li>2. After each guess, the color of the tiles will change to show how close your guess was to the word.</li>
          <li>3. <span className='text-green-500'>Green</span> means the letter is correct and in the right position.</li>
          <li>4. <span className='text-yellow-500'>Yellow</span> means the letter is correct but in the wrong position.</li>
          <li>5. <span className='text-gray-500'>Gray</span> means the letter is not in the word at all.</li>
        </ul>
      </div>
    </div>
  )
}

export default App
import { useState, useEffect } from 'react'
import './App.css'
import { getRandomWord, isValidWord } from './word'
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

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("wordle-theme")
    return saved || "dark"
  })

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

  const [error, setError] = useState("")

  useEffect(() => {
    localStorage.setItem("wordle-guesses", JSON.stringify(guesses))
  }, [guesses])

  useEffect(() => {
    localStorage.setItem("wordle-status", gameStatus)
  }, [gameStatus])

  useEffect(() => {
    localStorage.setItem("wordle-theme", theme)
  }, [theme])

  const handleKey = (key) => {
    if (gameStatus !== "playing") return

    if (key === "Enter" || key === "ENTER") {
      if (currentGuess.length !== 5) {
        return
      }

      if (!isValidWord(currentGuess)) {
        setError("Not a valid word")
        setTimeout(() => setError(""), 3000)
        return
      }

      const result = checkGuess(currentGuess, answer)
      const newGuesses = [...guesses, result]
      setGuesses(newGuesses)
      setCurrentGuess("")
      setError("")

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
    <div className={`w-full min-h-screen flex flex-col items-center justify-center gap-4 lg:gap-6 joti ${
      theme === "dark" 
        ? "bg-[#222831]" 
        : "bg-[#EEEEEE]"
    }`}>
      <div className="flex items-center gap-15 relative w-full justify-center">
        <h1 className={`lg:text-[50px] text-[30px] font-bold text-gray-400
        }`}>
          <span className='text-red-500'>W</span>o<span className='text-yellow-500'>r</span>d<span className='text-green-500'>l</span>e
        </h1>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={`absolute right-4 lg:right-8 p-2 rounded-lg transition duration-200 ${
            theme === "dark"
              ? "bg-gray-700 hover:bg-gray-600 text-yellow-400"
              : "bg-gray-300 hover:bg-gray-400 text-gray-800"
          }`}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" 
          strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
           onClick={resetGame}
           className={`cursor-pointer lg:w-[30px] lg:h-[30px] w-[24px] h-[24px] hover:scale-105 transition duration-200 icon icon-tabler icons-tabler-outline icon-tabler-refresh ${
            theme === "dark" ? "stroke-gray-500 hover:stroke-gray-300" : "stroke-gray-700 hover:stroke-gray-900"
           }`}>
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
          </svg>
      </div>

      <Grid
        guesses={guesses}
        currentGuess={currentGuess}
        theme={theme}
      />

      {error && (
        <div className={`text-center font-bold text-lg lg:text-xl px-4 py-2 rounded-lg transition-all duration-300 absolute lg:w-[400px] w-[200px] lg:h-[80px] top-10 right-10 flex items-center justify-center ${
          theme === "dark"
            ? "bg-red-900 text-red-200"
            : "bg-red-200 text-red-900"
        }`}>
          {error}
        </div>
      )}

      <Keyboard
        onKey={handleKey}
        guesses={guesses}
        theme={theme}
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
      <div className={`mt-4 flex flex-col justify-center items-center p-4 lg:text-xl text-lg ${
        theme === "dark" ? "text-gray-100" : "text-gray-800"
      }`}>
        Instructions
        <ul className={`text-sm mt-2 gap-1 flex flex-col justify-center items-start ${
          theme === "dark" ? "text-gray-200" : "text-gray-700"
        }`}>
          <li><span className={`font-bold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>1.</span> Guess the 5-letter word in 6 tries.</li>
          <li><span className={`font-bold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>2.</span> After each guess, the color of the tiles will change to show how close your guess was to the word.</li>
          <li><span className={`font-bold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>3.</span> <span className='text-green-500'>Green</span> means the letter is correct and in the right position.</li>
          <li><span className={`font-bold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>4.</span> <span className='text-yellow-500'>Yellow</span> means the letter is correct but in the wrong position.</li>
          <li><span className={`font-bold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>5.</span> <span className={theme === "dark" ? "text-gray-500" : "text-gray-600"}>Gray</span> means the letter is not in the word at all.</li>
        </ul>
      </div>
    </div>
  )
}

export default App
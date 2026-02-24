const ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","⌫"]
]

function Keyboard({ onKey, guesses, theme = "dark" }) {

  const letterColors = {}

  guesses.forEach(guess => {
    guess.letters.forEach((letter, i) => {
      const color = guess.colors[i]
      if (letterColors[letter] === "green") return
      if (letterColors[letter] === "yellow" && color === "gray") return
      letterColors[letter] = color
    })
  })

  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1">
          {row.map((key) => {

            const color = letterColors[key]
            let keyStyle = theme === "dark"
              ? "text-gray-400 border-1 border-gray-600 hover:text-gray-100 hover:border-gray-400 bg-gray-700 hover:bg-gray-600"
              : "text-gray-700 border-1 border-gray-300 hover:text-gray-900 hover:border-gray-500 bg-gray-100 hover:bg-gray-200"

            if (color === "green")  keyStyle = "bg-green-500 text-white"
            if (color === "yellow") keyStyle = "bg-yellow-400 text-white"
            if (color === "gray")   keyStyle = "bg-gray-500 text-white"

            const isWide = key === "ENTER" || key === "⌫"

            return (
              <button
                key={key}
                onClick={() => onKey(key)}
                className={`
                  ${isWide ? "lg:px-5 px-2 text-xs" : "lg:w-14 w-8"} 
                  lg:h-14 h-9 rounded font-bold text-sm
                  ${keyStyle}
                  hover:bg-opacity-90
                  hover:scale-105
                  active:scale-100
                  active:opacity-70
                  transition duration-200
                `}
              >
                {key}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default Keyboard
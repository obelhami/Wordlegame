import Tile from "./Tile"

function Grid({ guesses, currentGuess, answer }) {

  const rows = []

  for (let i = 0; i < 6; i++) {
    if (i < guesses.length) {
      rows.push(guesses[i])
      console.log(guesses[i])
    } else if (i === guesses.length) {
      const currentRow = currentGuess.split("").concat(Array(5).fill(""))
      rows.push({ letters: currentRow.slice(0, 5), colors: Array(5).fill("") })
    } else {
      rows.push({ letters: Array(5).fill(""), colors: Array(5).fill("") })
    }
  }

  return (
    <div className="flex flex-col gap-2 lg:gap-2">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2 lg:gap-2">
          {row.letters.map((letter, colIndex) => (
            <Tile
              key={colIndex}
              letter={letter}
              color={row.colors[colIndex]}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default Grid
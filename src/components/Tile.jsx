import { useState, useEffect, useRef } from "react"

function Tile({ letter, color, delay = 0 }) {
  const [flipped, setFlipped] = useState(false)
  const [displayColor, setDisplayColor] = useState("")
  const tileRef = useRef(null)

  useEffect(() => {
    if (letter && !color) {
      const tile = tileRef.current
      tile.classList.remove("animate-pop")
      void tile.offsetWidth
      tile.classList.add("animate-pop")
    }
  }, [letter])

  useEffect(() => {
    if (color) {
      const timer = setTimeout(() => {
        setFlipped(true)
        setTimeout(() => {
          setDisplayColor(color)
        }, 250)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [color])

  let boxStyle = "border-2 border-gray-400 text-white"

  if (displayColor === "green")  boxStyle = "bg-green-500 border-green-500 text-white"
  if (displayColor === "yellow") boxStyle = "bg-yellow-400 border-yellow-400 text-white"
  if (displayColor === "gray")   boxStyle = "bg-gray-500 border-gray-500 text-white"

  return (
    <div
      ref={tileRef}
      className={`
        lg:w-14 w-10 lg:h-14 h-10 flex items-center justify-center rounded-[10px]
        text-2xl font-bold uppercase 
        ${boxStyle}
        ${flipped ? "animate-flip" : ""}
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      {letter}
    </div>
  )
}

export default Tile
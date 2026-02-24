

export const words = [
  "APPLE", "TABLE", "HOUSE", "GREEN", "SMILE",
  "WATER", "BREAD", "PLANE", "TRAIN", "SWEET",
  "SUGAR", "LIGHT", "MONEY", "PHONE", "SOUND",
  "WORLD", "SOUTH", "NORTH", "SHEEP", "HORSE",
  "PLANT", "GRASS", "CHAIR", "CLOCK", "BRICK",
  "STONE", "CLEAN", "DIRTY", "SHORT", "TALLS",
  "HAPPY", "SADLY", "LAUGH", "CRYER", "DANCE",
  "SLEEP", "DREAM", "CARRY", "BRING", "WRITE",
  "READS", "DRINK", "EATEN", "FRUIT", "BERRY",
  "CANDY", "BASIC", "EARTH", "OCEAN", "RIVER"
]

export const getRandomWord = () => {
  return words[Math.floor(Math.random() * words.length)]
}
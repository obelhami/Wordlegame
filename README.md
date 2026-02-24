# Woordle 🟩

A functional web-based clone of the popular word game **Wordle**, built with React and Tailwind CSS.

## 🎮 Live Demo

[Click here to play!](https://wordlegame-f2ny.vercel.app/)

---

## 📖 How To Play

- Guess the secret **5-letter word** in **6 tries or less**
- After each guess, the tiles will change color to give you hints:
  - 🟩 **Green** — Letter is correct and in the right position
  - 🟨 **Yellow** — Letter exists in the word but in the wrong position
  - ⬛ **Gray** — Letter does not exist in the word
- Type using your **physical keyboard**
- Press **Enter** to submit your guess
- Press **Backspace** to delete a letter

---

## ⚙️ Built With

- [React](https://react.dev/) — UI Framework
- [Vite](https://vitejs.dev/) — Project setup and bundler
- [Tailwind CSS](https://tailwindcss.com/) — Styling

---

## 🚀 Installation & Running Locally

### 1. Clone the repository

```bash
git clone git@github.com:obelhami/Wordlegame.git wordle-clone
```

### 2. Go into the project folder

```bash
cd wordle-clone
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open your browser and go to

```
http://localhost:5173
```

---

## ✨ Features

- ✅ 5x6 Game Grid
- ✅ Green / Yellow / Gray color logic
- ✅ Physical keyboard support
- ✅ Win & Game Over messages
- ✅ Play Again button
- ✅ Pop animation when typing letters
- ✅ Game state saved with localStorage (refresh and continue!)
- ✅ Fully responsive on mobile and desktop

---

## 📁 Project Structure

```
src/
  components/
    Tile.jsx       → Single letter box
    Grid.jsx       → The 6x5 game board
    Keyboard.jsx   → On-screen keyboard
  word.js         → Word list and random word picker
  App.jsx          → Main game logic and state
  index.css        → Global styles + Tailwind
```

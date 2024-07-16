# Chess Game Review App with React js and Tailwind CSS

System similar to Chess.com which gives review of each move.

Inspiration [chess.wintrcat.uk](https://chess.wintrcat.uk/)

## 1. Packages plan to use:

- [ ] [Tailwind CSS](https://tailwindcss.com/docs/guides/create-react-app)
- [ ] [React Icons](https://react-icons.github.io/react-icons/)
- [ ] [Github Pages](https://github.com/gitname/react-gh-pages)
- [ ] [Chess.js](https://www.npmjs.com/package/chess.js?activeTab=readme)
- [ ] [Chess Board](https://www.npmjs.com/package/cm-chessboard)
- [ ] [Stockfish](https://www.npmjs.com/package/stockfish)
- [ ] [NextUI](https://nextui.org/docs/guide/installation)

## Basic working of website

User can enter chess.com username or game PGN to analyze with stockfish. Analysis system will be similar to chess.com in which user will get feedback from stockfish, each move will be laballed `blunder`, `great`, or something like that.

This time I will use packages to display chess board and for logic which will make it easier for me. I am using Typescript this time for first time for strict typecheck. I will try to make good and reactive interface with NextUI.

## Steps to Follow

### 1. Setup

- [ ] Installing Packages
- [ ] Creating Basic UI elements

### 2. API

- [ ] Using Chess.com API to get user game
- [ ] Lichess API for opening positions

### 3. BOARD

- [ ] Creating Board with Chess Board Package
- [ ] Try different available pieces and choose good colors and themes

### 4. LOGIC

- [ ] Reading PGN going forwad and backward through moves
- [ ] Drawing Arrows
- [ ] Getting moves and evaluation from stockfish
- [ ] Dispalying Evaluation bar and top lines
- [ ] Move review based on change on evaluation
- [ ] Graph to show change in evaluation
- [ ] Calculating Accuracy and Rating of user

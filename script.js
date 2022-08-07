// in script.js we work with UI (rendering, setting event listeners, abstract logic of the game, etc...)

import {
	createBoard,
	markTile,
	openTile,
	openAllTiles,
	unmarkTile,
	isMine,
	isMarked,
	isOpened,
	countOpenedTiles,
	TILE_STATUS,
	MINE_FLAG,
} from "./logic.js"

let testBoard
if (process.env.NODE_ENV !== "production" && window.testBoard) {
	testBoard = window.testBoard
}

const boardElement = document.querySelector("#board")
const minesLeftElement = document.querySelector("#minesLeft > span")
const modalEndgameElement = document.querySelector("#modalEndgame")

const inputMinesLeftElement = document.querySelector("#minesLeftInput")
const inputTileSizeElement = document.querySelector("#tileSizeInput")
const inputBoardSizeElement = document.querySelector("#boardSizeInput")

// uploading saved settings
const savedSettings = getSavedSettings()
let tileSize = "60px" ?? savedSettings.tileSize
let boardSize = testBoard?.length ?? parseFloat(savedSettings.boardSize)
let minesLeft =
	testBoard?.flat().filter((t) => t.adjacentMinesCount === MINE_FLAG).length ??
	parseFloat(savedSettings.minesLeft)

inputBoardSizeElement.value = boardSize
inputTileSizeElement.value = tileSize
inputMinesLeftElement.value = minesLeft

let board = testBoard ?? createBoard(boardSize, minesLeft)

setCSSProperties(boardSize, tileSize)
setMinesLeftTitle(minesLeft)

render()

// moved event listeners out as individual functions
// to be able to remove event listener later
const onchangeMinesLeftEventListener = (e) => {
	minesLeft =
		Math.min(parseFloat(inputMinesLeftElement.value), boardSize ** 2 - 1) ?? 3
	board = createBoard(boardSize, minesLeft)
	setMinesLeftTitle(minesLeft)
	updateSavedSettings(minesLeft, boardSize, tileSize)

	render()
}

const onchangeTileSizeEventListener = (e) => {
	tileSize = inputTileSizeElement.value.toString() + "px"
	setCSSProperties(boardSize, tileSize)
	updateSavedSettings(minesLeft, boardSize, tileSize)

	render()
}

const onchangeBoardSizeEventListener = (e) => {
	boardSize =
		Math.max(parseFloat(inputBoardSizeElement.value), 3).toString() ?? 5
	board = createBoard(boardSize, minesLeft)
	setCSSProperties(boardSize, tileSize)
	updateSavedSettings(minesLeft, boardSize, tileSize)

	render()
}

// adding event listeners to inputs
inputMinesLeftElement.addEventListener(
	"change",
	onchangeMinesLeftEventListener,
	false
)
inputTileSizeElement.addEventListener(
	"change",
	onchangeTileSizeEventListener,
	false
)
inputBoardSizeElement.addEventListener(
	"change",
	onchangeBoardSizeEventListener,
	false
)

// moved event listeners out as individual functions
// to be able to remove event listener later
const clickEventListener = (e) => {
	// check if clicked on tile (only tile has `data-status` attribute)
	if (!e.target.matches("[data-status]")) return

	console.log("DFASDF")
	const x = parseFloat(e.target.dataset.x)
	const y = parseFloat(e.target.dataset.y)

	if (isMine(board, { x, y })) {
		board = openAllTiles(board)
		render()
		showModalLose()
		turnOffBoard()
		return
	}

	if (!isOpened(board, { x, y })) {
		board = openTile(board, { x, y }, boardSize)

		if (isWin(board)) {
			board = openAllTiles(board)
			render()
			showModalWin()
			turnOffBoard()
			return
		}
		render()
	}
}

const contextmenuEventListener = (e) => {
	e.preventDefault()
	if (!e.target.matches("[data-status]")) return

	const x = parseFloat(e.target.dataset.x)
	const y = parseFloat(e.target.dataset.y)

	if (isMarked(board, { x, y })) {
		board = unmarkTile(board, { x, y })
	} else if (!isOpened(board, { x, y })) {
		board = markTile(board, { x, y })
	}

	render()
}

// adding event listeners to boardElement
boardElement.addEventListener("click", clickEventListener, false)
boardElement.addEventListener("contextmenu", contextmenuEventListener, false)
render()

// updates the board state with actual one
function render() {
	boardElement.textContent = ""
	board.forEach((row) => {
		row.forEach((tile) => {
			boardElement.appendChild(getElementFromTile(tile))
		})
	})
}

function getElementFromTile(tile) {
	const tileElement = document.createElement("div")
	tileElement.classList.add("tile")
	tileElement.dataset.x = tile.x
	tileElement.dataset.y = tile.y
	tileElement.dataset.status = tile.status
	if (tile.status == TILE_STATUS.OPENED && tile.adjacentMinesCount >= 1) {
		tileElement.textContent = tile.adjacentMinesCount
	}
	return tileElement
}

// setting boardSize and tileSize for CSS file
function setCSSProperties(boardSize, tileSize) {
	document.documentElement.style.setProperty("--tileSize", tileSize.toString())
	document.documentElement.style.setProperty(
		"--boardSize",
		boardSize.toString()
	)
}

function setMinesLeftTitle(minesLeft) {
	minesLeftElement.textContent = minesLeft.toString()
}

function isWin(board) {
	const openedTiles = countOpenedTiles(board)
	return openedTiles === boardSize ** 2 - minesLeft
}

function showModalWin() {
	modalEndgameElement.textContent = "YOU HAVE WON!!!"
	modalEndgameElement.classList.add("show")
}
function showModalLose() {
	modalEndgameElement.textContent = "YOU HAVE LOST... LOSER!!!"
	modalEndgameElement.classList.add("show")
}

function turnOffBoard() {
	boardElement.removeEventListener("click", clickEventListener, false)
	boardElement.removeEventListener(
		"contextmenu",
		contextmenuEventListener,
		false
	)

	inputMinesLeftElement.removeEventListener(
		"change",
		onchangeMinesLeftEventListener,
		false
	)
	inputTileSizeElement.removeEventListener(
		"change",
		onchangeTileSizeEventListener,
		false
	)
	inputBoardSizeElement.removeEventListener(
		"change",
		onchangeBoardSizeEventListener,
		false
	)
}

function updateSavedSettings(minesLeft, boardSize, tileSize) {
	localStorage.setItem("tileSize", tileSize.toString())
	localStorage.setItem("boardSize", boardSize.toString())
	localStorage.setItem("minesLeft", minesLeft.toString())
}

function getSavedSettings() {
	return {
		tileSize: localStorage.getItem("tileSize") ?? "60px",
		boardSize: localStorage.getItem("boardSize") ?? "6",
		minesLeft: localStorage.getItem("minesLeft") ?? "3",
	}
}

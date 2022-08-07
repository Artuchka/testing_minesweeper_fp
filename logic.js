// in logic.js we make detailed(not high-level abstract) logic of the game

import { times, range } from "lodash/fp"

export const TILE_STATUS = {
	HIDDEN: "hidden",
	OPENED: "opened",
	MARKED: "marked",
	MINE: "mine",
}

export const MINE_FLAG = 999

export function createBoard(boardSize, minesLeft) {
	let board = []

	board = createTiles(boardSize)
	board = createMines(board, boardSize, minesLeft)

	return board
}

// should be called smth like "openAdjacentTiles"
export function openTile(board, position, boardSize) {
	if (
		isOpened(board, position) ||
		isMarked(board, position) ||
		isMine(board, position)
	) {
		return board
	}
	let newBoard = openCertainTile(board, position, boardSize)

	// setting position offsets by hand so there are less calculations AND checked that they are only christ-alike
	const dxdyPositions = [
		{ dx: -1, dy: 0 },
		{ dx: 1, dy: 0 },
		{ dx: 0, dy: 1 },
		{ dx: 0, dy: -1 },
	]
	dxdyPositions.forEach((dxdyPosition) => {
		const newX = position.x + dxdyPosition.dx
		const newY = position.y + dxdyPosition.dy
		const nextPosition = { x: newX, y: newY }

		if (positionPossible(nextPosition, boardSize)) {
			newBoard = openTile(newBoard, nextPosition, boardSize)
		}
	})

	return newBoard
}

export function openCertainTile(board, position, boardSize) {
	let newBoard = board

	const newTile = {
		...newBoard[position.y][position.x],
		adjacentMinesCount: countMinesAround(board, position, boardSize),
		status: TILE_STATUS.OPENED,
	}

	return replaceTile(newBoard, position, newTile)
}

export function countMinesAround(board, position, boardSize) {
	// it may seem stupid, but it's by hand only because of FP(btw not Fucked Up) style!!!
	// maybe using range(start, end) from lodash would help
	const dxdyPositions = [
		{ dx: -1, dy: -1 },
		{ dx: -1, dy: 0 },
		{ dx: -1, dy: 1 },

		{ dx: 0, dy: -1 },
		{ dx: 0, dy: 0 },
		{ dx: 0, dy: 1 },

		{ dx: 1, dy: -1 },
		{ dx: 1, dy: 0 },
		{ dx: 1, dy: 1 },
	]

	return dxdyPositions.reduce((count, offset) => {
		const newPos = { x: position.x + offset.dx, y: position.y + offset.dy }
		if (positionPossible(newPos, boardSize) && isMine(board, newPos)) {
			return count + 1
		}
		return count
	}, 0)
}

// checks whether position lies down on our map or is abroad
function positionPossible(position, boardSize) {
	return (
		0 <= position.x &&
		position.x < boardSize &&
		0 <= position.y &&
		position.y < boardSize
	)
}

export function openAllTiles(board) {
	let newBoard = board
	const boardSize = board.length
	newBoard.forEach((row, y) => {
		row.forEach((tile, x) => {
			if (tile.adjacentMinesCount === MINE_FLAG) {
				newBoard = replaceTile(
					newBoard,
					{ x, y },
					{ ...tile, status: TILE_STATUS.MINE }
				)
			} else {
				newBoard = openCertainTile(newBoard, { x, y }, boardSize)
			}
		})
	})

	return newBoard
}

export function markTile(board, position) {
	if (isOpened(board, position)) return board

	let newBoard = board

	const newTile = {
		...newBoard[position.y][position.x],
		status: TILE_STATUS.MARKED,
	}

	return replaceTile(newBoard, position, newTile)
}
export function unmarkTile(board, position) {
	if (!isMarked(board, position)) return board

	let newBoard = board

	const newTile = {
		...newBoard[position.y][position.x],
		status: TILE_STATUS.HIDDEN,
	}

	return replaceTile(newBoard, position, newTile)
}

export function isMarked(board, position) {
	return board[position.y][position.x].status === TILE_STATUS.MARKED
}
export function isOpened(board, position) {
	return board[position.y][position.x].status === TILE_STATUS.OPENED
}
export function isMine(board, position) {
	return board[position.y][position.x].adjacentMinesCount === MINE_FLAG
}

export function countOpenedTiles(board) {
	return board.flat(2).reduce((count, tile) => {
		if (tile.status === TILE_STATUS.OPENED) return count + 1
		return count
	}, 0)
}

export function createTiles(boardSize) {
	const newBoard = []

	// FP style of looping
	return times((y) => {
		return times((x) => {
			return {
				x,
				y,
				adjacentMinesCount: 0,
				status: TILE_STATUS.HIDDEN,
			}
		}, boardSize)
	}, boardSize)
}

function createMines(board, boardSize, minesLeft) {
	let minesPositions = []
	let newBoard = board

	// haven't figured out the normal(not physco) way to do it in FP style (without loop I mean)
	while (minesLeft > minesPositions.length) {
		// minus 1 because array `board` indexes start from 0 =)
		const x = randomNumber(boardSize - 1)
		const y = randomNumber(boardSize - 1)

		const position = { x, y }
		const isUniquePosition = !minesPositions.some((el) =>
			positionSame(el, position)
		)
		if (isUniquePosition) {
			minesPositions = addElement(minesPositions, position)
		}
	}

	minesPositions.forEach((pos) => {
		newBoard = setMine(newBoard, pos)
	})

	return newBoard
}

export function setMine(board, { x, y }) {
	const newTile = {
		...board[y][x],
		adjacentMinesCount: MINE_FLAG,
	}
	return replaceTile(board, { x, y }, newTile)
}

function replaceTile(board, position, newTile) {
	return board.map((row, y) => {
		return row.map((tile, x) => {
			if (positionSame(position, { x, y })) {
				return newTile
			}
			return tile
		})
	})
}

function addElement(array, element) {
	return [...array, element]
}

// should be moved to upper functions because it's impure function
function randomNumber(top) {
	// +0.9 is `bicycle` so we definetely get possible range [0..top(included)]
	return Math.floor(Math.random() * (top + 0.9))
}

function positionSame(a, b) {
	return a.x == b.x && a.y == b.y
}

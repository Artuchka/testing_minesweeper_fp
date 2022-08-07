import { times } from "lodash"
import {
	createTiles,
	setMine,
	countOpenedTiles,
	openCertainTile,
	isMine,
	TILE_STATUS,
	createBoard,
	markTile,
	isMarked,
	unmarkTile,
	openTile,
	isOpened,
	MINE_FLAG,
	openAllTiles,
} from "./logic"

afterEach(() => {
	// restore the spy created with spyOn
	jest.restoreAllMocks()
})

describe("#createTiles", () => {
	test("correctly sets up new clean board ", () => {
		// create board
		const boardSize = 2
		const board = createTiles(boardSize)

		const expectedBoard = [
			[
				{ x: 0, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
			[
				{ x: 0, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
		]

		// check boards are the same
		expect(board).toEqual(expectedBoard)
	})
})

describe("#openAllTiles", () => {
	test("correctly opens all tiles ", () => {
		// create board
		const boardSize = 2
		let board = [
			[
				{
					x: 0,
					y: 0,
					adjacentMinesCount: MINE_FLAG,
					status: TILE_STATUS.HIDDEN,
				},
				{ x: 1, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
			[
				{ x: 0, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
		]

		const expectedBoard = [
			[
				{ x: 0, y: 0, adjacentMinesCount: MINE_FLAG, status: TILE_STATUS.MINE },
				{ x: 1, y: 0, adjacentMinesCount: 1, status: TILE_STATUS.OPENED },
			],
			[
				{ x: 0, y: 1, adjacentMinesCount: 1, status: TILE_STATUS.OPENED },
				{ x: 1, y: 1, adjacentMinesCount: 1, status: TILE_STATUS.OPENED },
			],
		]

		board = openAllTiles(board)

		// check boards are the same
		expect(board).toEqual(expectedBoard)
	})
})

describe("#openTile", () => {
	test("correctly reveals tile & nearby ones ", () => {
		// create board
		const boardSize = 2
		let board = [
			[
				{
					x: 0,
					y: 0,
					adjacentMinesCount: MINE_FLAG,
					status: TILE_STATUS.HIDDEN,
				},
				{ x: 1, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
			[
				{ x: 0, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
		]

		// setting `click` position
		const position = { x: 1, y: 0 }
		// revealing tile
		board = openTile(board, position, boardSize)

		const expectedBoard = [
			[
				{
					x: 0,
					y: 0,
					adjacentMinesCount: MINE_FLAG,
					status: TILE_STATUS.HIDDEN,
				},
				{ x: 1, y: 0, adjacentMinesCount: 1, status: TILE_STATUS.OPENED },
			],
			[
				{ x: 0, y: 1, adjacentMinesCount: 1, status: TILE_STATUS.OPENED },
				{ x: 1, y: 1, adjacentMinesCount: 1, status: TILE_STATUS.OPENED },
			],
		]

		// check boards are the same
		expect(board).toEqual(expectedBoard)
	})
})

describe("#setMine", () => {
	test("correctly sets mine", () => {
		// create board
		const boardSize = 2
		let board = [
			[
				{ x: 0, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
			[
				{ x: 0, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
		]

		const expectedBoard = [
			[
				{
					x: 0,
					y: 0,
					adjacentMinesCount: MINE_FLAG,
					status: TILE_STATUS.HIDDEN,
				},
				{ x: 1, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
			[
				{ x: 0, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
		]

		// setting mine position
		const position = { x: 0, y: 0 }
		// revealing tile
		board = setMine(board, position)

		// check boards are the same
		expect(board).toEqual(expectedBoard)
	})
})

describe("#countOpenedTiles", () => {
	test("all closed", () => {
		// create board
		const boardSize = 2
		const board = [
			[
				{ x: 0, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
			[
				{ x: 0, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
		]

		// check the correct return of a function
		expect(countOpenedTiles(board)).toBe(0)
	})

	test("one opened", () => {
		// create board
		const boardSize = 2
		let board = [
			[
				{ x: 0, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.OPENED },
			],
			[
				{ x: 0, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
		]

		// check the correct return of a function
		expect(countOpenedTiles(board)).toBe(1)
	})

	test("all opened", () => {
		// create board
		const boardSize = 2
		let board = [
			[
				{ x: 0, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.OPENED },
				{ x: 1, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.OPENED },
			],
			[
				{ x: 0, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.OPENED },
				{ x: 1, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.OPENED },
			],
		]

		// check the correct return of a function
		expect(countOpenedTiles(board)).toBe(boardSize ** 2)
	})
})

describe("#isMarked", () => {
	test("false when NOT marked", () => {
		// create board
		const boardSize = 2
		let board = [
			[
				{ x: 0, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
			[
				{ x: 0, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
		]

		// position for checking
		const position = { x: 1, y: 0 }

		// check the tile is marked
		expect(isMarked(board, position)).toBeFalsy()
	})
	test("true when marked", () => {
		// create board
		const boardSize = 2
		let board = [
			[
				{ x: 0, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.MARKED },
			],
			[
				{ x: 0, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
		]

		// position for checking
		const position = { x: 1, y: 0 }

		// check the tile is marked
		expect(isMarked(board, position)).toBe(true)
	})
})

describe("#unmarkTile", () => {
	test("was marked", () => {
		// create board
		const boardSize = 2
		let board = [
			[
				{ x: 0, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.MARKED },
			],
			[
				{ x: 0, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
		]

		// position for checking
		const position = { x: 1, y: 0 }

		// unmark tile
		board = unmarkTile(board, position)

		// check the tile is not marked
		expect(isMarked(board, position)).toBeFalsy()
	})

	test("was NOT marked", () => {
		// create board
		const boardSize = 2
		let board = [
			[
				{ x: 0, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
			[
				{ x: 0, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
		]

		// position for checking
		const position = { x: 1, y: 0 }

		// unmark tile
		board = unmarkTile(board, position)

		// check the tile is still not marked
		expect(isMarked(board, position)).toBeFalsy()
	})
})

describe("#markTile", () => {
	test("was marked", () => {
		// create board
		const boardSize = 2
		let board = [
			[
				{ x: 0, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.MARKED },
			],
			[
				{ x: 0, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
		]

		const expectedBoard = [
			[
				{ x: 0, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.MARKED },
			],
			[
				{ x: 0, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
		]

		// position for checking
		const position = { x: 1, y: 0 }

		// mark tile
		board = markTile(board, position)

		// check the tile is still not marked
		expect(board).toEqual(expectedBoard)
	})

	test("was NOT marked", () => {
		// create board
		const boardSize = 2
		let board = [
			[
				{ x: 0, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
			[
				{ x: 0, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
		]

		const expectedBoard = [
			[
				{ x: 0, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.MARKED },
			],
			[
				{ x: 0, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
		]

		// position for checking
		const position = { x: 1, y: 0 }

		// mark tile
		board = markTile(board, position)

		// check the tile is still not marked
		expect(board).toEqual(expectedBoard)
	})
})

describe("#isOpened", () => {
	test("returns true when tile was opened", () => {
		// create board
		const boardSize = 2
		let board = [
			[
				{ x: 0, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.OPENED },
				{ x: 1, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
			[
				{ x: 0, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
		]

		// position for checking
		const position = { x: 0, y: 0 }

		// check the tile is opened
		expect(isOpened(board, position)).toBeTruthy()
	})

	test("returns false when tile was not opened", () => {
		// create board
		const boardSize = 2
		let board = [
			[
				{ x: 0, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
			[
				{ x: 0, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
		]

		// position for checking
		const position = { x: 0, y: 0 }

		// check the tile is opened
		expect(isOpened(board, position)).toBeFalsy()
	})
})

describe("#isMine", () => {
	test("returns true when tile is a mine", () => {
		// create board
		const boardSize = 2
		let board = [
			[
				{
					x: 0,
					y: 0,
					adjacentMinesCount: MINE_FLAG,
					status: TILE_STATUS.HIDDEN,
				},
				{ x: 1, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
			[
				{ x: 0, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
		]

		// position for checking
		const position = { x: 0, y: 0 }

		// check the tile is mine
		expect(isMine(board, position)).toBeTruthy()
	})

	test("returns false when tile is not a mine", () => {
		// create board
		const boardSize = 2
		let board = [
			[
				{
					x: 0,
					y: 0,
					adjacentMinesCount: 0,
					status: TILE_STATUS.HIDDEN,
				},
				{ x: 1, y: 0, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
			[
				{ x: 0, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
				{ x: 1, y: 1, adjacentMinesCount: 0, status: TILE_STATUS.HIDDEN },
			],
		]

		// position for checking
		const position = { x: 0, y: 0 }

		// check the tile is mine
		expect(isMine(board, position)).toBeFalsy()
	})
})

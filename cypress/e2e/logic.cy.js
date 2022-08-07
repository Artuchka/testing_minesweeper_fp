import { MINE_FLAG, TILE_STATUS } from "../../logic"

describe("user left clicks on tile", () => {
	describe("when the tile IS NOT a mine", () => {
		it("reveals itself + nearby and displays the number of mines", () => {
			cy.visitBoard([
				[
					{
						x: 0,
						y: 0,
						status: TILE_STATUS.HIDDEN,
						adjacentMinesCount: MINE_FLAG,
					},
					{
						x: 1,
						y: 0,
						status: TILE_STATUS.HIDDEN,
						adjacentMinesCount: 0,
					},
				],
				[
					{
						x: 0,
						y: 1,
						status: TILE_STATUS.HIDDEN,
						adjacentMinesCount: 0,
					},
					{
						x: 1,
						y: 1,
						status: TILE_STATUS.HIDDEN,
						adjacentMinesCount: 0,
					},
				],
			])

			// clicking on hidden NOT mined tile
			cy.get('[data-x="1"][data-y="1"]').click()

			// checking it's opened by status &  shows text of mines nearby
			cy.get('[data-x="1"][data-y="1"]').should("have.text", "1")
			cy.get('[data-x="1"][data-y="1"]').should(
				"have.attr",
				"data-status",
				TILE_STATUS.OPENED
			)

			// checking nearby tile to be opened
			cy.get('[data-x="0"][data-y="1"]').should("have.text", "1")
			cy.get('[data-x="0"][data-y="1"]').should(
				"have.attr",
				"data-status",
				TILE_STATUS.OPENED
			)
			cy.get('[data-x="1"][data-y="0"]').should("have.text", "1")
			cy.get('[data-x="1"][data-y="0"]').should(
				"have.attr",
				"data-status",
				TILE_STATUS.OPENED
			)
		})
	})
	describe("when the tile IS a mine", () => {
		it("reveals itself + nearby and displays the number of mines", () => {
			cy.visitBoard([
				[
					{
						x: 0,
						y: 0,
						status: TILE_STATUS.HIDDEN,
						adjacentMinesCount: MINE_FLAG,
					},
					{
						x: 1,
						y: 0,
						status: TILE_STATUS.HIDDEN,
						adjacentMinesCount: 0,
					},
				],
				[
					{
						x: 0,
						y: 1,
						status: TILE_STATUS.HIDDEN,
						adjacentMinesCount: 0,
					},
					{
						x: 1,
						y: 1,
						status: TILE_STATUS.HIDDEN,
						adjacentMinesCount: 0,
					},
				],
			])

			// clicking on hidden mined tile
			cy.get('[data-x="0"][data-y="0"]').click()
			cy.get('[data-x="0"][data-y="0"]').should(
				"have.attr",
				"data-status",
				TILE_STATUS.MINE
			)

			// checking ALL tiles are opened by status &  shows text of mines nearby
			cy.get('[data-x="1"][data-y="1"]').should("have.text", "1")
			cy.get('[data-x="1"][data-y="1"]').should(
				"have.attr",
				"data-status",
				TILE_STATUS.OPENED
			)

			cy.get('[data-x="0"][data-y="1"]').should("have.text", "1")
			cy.get('[data-x="0"][data-y="1"]').should(
				"have.attr",
				"data-status",
				TILE_STATUS.OPENED
			)
			cy.get('[data-x="1"][data-y="0"]').should("have.text", "1")
			cy.get('[data-x="1"][data-y="0"]').should(
				"have.attr",
				"data-status",
				TILE_STATUS.OPENED
			)
		})
	})
})

describe("user right click on tile", () => {
	describe("when the tile is hidden", () => {
		it("marks the tile with color and status", () => {
			cy.visitBoard([
				[
					{
						x: 0,
						y: 0,
						status: TILE_STATUS.HIDDEN,
						adjacentMinesCount: MINE_FLAG,
					},
					{
						x: 1,
						y: 0,
						status: TILE_STATUS.HIDDEN,
						adjacentMinesCount: 0,
					},
				],
				[
					{
						x: 0,
						y: 1,
						status: TILE_STATUS.HIDDEN,
						adjacentMinesCount: 0,
					},
					{
						x: 1,
						y: 1,
						status: TILE_STATUS.HIDDEN,
						adjacentMinesCount: 0,
					},
				],
			])

			cy.get('[data-x="0"][data-y="0"]').rightclick()
			cy.get('[data-x="0"][data-y="0"]').should(
				"have.attr",
				"data-status",
				TILE_STATUS.MARKED
			)
			cy.get('[data-x="0"][data-y="0"]').should(
				"have.css",
				"background-color",
				"rgb(255, 255, 0)"
			)
		})
	})
	describe("when the tile is number opened", () => {
		it("does nothing to the board", () => {
			cy.visitBoard([
				[
					{
						x: 0,
						y: 0,
						status: TILE_STATUS.HIDDEN,
						adjacentMinesCount: MINE_FLAG,
					},
					{
						x: 1,
						y: 0,
						status: TILE_STATUS.OPENED,
						adjacentMinesCount: 0,
					},
				],
				[
					{
						x: 0,
						y: 1,
						status: TILE_STATUS.HIDDEN,
						adjacentMinesCount: 0,
					},
					{
						x: 1,
						y: 1,
						status: TILE_STATUS.HIDDEN,
						adjacentMinesCount: 0,
					},
				],
			])

			// right clicking on opened tile
			cy.get('[data-x="1"][data-y="0"]').rightclick()

			cy.get('[data-x="1"][data-y="0"]').should(
				"have.attr",
				"data-status",
				TILE_STATUS.OPENED
			)
		})
	})
})

describe("user wins", () => {
	it("opens all tiles & shows win modal", () => {
		cy.visitBoard([
			[
				{
					x: 0,
					y: 0,
					status: TILE_STATUS.HIDDEN,
					adjacentMinesCount: MINE_FLAG,
				},
				{
					x: 1,
					y: 0,
					status: TILE_STATUS.HIDDEN,
					adjacentMinesCount: 0,
				},
			],
			[
				{
					x: 0,
					y: 1,
					status: TILE_STATUS.HIDDEN,
					adjacentMinesCount: 0,
				},
				{
					x: 1,
					y: 1,
					status: TILE_STATUS.HIDDEN,
					adjacentMinesCount: 0,
				},
			],
		])

		cy.get('[data-x="1"][data-y="1"]').click()

		cy.get('[data-x="0"][data-y="0"]').should(
			"have.attr",
			"data-status",
			TILE_STATUS.MINE
		)
		cy.get('[data-x="1"][data-y="0"]').should(
			"have.attr",
			"data-status",
			TILE_STATUS.OPENED
		)
		cy.get('[data-x="0"][data-y="1"]').should(
			"have.attr",
			"data-status",
			TILE_STATUS.OPENED
		)
		cy.get('[data-x="0"][data-y="1"]').should(
			"have.attr",
			"data-status",
			TILE_STATUS.OPENED
		)

		cy.get("#modalEndgame").should("have.class", "show")
		cy.get("#modalEndgame").should("contains.text", "WON")
	})
})
describe("user lose", () => {
	it("opens all tiles & shows lose modal", () => {
		cy.visitBoard([
			[
				{
					x: 0,
					y: 0,
					status: TILE_STATUS.HIDDEN,
					adjacentMinesCount: MINE_FLAG,
				},
				{
					x: 1,
					y: 0,
					status: TILE_STATUS.HIDDEN,
					adjacentMinesCount: 0,
				},
			],
			[
				{
					x: 0,
					y: 1,
					status: TILE_STATUS.HIDDEN,
					adjacentMinesCount: 0,
				},
				{
					x: 1,
					y: 1,
					status: TILE_STATUS.HIDDEN,
					adjacentMinesCount: 0,
				},
			],
		])

		cy.get('[data-x="0"][data-y="0"]').click()

		cy.get('[data-x="0"][data-y="0"]').should(
			"have.attr",
			"data-status",
			TILE_STATUS.MINE
		)
		cy.get('[data-x="1"][data-y="0"]').should(
			"have.attr",
			"data-status",
			TILE_STATUS.OPENED
		)
		cy.get('[data-x="0"][data-y="1"]').should(
			"have.attr",
			"data-status",
			TILE_STATUS.OPENED
		)
		cy.get('[data-x="0"][data-y="1"]').should(
			"have.attr",
			"data-status",
			TILE_STATUS.OPENED
		)

		cy.get("#modalEndgame").should("have.class", "show")
		cy.get("#modalEndgame").should("contains.text", "LOST")
	})
})

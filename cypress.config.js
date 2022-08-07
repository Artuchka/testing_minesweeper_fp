const { defineConfig } = require("cypress")

module.exports = defineConfig({
	e2e: {
		baseUrl: "http://localhost:1234",
		viewportHeight: 600,
		viewportWidth: 600,
	},
})

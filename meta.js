var exec = require('child_process').exec;
var fs = require('fs');

module.exports = {
	helpers: {
		lowercase: str => str.toLowerCase(),
		capitalize: str => str.charAt(0).toUpperCase() + str.slice(1)
	},
	prompts: {
		"name": {
			"type": "string",
			"required": true,
			"message": "Component name"
		},
		"description": {
			"type": "string",
			"required": false,
			"message": "Component description",
			"default": "A Vue.js component"
		},
		"author": {
			"type": "string",
			"message": "Author"
		},
		"jspreprocesor": {
			"type": "confirm",
			"message": "Do you want some Script PreProcessor?",
			"default": false
		},
		"script": {
			"when": "jspreprocesor",
			"type": "list",
			"required": true,
			"choices": [
				{
					"name": "JS",
					"value": "js",
					"short": "JS"
				},
				{
					"name": "Coffee Script",
					"value": "coffee",
					"short": "Coffe"
				}
			]
		},
		"stylepreprocesor": {
			"type": "confirm",
			"message": "Do you want some Style PreProcessor?",
			"default": false
		},
		"style": {
			"when": "stylepreprocesor",
			"type": "list",
			"required": true,
			"choices": [
				{
					"name": "CSS",
					"value": "css",
					"short": "CSS"
				},
				{
					"name": "LESS",
					"value": "less",
					"short": "LESS"
				},
				{
					"name": "SASS",
					"value": "sass",
					"short": "Sass"
				},
				{
					"name": "STYLUS",
					"value": "styl",
					"short": "Stylus"
				}
			]
		}
	},
	filters: {
		"views/component/component.styl": "stylepreprocesor && style === 'styl'",
		"views/component/component.sass": "stylepreprocesor && style === 'sass'",
		"views/component/component.scss": "stylepreprocesor && style === 'scss'",
		"views/component/component.less": "stylepreprocesor && style === 'less'",
		"views/component/component.css": "!stylepreprocesor || (stylepreprocesor && style === 'css')",
		"views/component/component.js": "!jspreprocesor || (jspreprocesor && script === 'js')",
		"views/component/component.coffee": "jspreprocesor && script === 'coffee'"
	},
	complete (data, {logger, chalk, files}) {
		// Convert the name to SnakeCase
		let name = data.name
		let CapitalizedName = name.charAt(0).toUpperCase() + name.slice(1)

		// Default Directory
		let destDirName = `./`

		// Incase a directory is provided change the directory
		if (!data.inPlace) {
			destDirName += data.destDirName
		}


		// Iterate over all the files
		Object.keys(files).forEach((key) => {
			// Search for the files with "component"
			let pos = key.search("views/component/component")

			// If the file has component in the name
			if (pos != -1) {
				// Get the extension
				let ext = key.substr(25, (key.length - 1))

				// Unless its ".vue" file rename it to the component name
				fs.rename(`${destDirName}/views/component/component${ext}`, `${destDirName}/views/component/${CapitalizedName}${ext}`, (err) => {})
			}
		})


		fs.rename(`${destDirName}/views/component`, `${destDirName}/views/${CapitalizedName}`, (err) => {})

	}
}

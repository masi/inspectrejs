# inspectreJS

A web layout regression testing tool for [PhantomJS](http://phantomjs.org/) and [SlimerJS](http://slimerjs.org/).

The code runs directly in PhantomJS or SlimerJS, it is not meant for [Node.js](https://nodejs.org/). 

## Work In Progress

Eventually inspectreJS is to be used with a continuous integration server to compare screenshots, CSS styles and DOM elements.
Currently it will only make screenshots of given URLs (full page or parts).

## Usage

`phantomjs inspectre.js scrape --config-file=<configuration.json> [ --output-directory=<image-directory> ]`

## Configuration File Format

``` json
{
	"baseUrl": "<url>",
	"paths": [
		"<url-path>",
		{
			"path": "<url-path>",
			"selectors": "<css-selector>"
		},
		{
			"path": "<url-path>",
			"selectors": [
				"<css-selector>",
				...
			]
		},
		"<url>",
		...
	]
}
```

## License

MIT

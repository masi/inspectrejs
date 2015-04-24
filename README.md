# inspectreJS

A web layout regression testing tool for [PhantomJS](http://phantomjs.org/) and [SlimerJS](http://slimerjs.org/).

The code runs directly in PhantomJS or SlimerJS, it is not meant for [Node.js](https://nodejs.org/). 

## Work In Progress

Eventually inspectreJS is to be used with a continuous integration server to compare screenshots, CSS styles and DOM elements.
Currently it will make screenshots of given URLs (full page or parts) and compare them (for now PhantomJS only).

## Usage

`phantomjs inspectre.js <command>`

### Creating Screenshots

```
phantomjs inspectre.js scrape
	--config-file=<configuration.json>
	[ --output-directory=<image-directory> ]
```

### Comparing Screenshots

```
phantomjs inspectre.js compare
	--baseline-directory=<image-directory>
	--sample-directory=<image-director>
	[ --output-directory=<image-directory> ]
```

## Configuration File Format

``` json
{
	"baseUrl": "<url>",
	"paths": [
		"<url-path>", // full page (relative to base URL)
		{
			"path": "<url-path>",
			"selectors": "<css-selector>" // single element
		},
		{
			"path": "<url-path>",
			"selectors": [ // multiple 
				"<css-selector>"
				/* , ... */
			]
		},
		"<url>" // full page (absoulte URL)
		/* , ... */
	]
}
```

## License

MIT

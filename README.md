# inspectreJS

A web layout regression testing tool for [PhantomJS](http://phantomjs.org/) and [SlimerJS](http://slimerjs.org/).

The code runs directly in PhantomJS or SlimerJS, it is not meant for [Node.js](https://nodejs.org/). 

It comes with a console and a TAP reporter.

## Work In Progress

Eventually inspectreJS is to be used to compare not only screenshots but also CSS styles and DOM elements.
Currently it will make screenshots of given URLs (full page or parts) and compare them (for now PhantomJS only).

## Installation

### NPM

`npm install inspectrejs`

### GIT

`git clone https://github.com/masi/inspectrejs.git`

## Usage

`phantomjs inspectre.js <command>`

### Creating Screenshots

```
phantomjs inspectre.js scrape
	--config-file=<configuration.json>
	[ --output-directory=<image-directory> ]
```

or

```
phantomjs inspectre.js scrape
	-c <configuration.json>
	[ -o <image-directory> ]
```


### Comparing Screenshots

```
phantomjs inspectre.js compare
	--baseline-directory=<image-directory>
	--sample-directory=<image-director>
	[ --output-directory=<image-directory> ]
	[ --reporter=console|tap ]
```

or

```
phantomjs inspectre.js compare
	-b <image-directory>
	-s <image-director>
	[ -o <image-directory> ]
	[ -r console|tap ]
```

## Configuration File Format (JSON)

``` javascript
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
			"selectors": [ // multiple elements 
				"<css-selector>"
				/* , ... */
			]
		},
		"<url>" // full page (absolute URL)
		/* , ... */
	]
}
```

## License

MIT

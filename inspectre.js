/**
 *
 */

'use strict';

var system = require('system');
var ScraperCommand;

if (system.args.length < 2 || system.args.length > 3) {
	console.error("Usage: <phantomjs|slimerjs> inspectre.js config-file [image-directory]");
	phantom.exit(1);
} else {
	try {
		ScraperCommand = require('./lib/cmd/scrape.js');
		ScraperCommand.execute();
	} catch (error) {
		console.error('ERROR: ' + error.message);
		phantom.exit(1);
	}
}

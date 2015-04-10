/**
 *
 */

'use strict';

var system = require('system');
var config = require('./lib/configuration.js');
var ImageScraper = require('./../inspectre/node_modules/eerie-toolbox/lib/imagescraper.js');
var configuration, queue;

if (system.args.length !== 2) {
	console.error("Usage: <phantomjs|slimerjs> inspectre.js config-file");
	phantom.exit(1);
} else {
	try {
		configuration = config.read(system.args[1]);
		queue = config.buildImageScraperQueue(configuration);

		ImageScraper.build().processQueue(
			queue,
			function (context) {
				phantom.exit();
			},
			function (item, error, context) {
				console.error('LOAD ERROR: ' + item.url);
			},
			function (item, error, context) {
				console.error('ERROR: ' + error.message);
				phantom.exit(1);
			}
		);
	} catch (error) {
		console.error('ERROR: ' + error.message);
		phantom.exit(1);
	}
}

/**
*
 */

'use strict';

var config = require('../../lib/configuration.js');
var ImageScraper = require('../../node_modules/eerie-toolbox/lib/imagescraper.js');

module.exports.execute = function() {
	var configuration, directory, queue;

	configuration = config.read(system.args[2]);
	directory = system.args[3] || '.';
	queue = config.buildImageScraperQueue(configuration);

	ImageScraper.build().setImageDirectory(directory).processQueue(
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
};

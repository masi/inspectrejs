/**
 *
 */

'use strict';

var minimist = require('../../node_modules/minimist/index.js');
var Configuration = require('../../lib/configuration.js');
var ImageScraper = require('../../node_modules/eerie-toolbox/lib/imagescraper.js');

/**
 *
 * @param {array} argv
 */
module.exports.execute = function (argv) {
	var configuration, queue;

	var options = minimist(argv, {
		string: ['config-file', 'output-directory'],
		alias: {
			c: 'config-file',
			o: 'output-directory'
		},
		default: {
			o: '.'
		},
		stopEarly: true,
		unknown: function() { return false; }
	});

	if (!options['config-file']) {
		console.log('Missing option "config-file".');
	} else {
		configuration = Configuration.read(options['config-file']);
		queue = Configuration.buildImageScraperQueue(configuration);
		options['output-directory'] = options['output-directory'].replace(/\\/g, '/');

		ImageScraper.build().setImageDirectory(options['output-directory']).processQueue(
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
	}
};

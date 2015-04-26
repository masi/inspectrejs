/**
 *
 */

'use strict';

var fs = require('fs');
var minimist = require('../../node_modules/minimist/index.js');
var FileWalker = require('../../node_modules/eerie-toolbox/lib/filewalker.js');
var Resemble = require('../resemble.js');
var ImagesRunner = require('../imagesrunner.js');
var ConsoleReporter = require('../reporter/console.js');

/**
 *
 * @param {array} argv
 */
module.exports.execute = function (argv) {
	var imageCollector, queue,
		baselineFiles = [],
		sampleFiles = [],
		options = minimist(argv, {
			string: ['baseline-directory', 'sample-directory', 'output-directory'],
			alias: {
				b: 'baseline-directory',
				s: 'sample-directory',
				o: 'output-directory'
			},
			default: {
				o: '.'
			},
			stopEarly: true,
			unknown: function () {
				return false;
			}
		});

	if (!options['baseline-directory']) {
		console.log('Missing option "baseline-directory".');
		phantom.exit(1);
	} else if (!options['sample-directory']) {
		console.log('Missing option "sample-directory".');
		phantom.exit(1);
	} else if (!options['output-directory']) {
		console.log('Missing option "output-directory".');
		phantom.exit(1);
	} else {
		imageCollector = new FileWalker();
		if (!fs.isDirectory(options['baseline-directory'])) {
			console.log('Not a directory ' + options['baseline-directory']);
			phantom.exit(1);
		}
		if (!fs.isDirectory(options['sample-directory'])) {
			console.log('Not a directory ' + options['sample-directory']);
			phantom.exit(1);
		}
		options['baseline-directory'] = options['baseline-directory'].replace(/\\/g, '/');
		options['sample-directory'] = options['sample-directory'].replace(/\\/g, '/');
		options['output-directory'] = options['output-directory'].replace(/\\/g, '/');

		imageCollector.process(options['baseline-directory'], function (filename, path, absolutePath) {
			baselineFiles.push(path);
		});
		imageCollector.process(options['sample-directory'], function (filename, path, absolutePath) {
			sampleFiles.push(path);
		});
		queue = baselineFiles.map(function (baselinePath, index) {
			if (!sampleFiles[index]) {
				throw new Error('Baseline and sample directory do not match.');
			}
			return {
				baseline: baselinePath,
				sample: sampleFiles[index],
				difference: options['output-directory'] + '/' + baselinePath.replace(/^[^\/]+\//, '')
			}
		});

		ImagesRunner.run(
			new Resemble(),
			queue,
			function () {
				phantom.exit();
			},
			function (item, error) {
				console.error('ERROR: ' + error.message);
				phantom.exit(1);
			},
			ConsoleReporter
		);
	}
};

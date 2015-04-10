/**
 *
 */

'use strict';

var fs = require('fs');
var URI = require('../node_modules/URIjs/src/URI.js');

/**
 *
 * @param {string} filename
 * @returns {object}
 */
function read(filename) {
	var configString, configObject;
	try {
		configString = fs.read(filename);
	} catch (error) {
		throw new Error('Unable to open configuration file "' + filename + '".');
	}
	try {
		configObject = JSON.parse(configString);
	} catch (error) {
		throw new Error('Unable to parse configuration file "' + filename + '".');
	}
	configObject.baseUrl = configObject.baseUrl || '';
	configObject.paths = configObject.paths || [];
	return configObject;
}

/**
 *
 * @param {object} configuration
 * @returns {Array}
 */
function buildImageScraperQueue(configuration) {
	var baseUrl = new URI(configuration.baseUrl).normalize(),
		queue = [],
		i, path, selectors;
	for (i = 0; i < configuration.paths.length; i++) {
		if (typeof configuration.paths[i] === 'string') {
			path = configuration.paths[i];
			selectors = [];
		} else {
			path = configuration.paths[i].path;
			if (typeof configuration.paths[i].selectors === 'string') {
				selectors = [configuration.paths[i].selectors];
			} else {
				selectors = configuration.paths[i].selectors;
			}
		}
		queue.push({
			url: new URI(path).absoluteTo(baseUrl).normalize().toString(),
			selectors: selectors
		});
	}
	return queue;
}

module.exports = {
	read: read,
	buildImageScraperQueue: buildImageScraperQueue
};

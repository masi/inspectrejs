/**
 *
 */

'use strict';

if (typeof Promise !== 'function') {
	var Promise = require('../node_modules/eerie-toolbox/compatibility/Promise.js');
}

var fs = require('fs');

phantom.injectJs('./node_modules/resemblejs/resemble.js'); // Resemble.js is a browser-only library

/**
 *
 * @param {object} [webpage] object compatible with PhantomJS webpage object
 * @class
 */
function ImageResemble(webpage) {
	/** @member {object} webpage */
	/** @member {string} imageFilename */
	/** @member {function} onDone */
	/** @member {object} resembleResult */

	var self = this;

	this.webpage = webpage || require('webpage').create();
	ImageResemble._initState(this);

	this.webpage.onError = function (message, trace) {
		throw new Error('BROWSER ERROR: ' + message);
	};
	this.webpage.onLoadFinished = function (status) {
		self.webpage.clipRect = self.webpage.evaluate(function () {
			return document.querySelector('img').getBoundingClientRect();
		});
		self.webpage.render(self.imageFilename);
		if (self.onDone) {
			self.onDone(JSON.parse(self.resembleResult));
		}
		ImageResemble._initState(self);
	};
}

/**
 *
 * @param {object} object
 * @protected
 */
ImageResemble._initState = function (object) {
	object.imageFilename = '';
	object.onDone = undefined;
	object.resembleResult = {};
}

/**
 *
 * @param {string} imageFilenameIn1
 * @param {string} imageFilenameIn2
 * @param {string} imageFilenameOut
 * @param {function} onDone
 */
ImageResemble.prototype.compare = function (imageFilenameIn1, imageFilenameIn2, imageFilenameOut, onDone) {
	var self = this;

	if (this.imageFilename) {
		throw new Error('Image comparison in process.');
	}
	if (!fs.isFile(imageFilenameIn1) || !fs.isReadable(imageFilenameIn1)) {
		throw new Error(('Path "' + imageFilenameIn1 + '" is not a readable file.'));
	}
	if (!fs.isFile(imageFilenameIn2) || !fs.isReadable(imageFilenameIn1)) {
		throw new Error(('Path "' + imageFilenameIn2 + '" is not a readable file.'));
	}

	this.imageFilename = imageFilenameOut;
	this.onDone = onDone;
	resemble('file:///' + fs.absolute(imageFilenameIn1)).compareTo('file:///' + fs.absolute(imageFilenameIn2)).onComplete(function (data) {
		self.webpage.content = '<img src="' + data.getImageDataUrl() + '"/>';
		self.resembleResult = JSON.stringify(data);
	});
};

module.exports = ImageResemble;

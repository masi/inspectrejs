/**
 *
 */

'use strict';

var system = require('system');

function TapReporter(runner) {
	var out = system.stdout;

	runner.on('start', function (context) {
		out.writeLine('TAP version 13');
		out.writeLine('1..' + context.count);
		out.writeLine('# start of test');
	});
	runner.on('success', function (item, context) {
		out.writeLine('ok ' + (context.index + 1));
	});
	runner.on('failure', function (item, context) {
		out.writeLine('not ok ' + (context.index + 1));
	});
	runner.on('end', function (statistics) {
		out.writeLine('# end of test');
	});
}

module.exports = TapReporter;

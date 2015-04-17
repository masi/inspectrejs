/**
 *
 */

'use strict';

var system = require('system');
var Command, command;

if (system.args.length < 2) {
	console.error("Usage: <phantomjs|slimerjs> inspectre.js <command>");
	phantom.exit(1);
} else {
	command = system.args[1]; // @todo sanitise input
	try {
		Command = require('./lib/cmd/' + command + '.js');
	} catch (error) {
		console.log('Unknown command "' + command + '".');
		phantom.exit(1);
	}
}

if (Command) {
	Command.execute(system.args.slice(2));
}

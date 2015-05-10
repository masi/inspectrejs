/**
 *
 */

'use strict';

function ConsoleReporter(runner) {
	runner.on('start', function (config) {
		console.log('Comparing image directories: ' + config.count + ' images');
		console.log('');
	});
	runner.on('success', function (item, context) {
		console.log(' o match');
		console.log('  ' + item.baseline);
		console.log('  ' + item.sample);
		console.log('');
	});
	runner.on('failure', function (item, context) {
		console.log(' x ' + context.result.misMatchPercentage + '% mismatch');
		console.log('  ' + item.baseline);
		console.log('  ' + item.sample);
		console.log('  ' + item.difference);
		console.log('');
	});
	runner.on('end', function (statistics) {
		console.log('Success: ' + statistics.success);
		console.log('Failure: ' + statistics.failure);
		console.log('Total: ' + statistics.total);
	});
}

module.exports = ConsoleReporter;

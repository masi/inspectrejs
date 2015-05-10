/**
 *
 */

'use strict';

var Emitter = require('../node_modules/component-emitter/index.js');

function ImagesRunner(comparator, queue, onDone, onError) {
	this.comparator = comparator;
	this.queue = Array.prototype.slice.call(queue);
	this.onDone = onDone;
	this.onError = onError;
	this.i = undefined;
	this.statistics = {
		success: 0,
		failure: 0,
		total: 0
	};
}

ImagesRunner.prototype.processQueue = function () {
	if (this.i !== undefined) {
		throw Error('A queue is currently being processed.');
	}
	this.emit('start', {
		count: this.queue.length
	});
	this.i = 0;
	this._processQueue();
};

ImagesRunner.prototype._processQueue = function () {
	var context,
		self = this;
	if (this.i === undefined) {
		throw Error('Queue is in an undefined state.');
	}
	if (this.i < this.queue.length) {
		context = {
			index: this.i,
			result: null,
			error: null,
			start: new Date()
		};
		this.comparator.compare(this.queue[this.i].baseline, this.queue[this.i].sample, this.queue[this.i].difference)
			.then(function (result) {
				context.end = new Date();
				context.duration = context.end.getTime() - context.start.getTime();
				context.result = result;
				if (parseFloat(result.misMatchPercentage) === 0.0) {
					self.statistics.success++;
					self.emit('success', self.queue[self.i], context);
				} else {
					self.statistics.failure++;
					self.emit('failure', self.queue[self.i], context);
				}
				self.statistics.total++;
				self.i++;
				self._processQueue();
			}, function (error) {
				context.error = error
				self.emit('error', self.queue[self.i], context);
				if (self.onError) {
					self.onError(self.queue[self.i], error, context);
				} else {
					console.error(JSON.stringify(error, undefined, 4))
				}
				self.i++;
				// @todo check what happens here - does the script end?
			}).then(undefined, function (error) {
				// unhandled internal error
				console.error(JSON.stringify(error, undefined, 4));
				phantom.exit(1);
			});
	} else {
		// @todo report elapsed time
		this.emit('end', this.statistics);
		if (this.onDone) {
			this.onDone(this.statistics);
		}
		this.i = undefined;
	}
};

Emitter(ImagesRunner.prototype);

module.exports.run = function (comparator, queue, onDone, onError, Reporter) {
	var runner = new ImagesRunner(comparator, queue, onDone, onError);
	if (Reporter) {
		new Reporter(runner);
	}
	runner.processQueue();
};

/**
 *
 */

'use strict';

function ImagesRunner(comparator, queue, onDone, onError) {
	this.comparator = comparator;
	this.queue = Array.prototype.slice.call(queue);
	this.onDone = onDone;
	this.onError = onError;
	this.i = undefined;
}

ImagesRunner.prototype.processQueue = function () {
	if (this.i !== undefined) {
		throw Error('A queue is currently being processed.');
	}
	this.i = 0;
	this._processQueue();
};

ImagesRunner.prototype._processQueue = function () {
	var self = this;
	if (this.i === undefined) {
		throw Error('Queue is in an undefined state.');
	}
	if (this.i < this.queue.length) {
		this.comparator.compare(this.queue[this.i].baseline, this.queue[this.i].sample, this.queue[this.i].difference)
			.then(function (result) {
				self.i++;
				self._processQueue();
			}, function (error) {
				if (self.onError) {
					self.onError(self.queue[self.i], error);
				}
				self.i++;
			});
	} else {
		// @todo report number of success and elapsed time
		if (this.onDone) {
			this.onDone();
		}
		this.i = undefined;
	}
};

module.exports.run = function (comparator, queue, onDone) {
	new ImagesRunner(comparator, queue, onDone).processQueue();
};

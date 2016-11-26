'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = PipeConcat;

var _stream = require('stream');

function PipeConcat() {
	for (var _len = arguments.length, streams = Array(_len), _key = 0; _key < _len; _key++) {
		streams[_key] = arguments[_key];
	}

	var stream = new _stream.Stream();
	stream.setMaxListeners(0);
	stream.writable = stream.readable = true;

	// you can use params or array
	if (streams[0] instanceof Array) {
		streams = streams[0];
	}

	var streamsLength = streams.length;

	function emitEvent(event) {
		var count = 0;

		return function (item) {
			var success = false;

			item.on(event, function () {
				if (success) {
					return;
				}
				success = true;

				count++;
				if (count >= streamsLength) {
					stream.emit(event);
				}
			});
		};
	}

	var emitEventEnd = emitEvent('end');
	var emitEventFinish = emitEvent('finish');
	streams.forEach(function (item) {
		item.pipe(stream, { end: false });
		emitEventEnd(item);
		emitEventFinish(item);
	});

	stream.write = function (data) {
		this.emit('data', data);
	};
	stream.destroy = function () {
		streams.forEach(function (item) {
			if (item.destroy) {
				item.destroy();
			}
		});
	};

	return stream;
}
module.exports = PipeConcat;
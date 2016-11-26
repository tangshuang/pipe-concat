import {Stream} from 'stream';

export default function PipeConcat(...streams) {
	var stream = new Stream();
	stream.setMaxListeners(0);
	stream.writable = stream.readable = true;

	// you can use params or array
	if(streams[0] instanceof Array) {
		streams = streams[0];
	}

	var streamsLength = streams.length;

	function emitEvent(event) {
		var count = 0;

		return function(item) {
			var success = false;
			
			item.on(event,() => {
				if(success) {
					return;
				}
				success = true;

				count ++;
				if(count >= streamsLength) {
					stream.emit(event);
				}
			});
		}
	}

	var emitEventEnd = emitEvent('end');
	var emitEventFinish = emitEvent('finish');
	streams.forEach(item => {
		item.pipe(stream, {end: false});
		emitEventEnd(item);
		emitEventFinish(item);
	});

	stream.write = function (data) {
		this.emit('data', data)
	}
	stream.destroy = function () {
		streams.forEach(item => {
			if(item.destroy) {
				item.destroy();
			}
		})
	}
	
	return stream;
}
module.exports = PipeConcat;
import {Stream} from 'stream';

export default function PipeConcat(...streams) {
	var stream = new Stream();
	stream.setMaxListeners(0);
	stream.writable = stream.readable = true;

	// you can use params or array
	if(streams[0] instanceof Array) {
		streams = streams[0];
	}
	
	var endCount = 0;
	var streamsLength = streams.length;
	streams.forEach(item => {
		item.pipe(stream, {end: false});
		var ended = false;
		item.on('end', () => {
			if(ended) {
				return;
			}
			ended = true;

			endCount ++;
			if(endCount >= streamsLength) {
				stream.emit('end');
			}
		});
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
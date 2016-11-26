# pipe-concat

concatenate streams in different pipe lines into one stream

## Install

```
npm install --save-dev pipe-concat
```

## Usage

```
var pipeConcat = require('pipe-concat');

var stream = pipeConcat(stream1,stream2,...);
stream.on('end',() => {
	...
});
```

For example: use in gulpfile

```
var gulp = require('gulp');
var pipeConcat = require('pipe-concat');
var sass = require('gulp-sass');
var babel = require('gulp-babel');

gulp.task('default',() => {
	var stream = pipeConcat(
		gulp.src('src/**/*.js').pipe(babel()).pipe(gulp.dest('dist')),
		gulp.src('src/**/*.scss').pipe(sass()).pipe(gulp.dest('dist'))
	);
	stream.on('end',() => {
		console.log('compile finished!')
	});
	return stream;
});
```

However, parameters can be put in an array:

```
var stream = pipeConcat([stream1,stream2,...]);
```

**Notice:** streams in `pipeConcat` run async, not one by one, so in fact, `end` event is the longest one's, from the beginning to the end costs only the longest pipe line's time.

## Development

If you want to improve this package, please git clone from [here](https://github.com/tangshuang/pipe-concat).

It's source code is written following ES6, so after your coding, just run

```
npm run babel
```

to compile code to dist directory.
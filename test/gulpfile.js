var gulp = require('gulp');
var pipeConcat = require('pipe-concat');
var sass = require('gulp-sass');
var babel = require('gulp-babel');

gulp.task('default',() => {
	var stream = pipeConcat(
		gulp.src('src/**/*.js').pipe(babel({presets:['latest']})).pipe(gulp.dest('dist')),
		gulp.src('src/**/*.scss').pipe(sass()).pipe(gulp.dest('dist'))
	);
	stream.on('end',() => {
		console.log('compile finished!')
	});
	return stream;
});
var gulp = require('gulp');
var tasks = require('gulp-load-tasks')();
var server = require('tiny-lr')();
var stylish = require('jshint-stylish');

gulp.task('coffee', function() {
	return gulp.src('dev/src/coffee/**/*.coffee')
		.pipe(tasks.coffee())
		.pipe(tasks.jshint())
		.pipe(tasks.jshint.reporter(stylish))
		.pipe(tasks.uglify())
		.pipe(tasks.concat('all.js'))
		.pipe(gulp.dest('dev/js'))
		.pipe(tasks.livereload(server));
});

gulp.task('less', function() {
	return gulp.src('dev/src/less/**/*.less')
		.pipe(tasks.less())
		.pipe(tasks.autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7"))
		.pipe(tasks.concat('all.css'))
		.pipe(gulp.dest('dev/css'))
		.pipe(tasks.livereload(server));
});

gulp.task('jade', function() {
	gulp.src('dev/src/jade/*.jade')
		.pipe(tasks.jade())
		.pipe(gulp.dest('dev/'))
		.pipe(tasks.livereload(server));
});

gulp.task('image', function() {
	gulp.src('dev/images/*')
		.pipe(tasks.imagemin({optimizationLevel: 5}))
		.pipe(gulp.dest('.tmp/images'))
});

gulp.task('build', function() {
	gulp.run('image');
	gulp.run('less');
	gulp.run('coffee');
	gulp.run('jade');
	gulp.src(['.tmp/**/*', 'dev/**/*.*', '!dev/src/**/*.*'])
		.pipe(gulp.dest('prod'));
	gulp.run('replace');
	gulp.src('.tmp', {read: false})
		.pipe(tasks.clean());
});

gulp.task('watch', function() {
	gulp.run('less');
	gulp.run('coffee');
	gulp.run('jade');
	server.listen(35729, function(err) {
		if (err) return console.log(err);

		gulp.watch('dev/src/less/**/*.less', function() {
			gulp.run('less');
		});
		gulp.watch('dev/src/coffee/**/*.coffee', function() {
			gulp.run('coffee');
		});
		gulp.watch('dev/src/jade/**/*.jade', function() {
			gulp.run('jade');
		});
	});
});
var gulp = require('gulp');
var pkg = require('./package.json');
var tasks = require('gulp-load-tasks')();
var server = require('tiny-lr')();
var stylish = require('jshint-stylish');
var connect = require('connect');


gulp.task('coffee', function() {
	return gulp.src('assets/coffee/**/*.coffee')
		.pipe(tasks.coffee())
		.pipe(tasks.jshint())
		.pipe(tasks.jshint.reporter(stylish))
		.pipe(tasks.uglify())
		.pipe(tasks.concat('all.js'))
		.pipe(gulp.dest('build/js'))
		.pipe(tasks.livereload(server));
});

gulp.task('less', function() {
	return gulp.src('assets/less/**/*.less')
		.pipe(tasks.less())
		.pipe(tasks.autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7"))
		.pipe(tasks.csso())
		.pipe(tasks.concat('all.css'))
		.pipe(gulp.dest('build/css'))
		.pipe(tasks.livereload(server));
});

gulp.task('jade', function() {
	gulp.src('assets/jade/*.jade')
		.pipe(tasks.jade())
		.pipe(gulp.dest('build'))
		.pipe(tasks.livereload(server));
});

gulp.task('image', function() {
	gulp.src('assets/images/*')
		.pipe(tasks.imagemin({optimizationLevel: 5}))
		.pipe(gulp.dest('build/images'))
});

gulp.task('build', function() {
	gulp.run('image');
	gulp.run('less');
	gulp.run('coffee');
	gulp.run('jade');
})

gulp.task('default', function() {
	gulp.run('build');
});

gulp.task('http', function() {
	connect()
		.use(require('connect-livereload')())
		.use(connect.static('./build'))
		.listen('9000');
	var options = {
		url: "http://localhost:9000",
		app: "chrome"
	};
	gulp.src('build/index.html')
		.pipe(tasks.open("", options));
}); 

gulp.task('watch', function() {
	gulp.run('build');
	server.listen(35729, function(err) {
		if (err) return console.log(err);

		gulp.watch('assets/less/**/*.less', function() {
			gulp.run('less');
		});
		gulp.watch('assets/coffee/**/*.coffee', function() {
			gulp.run('coffee');
		});
		gulp.watch('assets/jade/**/*.jade', function() {
			gulp.run('jade');
		});
	});
	gulp.run('http');
});
var gulp = require('gulp');
var pkg = require('./package.json');
var tasks = require('gulp-load-tasks')();
var server = require('tiny-lr')();
var stylish = require('jshint-stylish');
var connect = require('connect');


gulp.task('coffee', function() {
	return gulp.src('assets/coffee/**/*.coffee')
		.pipe(tasks.coffee({bare: true})
			.on('error', tasks.util.log))
		.pipe(tasks.jshint())
		.pipe(tasks.jshint.reporter(stylish))
		.pipe(tasks.uglify()
			.on('error', tasks.util.log))
		.pipe(tasks.concat('all.js')
			.on('error', tasks.util.log))
		.pipe(gulp.dest('build/js'))
		.pipe(tasks.livereload(server)
			.on('error', tasks.util.log));
});

gulp.task('less', function() {
	return gulp.src('assets/less/**/*.less')
		.pipe(tasks.less()
			.on('error', tasks.util.log))
		.pipe(tasks.autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7")
			.on('error', tasks.util.log))
		.pipe(tasks.csso()
			.on('error', tasks.util.log))
		.pipe(tasks.concat('all.css')
			.on('error', tasks.util.log))
		.pipe(gulp.dest('build/css'))
		.pipe(tasks.livereload(server)
			.on('error', tasks.util.log));
});

gulp.task('jade', function() {
	gulp.src('assets/jade/*.jade')
		.pipe(tasks.jade()
			.on('error', tasks.util.log))
		.pipe(gulp.dest('build'))
		.pipe(tasks.livereload(server)
			.on('error', tasks.util.log));
});

gulp.task('image', function() {
	gulp.src('assets/images/*')
		.pipe(tasks.imagemin({optimizationLevel: 5})
			.on('error', tasks.util.log))
		.pipe(gulp.dest('build/images'))
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

gulp.task('build', function() {
	gulp.run('image');
	gulp.run('less');
	gulp.run('coffee');
	gulp.run('jade');
})

gulp.task('default', function() {
	gulp.run('build');
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
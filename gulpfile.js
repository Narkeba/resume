var gulp = require('gulp');
var pkg = require('./package.json');
var tasks = require('gulp-load-tasks')();
var server = require('tiny-lr')();
var stylish = require('jshint-stylish');
var connect = require('connect');

var paths = {
	src: 'assets',
	build: 'build'
}

gulp.task('coffee', function() {
	return gulp.src('<% paths.src %>/coffee/**/*.coffee')
		.pipe(tasks.coffee())
		.pipe(tasks.jshint())
		.pipe(tasks.jshint.reporter(stylish))
		.pipe(tasks.uglify())
		.pipe(tasks.concat('all.js'))
		.pipe(gulp.dest('<% paths.build %>/js'))
		.pipe(tasks.livereload(server));
});

gulp.task('less', function() {
	return gulp.src('<% paths.src %>/less/**/*.less')
		.pipe(tasks.less())
		.pipe(tasks.autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7"))
		.pipe(tasks.csso())
		.pipe(tasks.concat('all.css'))
		.pipe(gulp.dest('<% paths.build %>/css'))
		.pipe(tasks.livereload(server));
});

gulp.task('jade', function() {
	gulp.src('<% paths.src %>/jade/*.jade')
		.pipe(tasks.jade())
		.pipe(gulp.dest('<% paths.build %>'))
		.pipe(tasks.livereload(server));
});

gulp.task('image', function() {
	gulp.src('<% paths.src %>/images/*')
		.pipe(tasks.imagemin({optimizationLevel: 5}))
		.pipe(gulp.dest('<% paths.build %>/images'))
});

gulp.task('default', function() {
	gulp.run('image');
	gulp.run('less');
	gulp.run('coffee');
	gulp.run('jade');
});

gulp.task('http', function() {
	connect()
		.use(require('connect-livereload')())
		.use(connect.static('./<% paths.build %>'))
		.listen('9000');
	console.log('Server listening on http://localhost:9000');
	var options = {
		url: "http://localhost:9000",
		app: "chrome"
	};
	gulp.src('<% paths.build %>/index.html')
		.pipe(tasks.open("", options));
}); 

gulp.task('watch', function() {
	gulp.run('less');
	gulp.run('coffee');
	gulp.run('jade');
	server.listen(35729, function(err) {
		if (err) return console.log(err);

		gulp.watch('<% paths.src %>/less/**/*.less', function() {
			gulp.run('less');
		});
		gulp.watch('<% paths.src %>/coffee/**/*.coffee', function() {
			gulp.run('coffee');
		});
		gulp.watch('<% paths.src %>/jade/**/*.jade', function() {
			gulp.run('jade');
		});
	});
	gulp.run('http');
});
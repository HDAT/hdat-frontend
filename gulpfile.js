var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSync = require('run-sequence');

// execute bash tasks
var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }

// Normal tasks
gulp.task('clean', function(cb) {
    return del('dist', cb);
});

gulp.task('scripts', function () {

    return gulp.src([
            'src/scripts/client/playback/prologue.js',
            'src/scripts/client/playback/Util.js', 
            'src/scripts/client/playback/MoveableMarker.js',
            'src/scripts/client/playback/Track.js',
            'src/scripts/client/playback/TrackController.js',
            'src/scripts/client/playback/Clock.js',
            'src/scripts/client/playback/TracksLayer.js',
            'src/scripts/client/playback/Control.js',
            // 'src/scripts/client/playback/DataStream.js',
            'src/scripts/client/playback/Playback.js',
            'src/scripts/client/playback/epilogue.js',
            'src/scripts/client/main.js'
        ])
        .pipe($.concat('main.js'))
        // .pipe($.babel())
        .pipe($.jshint({
            globals: {
                "L": false,
                "define": false,
                "require": false,
                "module": false,
                "clearInterval": false,
                "window": false,
                "console": false,
                "XMLHttpRequest": false
            }
        }))
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe($.connect.reload());
});

gulp.task('vendor', function () {
    exec("bower install", puts);
    return gulp.src([
                'bower_components/leaflet/dist/leaflet.js',
                'bower_components/gsap/src/minified/TweenMax.min.js'
            ])
        .pipe($.concat('vendor.js'))
        .pipe(gulp.dest('dist/scripts/'))
        .pipe($.connect.reload());
});

gulp.task('styles', function () {
    return gulp.src('src/styles/main.scss')
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/'))
        .pipe($.connect.reload());
});

gulp.task('json', function() {  
    return gulp.src(['src/data/**/*.json'])
        .pipe(gulp.dest('dist/data'))
        .pipe($.connect.reload());
});

gulp.task('html', function() {  
	return gulp.src(['src/**/*.html'])
		.pipe(gulp.dest('dist'))
        .pipe($.connect.reload());
});

gulp.task('images', function() {  
	return gulp.src(['src/images/**'])
		.pipe(gulp.dest('dist/images'))
        .pipe($.connect.reload());
});

gulp.task('fonts', function() {  
	return gulp.src(['src/fonts/**'])
		.pipe(gulp.dest('dist/fonts'))
        .pipe($.connect.reload());
});

gulp.task('build', ['clean'], function(cb){
    runSync(['scripts', 'vendor', 'styles', 'json', 'html', 'images', 'fonts'], cb)
});

gulp.task('serve', ['build'], function(){
    // Start live-reload server
    $.connect.server({
        root: 'dist/',
        port: 8888,
        livereload: true
    });

    // Watches
    gulp.watch(['src/data/**/*.json'], ['json']);
    gulp.watch(['src/**/*.html'], ['html']);
    gulp.watch(['src/styles/**/*.{scss,css}'], ['styles']);
    gulp.watch(['src/scripts/client/**/*.js'], ['scripts']);
    // gulp.watch(['src/images/**/*', '!src/images/tiles/**/*'], ['images']);
    gulp.watch(['src/fonts/**/*'], ['fonts']);
});

gulp.task('default', ['serve'], function() {});

gulp.task('deploy', ['build'], function() {
    return gulp.src('./dist/**/*')
        .pipe($.ghPages());
});

gulp.task('production', ['build'], function() {
    return gulp.src('./dist/**/*')
        .pipe($.ghPages({
            remoteUrl: 'git@github.com:HDAT/HDAT.github.io.git',
            branch: 'master'
    }));
});



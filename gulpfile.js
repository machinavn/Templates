/* Filename: Gulpfile.js 
 */

/*
 * Grab Plugins
 */

var gulp = require('gulp');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var size = require('gulp-size');
var notify = require('gulp-notify');
var less = require('gulp-less');
var path = require('path');
var cleanCSS = require('gulp-clean-css');

var gutil = require('gulp-util');
var bs = require('browser-sync').create(); // create a browser sync instance.

/*
 * HTML TASK
 * -- Minify HTML (gulp-htmlmin)
 *
 */
 gulp.task('minifyHTML', function() {
  return gulp.src('_SRC/*.html')
  	.pipe(size({title : 'Original file :',showFiles : true}))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(size({title : 'Minified file :',showFiles : true}))
    .pipe(gulp.dest('_DIST'))
});

/* 
 * Image Task
 * -- Optimize Image
 */


/* 
 * CSS TASK
 * -- write CSS section.less file like header.less, contact.less
 * -- @include or import .less file in style.less
 	  normalize.less, bootstrap.less, mixins.less
 * -- Complile less/style.less to css/main.css (gulp-less)
 * -- Concat all css files in src/css to one file and output to dist/style.css
 * 
 */

 gulp.task('less', function () {
  return gulp.src('_SRC/less/style.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('_SRC/css/'))
    .pipe(bs.reload({stream: true}));
});


 gulp.task('minify-css', function() {
    return gulp.src('_SRC/css/*.css')
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(gulp.dest('_DIST/css'));
});




/*
 * JAVASCRIPT TASK
 * -- Minify JS (gulp-uglify)
 * -- Concat all .js files in src/js and output to dist/js/bundle.js (gulp-concat)
 * 
 */




/* 
 * BROWSER SYNC TASK
 */

gulp.task('browser-sync', function() {
    bs.init({
        server: {
            baseDir: "./_SRC"
        }
    });
});


/* 
 * WATCH TASK
 */



gulp.task('watch', ['browser-sync'], function () {
    gulp.watch("_SRC/*html",['minifyHTML'])
    gulp.watch("_SRC/less/*.less", ['less']);
    gulp.watch("_DIST/*.html").on('change', bs.reload);
});


/* 
 * To do Task 
 *
 * -- Customize index.html
   -- include bootstrap
   -- set mixins and variables to style.less
   -- build default task
   -- include waypoints.js, animate.css, and some jquery plugins
   -- combine css to style.css output to _DIST
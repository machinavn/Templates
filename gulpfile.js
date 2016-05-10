/* Filename: Gulpfile.js 
 */

/*
 * Grab Plugins
 */

var gulp = require('gulp');

var changed = require('gulp-changed'); // View File changed
var rename = require('gulp-rename'); //Rename File
var htmlmin = require('gulp-htmlmin'); // Minify HTML
var size = require('gulp-size'); //Output file size
var notify = require('gulp-notify');
var less = require('gulp-less'); // LESS processor
var path = require('path');
var cleanCSS = require('gulp-clean-css'); // minify CSS
var concat = require('gulp-concat'); // Concatenate Files

var uglify = require('gulp-uglify'); // Minify JavaScript
var jshint = require('gulp-jshint'); // Lint Javascript error on save


var gutil = require('gulp-util'); // Print Log
const chalk = require('chalk'); // Color log for easy reading
var bs = require('browser-sync').create(); // create a browser sync instance.

/*
 * HTML TASK
 * -- Minify HTML (gulp-htmlmin) // Manual run : gulp minifyHTML
 *
 */

  gulp.task('html', function(){
      gulp.src('_SRC/**/*.html')
      .pipe(bs.reload({stream:true}));
  });

 gulp.task('minifyHTML', function() {
  gutil.log('');
  return gulp.src('_SRC/*.html')
  	.pipe(size({title : chalk.cyan('Original file :'), showFiles : true})) // An Example of using Chalk
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(size({title : 'Minified file :',showFiles : true}))

    .pipe(gulp.dest('_DIST'))
    .pipe(bs.reload({stream: true}));

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
            gutil.log(' ');
            gutil.log('Original File: ' + gutil.colors.magenta(details.name) + ' '+ details.stats.originalSize/1000 + ' kB');
            gutil.log('Compressed to file: ' + gutil.colors.magenta(details.name) + ' ' + details.stats.minifiedSize/1000 + ' kB' + ' --- ' + 'save: ' + details.stats.efficiency.toFixed(2)*100 +' %');
            gutil.log(' ');
        }))
        .pipe(gulp.dest('_DIST/css'));
});




/*
 * JAVASCRIPT TASK
 * -- Minify JS (gulp-uglify)
 * -- Concat all .js files in src/js and output to dist/js/bundle.js (gulp-concat)
 * -- Manual run by command : gulp scripts
 * -- JS hint when save.
 */

gulp.task('jshint', function() {
  return gulp.src(['_SRC/js/main.js','_SRC/js/plugins.js']) // Add JS files need to watch on save here
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('scripts', function() {
  return gulp.src('_SRC/js/**/*.js')
    .pipe(size({title : 'Original file :',showFiles : true}))
    .pipe(uglify())
    .pipe(concat('bundle.js'))
    .pipe(size({title : 'Compressed file :',showFiles : true}))
    .pipe(gulp.dest('_DIST/js'))
    .pipe(bs.reload({stream: true})); // Reload Browser whenever Update Scripts
;
});



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
    gulp.watch("_SRC");     
    gulp.watch("_SRC/less/**/*.less", ['less']); // Watch Less folder whenever .less file change
    gulp.watch('_SRC/**/*.html', ['html']);
    gulp.watch("_SRC/js/**/*.js").on('change', bs.reload); // Reload Browser whenever update Scripts
    gulp.watch(["_SRC/js/main.js","_SRC/js/plugins.js"], ['jshint']);

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

   */


/*
 * BUILD TASK
 * -- Include Minify HTML, Minify CSS, Concat and Minify JavaScript
 */

gulp.task('build',['minifyHTML','minify-css','scripts'])
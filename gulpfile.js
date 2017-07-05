var gulp = require('gulp');
var sass = require('gulp-sass');
// Browser Sync helps us do live-reloading easily
var browserSync = require('browser-sync').create();
// gulp-useref plugin helps concatenate js, css files in one file
var useref = require('gulp-useref');
// plugin for minify a JS file
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
// plugin for minify a CSS file
var cssnano = require('gulp-cssnano');
// clean files that are no longer used
var del = require('del');
// run task using sequence
var runSequence = require('run-sequence');


gulp.task('hello', function() {
    console.log("Hello hello..")
});

gulp.task('clean:dist', function () {
    return del.sync('dist')
});

gulp.task('task-name', function () {
    return gulp.src('source-files') // Get source files with gulp.src
        .pipe(aGulpPlugin()) // Sends it through a gulp  plugin
        .pipe(gulp.dest('destination')) // Outputs the file in the destination folder
});

// Gulp-sass uses LibSass to convert into CSS
gulp.task('sass', function(){
    return gulp.src('app/scss/styles.scss') // Gets all files ending with .scss in app/scss and children dirs : app/scss/**/*/styles.scss
        .pipe(sass()) // Using gulp-sass
        .pipe(gulp.dest('app/css'))
        // Update css from browser when this task is ran
        .pipe(browserSync.reload({
            stream: true
        }))
});


gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    })
});

// Gulp provides us a watch method that checks to see if a file is saved
//gulp.watch('app/scss/**/*.scss', ['sass']); // Whenever a .scss file is saved, runs sass task

// When we have more than one folder to watch
// BrowserSync and sass must be completed before watch is allowed to run
gulp.task('watch', ['browserSync', 'sass'], function(){
    gulp.watch('app/scss/styles.scss', ['sass']);
    // Other watchers
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('app/index.html', browserSync.reload);
    gulp.watch('app/js/**/*/main.js', browserSync.reload);
});

// useref = concatenate files from index.html, based on comment 'build', and move the result file in dist folder
gulp.task('useref', function () {
   return gulp.src('app/index.html')
       .pipe(useref())
       // Minifies only if it's a javascript file
       .pipe(gulpIf('*.js', uglify()))
       .pipe(gulp.dest('dist'))
        // Minifies only if it's css file
       .pipe(gulpIf('*.css', cssnano()))
       .pipe(gulp.dest('dist'))

});

// run task one after another
gulp.task('task1', function () {
    console.log('Running task1..')
});
gulp.task('task2', function () {
    console.log('Running task2..')
});
gulp.task('task3', function () {
    console.log('Running task3..')
});

gulp.task('build', function (callback) {
    runSequence('task1', 'task2', 'task3', callback);
});


//////// when a task is named default, you can use only gulp command to run it
gulp.task('default', function (callback) {
    runSequence(['sass', 'browserSync', 'watch'], callback)
});


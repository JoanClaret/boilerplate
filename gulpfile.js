var gulp            = require('gulp'),
    uglify          = require('gulp-uglify'),
    rename          = require('gulp-rename'),
    concat          = require('gulp-concat'),
    sass            = require('gulp-sass'),             // SASS compiler
    cssnano         = require('gulp-cssnano'),          // CSS minify
    gutil           = require('gulp-util'),             // Utility functions for gulp plugins (for example beep on errors)
    livereload      = require('gulp-livereload'),       // Automatically reload browser when saving a file
    notify          = require('gulp-notify'),           // Sweet notifications on your desktop
    plumber         = require('gulp-plumber'),          // Prevent pipe breaking caused by errors from gulp plugins
    autoprefixer    = require('gulp-autoprefixer'),     // Prefixes for old browsers
    browserify      = require('browserify'),            // Load modules
    source          = require('vinyl-source-stream'),   // Gives streaming vinyl file object
    buffer          = require('vinyl-buffer')           // Convert from streaming to buffered vinyl file object
;

// Error handling
var onError = function (err) {
    notify.onError({
        title: "Gulp",
        subtitle: "Failure!",
        message: "Error: <%= error.message %>",
        sound: "Beep"
    })(err);
    this.emit('end');
};

// Styles
gulp.task('styles', function () {
    return gulp.src('./src/scss/styles.scss')
        .pipe(plumber({errorHandler: onError}))
        .pipe(sass({compress: false}).on('error', gutil.log))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssnano())
        .pipe(rename("styles.min.css"))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(notify({ message: 'Styles task complete' }))
    ;
});

// Scripts
gulp.task('scripts', function() {
  return browserify('./src/js/main.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js/'))
    .pipe(notify({ message: 'Scripts task complete' }))
  ;
});

// Default task
gulp.task('default', ['styles', 'scripts']);


// Watch files
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('./src/scss/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('./src/js/*.js', ['scripts']);

  // Create LiveReload server
  livereload.listen();

  // Watch any files in dist/, reload on change
  gulp.watch(['./dist/**']).on('change', livereload.changed);

});

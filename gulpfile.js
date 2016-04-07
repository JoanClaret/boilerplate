var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var uglify      = require('gulp-uglify');
var rename      = require('gulp-rename');
var buffer      = require('vinyl-buffer');
var cssnano     = require('gulp-cssnano');


var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
  browserSync.notify(messages.jekyllBuild);
  return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
    .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

/**
 * Compile styles
 */
gulp.task('sass', function () {
  return gulp.src('_src/scss/styles.scss')
    .pipe(sass({
        includePaths: ['scss'],
        onError: browserSync.notify
    }))
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(cssnano())
    .pipe(rename("styles.min.css"))
    .pipe(gulp.dest('_site/dist/css'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('dist/css'));
});


/**
 * Compile scripts
 */
gulp.task('js', function() {
  return browserify('_src/js/main.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('_site/dist/js/'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('dist/js/'))
  ;
});


/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
  gulp.watch('_src/scss/*.scss', ['sass']);
  gulp.watch('_src/js/*.js', ['js']);
  gulp.watch(['*.html', '_layouts/*.html', '_posts/*'], ['jekyll-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);

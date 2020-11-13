const gulp = require('gulp')
const htmlmin = require('gulp-htmlmin')
const exec = require('child_process').exec

const root = './public'
const buildDir = root
const files = {
  html: [ `${root}/**/*.html` ],
  js: [ `${root}/**/*.js`, `!${root}/**/*.min.js` ],
  css: [ `${root}/**/*.css` ],
}

const cleanTask = function (cb) {
  exec('hexo clean', function (err) {
    if (err) return cb(err)
    cb()
  })
}

const buildTask = function (cb) {
  exec('hexo g', function (err) {
    if (err) return cb(err)
    cb()
  })
}

const htmlminTask = function () {
  return gulp
    .src(files.html)
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
    }))
    .pipe(gulp.dest(buildDir))
}

const releaseTask = function (cb) {
  exec('hexo d', function (err) {
    if (err) return cb(err)
    cb()
  })
}

gulp.task('build', gulp.series(cleanTask, buildTask))

gulp.task('minify', gulp.parallel(htmlminTask))

gulp.task('release', gulp.series('build', 'minify', releaseTask))

gulp.task('default', gulp.series('release'))

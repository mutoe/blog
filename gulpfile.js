var gulp = require('gulp')
var htmlmin = require('gulp-htmlmin')
var exec = require('child_process').exec

var root = './public'
var buildDir = root
var datas = {
  html: [root + '/**/*.html'],
  js: [root + '/**/*.js', '!' + root + '/**/*.min.js'],
  css: [root + '/**/*.css'],
}

const cleanTask = function(cb) {
  exec('hexo clean', function(err) {
    if (err) return cb(err)
    cb()
  })
}

const buildTask = function(cb) {
  exec('hexo g', function(err) {
    if (err) return cb(err)
    cb()
  })
}

const htmlminTask = function() {
  return gulp
    .src(datas.html)
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest(buildDir))
}

const releaseTask = function(cb) {
  exec('hexo d', function(err) {
    if (err) return cb(err)
    cb()
  })
}

gulp.task('build', gulp.series(cleanTask, buildTask))

gulp.task('minify', gulp.parallel(htmlminTask))

gulp.task('release', gulp.series('build', 'minify', releaseTask))

gulp.task('default', gulp.series('release'))

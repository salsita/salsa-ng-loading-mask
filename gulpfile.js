var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');

gulp.task('example', function() {
  nodemon({
    script: 'example/server.js'
  });
});

gulp.task('default', ['example']);
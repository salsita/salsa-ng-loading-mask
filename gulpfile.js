var gulp = require('gulp'),
    karma = require('karma').server;

gulp.task('test', function(done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: false
    }, done);
});

gulp.task('build', function() {

});

gulp.task('default', ['build']);
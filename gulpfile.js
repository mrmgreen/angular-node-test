var gulp = require('gulp');
var mongodbData = require('gulp-mongodb-data');
var config = require('./config.js');


gulp.task('metadata', function() {
  gulp.src('./db/metadata/*.json')
    .pipe(mongodbData({
      mongoUrl: 'mongodb://localhost/' + config.dbName,
      collectionName: 'users'
    }));
});
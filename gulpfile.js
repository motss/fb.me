const gulp = require('gulp');
const builder = require('@messageflow/build').builder({
  dist: '.',
  cleanGlobs: ['./*.js', './*.d.ts', '!./gulpfile.js', '!./json.d.ts'],
});

gulp.task('lint', builder.lint);
gulp.task('default', gulp.series(...[builder.clean, 'lint', builder.ts]));

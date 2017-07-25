import gulp from 'gulp'
import stylus from 'gulp-stylus'
import cleancss from 'gulp-clean-css'
import autoprefixer from 'autoprefixer-stylus'
import server from 'ss-server-base'
import babel from 'gulp-babel'
import path from 'path'
import find from 'find'
import font from './font-create'
import concat from 'gulp-concat'
import addItem from 'gulp-additem'
import uglify from 'gulp-uglify'

gulp.task('style', () => {
  gulp
    .src(['src/style/*.styl', '!src/style/base.styl'])
    .pipe(stylus({
      use: [autoprefixer({
        browsers: [
          'last 2 versions', 'ie 9'
        ],
        cascade: false
      })]
    }))
    .pipe(cleancss())
    .pipe(gulp.dest('dist/style/'))
})

gulp.task('script', () => {
  gulp.src(['node_modules/jquery/dist/jquery.min.js'])
    .pipe(addItem(
      gulp.src('src/script/common.js')
        .pipe(babel())
        .pipe(uglify())
    ))
    .pipe(concat('common.js'))
    .pipe(gulp.dest('dist/script'))
  gulp
    .src(['src/script/**/*.js', '!src/script/common.js'])
    .pipe(babel())
    .pipe(gulp.dest('dist/script/'))
})

gulp.task('html', finish => {
  find.file(/\.html$/, path.join(__dirname, 'src'), files => {
    font.createFont(
      files,
      path.join(__dirname, 'src/style/font/font.ttf'),
      path.join(__dirname, 'dist/style/font/font.ttf')
    ).then(function () {
      gulp.src('./src/**/*.html')
        .pipe(gulp.dest('./dist/'))

      finish()
    }, function (e) {
      console.log(e)
    })
  })
})

gulp.task('assets', ['html'], () => {
  return gulp.src('./src/style/image/*.*')
    .pipe(gulp.dest('./dist/style/image'))
})

gulp.task('build', ['assets'], () => {
  gulp.run('script', 'style')
})

gulp.task('development', ['assets'], () => {
  gulp.run('script', 'style')

  gulp.watch(['src/**/*.html'], () => {
    gulp.run('html')
  })

  gulp.watch(['src/**/*.styl'], () => {
    gulp.run('style')
  })

  gulp.watch(['src/**/*.js'], () => {
    gulp.run('script')
  })

  gulp.watch(['src/style/image/**/*.*'], () => {
    gulp.run('assets')
  })

  server.run(__dirname, 3000, 'dist')
})

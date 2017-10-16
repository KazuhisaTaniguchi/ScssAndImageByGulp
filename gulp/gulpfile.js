var gulp = require('gulp');
// sass用
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var cmq = require('gulp-combine-media-queries');//@media
var autoprefixer = require('gulp-autoprefixer');

// IMG min用
// 必要なプラグインの読み込み
var changed  = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var imageminJpg = require('imagemin-jpeg-recompress');
var imageminPng = require('imagemin-pngquant');
var imageminGif = require('imagemin-gifsicle');
var svgmin = require('gulp-svgmin');

/* 各種ディレクトリー設定 */

var scssDir = 'scss';
var cssDir = '../css';
var paths = {
  srcDir : 'bigimg',
  dstDir : '../images'
}

/* SCSSの処理 */

gulp.task('sass',function(){
    gulp.src(scssDir + '/*.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass({outputStyle: 'compressed'})) //出力形式の種類　#nested, compact, compressed, expanded.
    .pipe(sourcemaps.write())
    .pipe(autoprefixer())
    .pipe(gulp.dest(cssDir));
});

gulp.task('cmq', function () {
  gulp.src(cssDir + '/*.css')
    .pipe(cmq({
      log: false
    }))
    .pipe(gulp.dest(cssDir));
});
/* SCSSの処理 END */

/* 画像圧縮の処理 */


// 圧縮前と圧縮後のディレクトリを定義
// jpg,png,gif画像の圧縮タスク
gulp.task('imagemin', function(){
    var srcGlob = paths.srcDir + '/**/*.+(jpg|jpeg|png|gif)';
    var dstGlob = paths.dstDir;
    gulp.src( srcGlob )
    .pipe(changed( dstGlob ))
    .pipe(imagemin([
        imageminPng(),
        imageminJpg(),
        imageminGif({
            interlaced: false,
            optimizationLevel: 3,
            colors:180
        })
    ]
    ))
    .pipe(gulp.dest( dstGlob ));
});
// svg画像の圧縮タスク
gulp.task('svgmin', function(){
    var srcGlob = paths.srcDir + '/**/*.+(svg)';
    var dstGlob = paths.dstDir;
    gulp.src( srcGlob )
    .pipe(changed( dstGlob ))
    .pipe(svgmin())
    .pipe(gulp.dest( dstGlob ));
});

/* 画像圧縮の処理 END */


gulp.task('watch', function () {
    gulp.watch(scssDir + '/**/*.scss', ['sass']);
    gulp.watch(paths.srcDir + '/**/*', ['imagemin','svgmin']);
});
gulp.task('default', ['sass','cmq', 'imagemin', 'svgmin']);

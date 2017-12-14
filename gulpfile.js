/*
 * @Author: 詹真琦 
 * @Date: 2017-12-08 15:18:50 
 * @Description: 
 * @Last Modified by: 詹真琦
 * @Last Modified time: 2017-12-14 16:57:08
 */

const gulp = require("gulp"),
    gutil = require("gulp-util"),
    del = require("del"),
    through2 = require("through2"),
    path = require("path"),
    fs = require("fs"),
    //编译sass
    sass = require("gulp-sass"),
    //压缩js
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename"),
    browserSync = require("browser-sync").create(),
    reload = browserSync.reload,
    sequence = require("run-sequence"),
    plumber = require("gulp-plumber"),
    watch = require("gulp-watch"),
    svgstore = require("gulp-svgstore"),
    svgmin = require("gulp-svgmin"),
    //css3补全前缀
    autoprefixer = require('gulp-autoprefixer'),
    //图片压缩
    imagemin = require('gulp-imagemin'),
    //深度图片压缩扩展
    pngquant = require('imagemin-pngquant'),
    //缓存文件
    cache = require('gulp-cache'),
    //合并文件
    concat = require('gulp-concat'),
    //压缩html
    htmlmin = require('gulp-htmlmin'),
    //保持文件名称
    named = require('vinyl-named'),
    webpack = require('gulp-webpack');

const paths = {
    src: path.resolve(__dirname, './src'),
    js: path.resolve(__dirname, './src/app/js'),
    css: path.resolve(__dirname, './src/app/css'),
    img: path.resolve(__dirname, './src/app/img'),
    widget: path.resolve(__dirname, './src/widget'),
    staticJs: path.resolve(__dirname, './src/static/js')
}

// 保存定时器，限制浏览器刷新频率
let reloadTimer = null;

function reloadBrowser() {
    // # watch src资源, 调用相关任务预处理
    // # 刷新浏览器
    // # 限制浏览器刷新频率

    watch(paths.src + "/**/*", (obj) => {
        let url = obj.path.replace(/\\/g, "/");
        let absurl = url;
        url = path.relative(paths.src, url).replace(/\\/g, "/");
        console.log("[KS] " + absurl);

        // skip scss & css
        if (!/\.scss$/.test(url) && !/\.css$/.test(url)) {
            if (reloadTimer) {
                clearTimeout(reloadTimer);
            }
            reloadTimer = setTimeout(reload, 1000);
        }
    });
}
gulp.task('sass',()=>{
    return 
})
gulp.task('js', () => {
    return gulp.src(paths.js + '/**/*.js')
        .pipe(named())
        .pipe(webpack(require('./webpack.config')))
        .pipe(gulp.dest(paths.staticJs));
});

gulp.task('default', () => {
    // start server
    browserSync.init({
        ui: false,
        notify: false,
        port: 5679,
        // 设置代理请求
        proxy: 'http://localhost:3000',
        server: false
    });
    //sass文件监听
    //js文件监听
    var jsPath = [paths.js + '/**/*.js'];
    gulp.src(jsPath)
        .pipe(watch(jsPath, () => gulp.start('js')));

    // 监听刷新
    reloadBrowser();    
});
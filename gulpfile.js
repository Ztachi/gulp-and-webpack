/*
 * @Author: 詹真琦(legendryztachi@gmail.com)
 * @Date: 2017-12-08 15:18:50 
 * @Description: 
 * @Last Modified by: 詹真琦(legendryztachi@gmail.com)
 * @Last Modified time: 2017-12-15 17:10:09
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
    svg: path.resolve(__dirname, './src/app/svg'),
    html: path.resolve(__dirname, './src/app/view'),
    widget: path.resolve(__dirname, './src/widget'),
    staticJs: path.resolve(__dirname, './src/static/js'),
    staticCss: path.resolve(__dirname, './src/static/css'),
    staticImg: path.resolve(__dirname, './src/static/img'),
    staticSvg: path.resolve(__dirname, './src/static/svg'),
    staticHtml: path.resolve(__dirname, './src/static/view')
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

//编译sass
gulp.task('sass', () => {
    return gulp.src(paths.css + '/**/*.scss')
        .pipe(plumber())
        .pipe(sass({
                precision: 2,
                outputStyle: "expanded"
            })
            .on("error", sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 30 versions'], //兼容版本
            cascade: true, //是否美化属性值
            remove: false //是否去掉不必要的前缀
        }))
        .pipe(gulp.dest(paths.staticCss))
        .pipe(reload({
            stream: true
        }));
})

//编译js
gulp.task('js', () => {
    return gulp.src(paths.js + '/**/*.js')
        .pipe(named())
        .pipe(webpack(require('./webpack.config')))
        .pipe(gulp.dest(paths.staticJs));
});

//压缩图片
gulp.task('imgMin', () => {
    return gulp.src(paths.img + '/**/*.{png,jpg,gif,ico,svg}')
        .pipe(cache(imagemin({ //缓存图片
            optimizationLevel: 7, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
            use: [pngquant()] //深度压缩
        })))
        .pipe(gulp.dest(paths.staticImg));
});

//清除缓存
gulp.task('clearCache', () =>
    cache.clearAll()
);

//合并，压缩SVG
gulp.task("svgsprite", function() {
	return gulp.src(paths.svg+'/**/*.svg')
		.pipe(plumber())
		.pipe(rename({prefix: 'icon-'}))
		.pipe(through2.obj(function(file, enc, cb) {
			console.log(file.path);
			this.push(file);
			cb();
		})
		)
		.pipe(cache(svgmin({
			plugins: [
				{ removeTitle: true },
				{ removeDesc: true },
				{ removeUselessDefs: true },
				{ removeUnknownsAndDefaults: true },
				{ removeUselessStrokeAndFill: true },
				{ convertTransform: true },
				{ mergePaths: true },
				{ convertPathData: false },
				{ convertShapeToPath: true },
				{ removeStyleElement: true },
				{ removeAttrs: {attrs: "(class|style|fill|data-.*)"} }
			]
		})))
		.pipe(svgstore( {inlineSvg: true} ))
		.pipe(gulp.dest(paths.staticSvg));
});

//压缩html
gulp.task('htmlMin', () => {
    return gulp.src(paths.html+'/**/*.html')
        .pipe(htmlmin({
            removeComments: true, //清除HTML注释
            collapseWhitespace: true, //压缩HTML
            collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
            minifyJS: true, //压缩页面JS
            minifyCSS: true //压缩页面CSS
        }))
        .pipe(gulp.dest(paths.staticHtml));
});

//启动项目
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
    let cssPath = paths.css + '/**/*.scss';
    gulp.src(cssPath)
        .pipe(watch(cssPath, () => gulp.start('sass')));
    //js文件监听
    let jsPath = paths.js + '/**/*.js';
    gulp.src(jsPath)
        .pipe(watch(jsPath, () => gulp.start('js')));
    //img文件监听
    let imgPath = paths.img+ '/**/*.{png,jpg,gif,ico,svg}';
    gulp.src(imgPath)
        .pipe(watch(imgPath, () => gulp.start('imgMin')));
    //svg文件监听
    let svgPath = paths.svg+'/**/*.svg';
    gulp.src(svgPath)
        .pipe(watch(svgPath, () => gulp.start('svgsprite')));
    //html文件监听
    let htmlPath = paths.html+'/**/*.html';
    gulp.src(htmlPath)
        .pipe(watch(htmlPath, () => gulp.start('htmlMin')));

    // 监听刷新
    reloadBrowser();
});
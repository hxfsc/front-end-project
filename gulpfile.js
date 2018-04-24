var gulp = require('gulp'),
    mkdir = require('mkdirp');

var includeFile = require('gulp-file-include'),
    connect = require('gulp-connect'),
    //proxy = require('http-proxy-middleware'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnext = require('cssnext'),
    precss = require('precss');


var __srcPath = './src/';
var __buildPath = './build/';

var __dev = {
    port: 8000,
    src: {
        html: __srcPath + 'html/',
        style:__srcPath + 'styles/',
        js: __srcPath + 'javascript/',
        images: __srcPath + 'images/',
        img: __srcPath + 'img/'
    },

    build: {
        html: __buildPath,
        style: __buildPath + 'public/styles/',
        js: __buildPath + 'public/javascript/',
        images: __buildPath + 'public/images/',
        img: __buildPath + 'public/img/'
    }
};


gulp.task('create', function(){
    mkdir.sync(__dev.src.html);
    mkdir.sync(__dev.src.js);
    mkdir.sync(__dev.src.style);
    mkdir.sync(__dev.src.images);
    mkdir.sync(__dev.src.img);
});

gulp.task('html', function () {
    gulp.src(__dev.src.html + "*.html")
        .pipe(includeFile({
                indent: true
        }))
        .pipe(gulp.dest(__dev.build.html));
});


gulp.task('style', function () {
    var processors = [
        autoprefixer({browsers: ['>1%', 'last 12 version']}),
        cssnext,
        precss
    ];

    gulp.src(__dev.src.style + "*.scss")
        .pipe(sass({
                /***
                * outputStyle {'nested':'嵌套','expanded':'展开','compact':'紧凑','compressed':'压缩'}
                */
                outputStyle: 'compact'
        }).on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(gulp.dest(__dev.build.style));
});

gulp.task('img', function() {
	gulp.src(__dev.src.img + '*.*')
	    .pipe(gulp.dest(__dev.build.img));
});

gulp.task('images', function() {
	gulp.src(__dev.src.images + '*.*')
	    .pipe(gulp.dest(__dev.build.images));
})


//var webpack = require('webpack'), webpackConfig = require('./webpack.config.js');

gulp.task('javascript', function(callback) {
	gulp.src(__dev.src.js + '**/*.*')
	.pipe(gulp.dest(__dev.build.js));
	// var __webpackConfig = Object.create(webpackConfig);
	// webpack(__webpackConfig,function(err,stats) {
	// 	callback()
	// });
});

gulp.task('fonts', function(callback) {
	gulp.src('./src/fonts/' + '*.*')
	.pipe(gulp.dest('./build/public/fonts'));
	// var __webpackConfig = Object.create(webpackConfig);
	// webpack(__webpackConfig,function(err,stats) {
	// 	callback()
	// });
});





gulp.task('connect', function() {
    connect.server({
        root: __dev.build.html,
        port: __dev.port,
        host: "192.168.3.38",
        //host: "192.168.110.71",
        livereload: true,
        /*middleware: function(connect, opt) {
            return [
                proxy('/client/getArticleList',  {
                    target: 'http://www.opsmarttech.com',
                    changeOrigin:true
                }),
                proxy('/client/getArticleInfo', {
                    target: 'http://www.opsmarttech.com',
                    changeOrigin:true
                }),
                proxy('/client/submitMsg', {
                    target: 'http://www.opsmarttech.com',
                    changeOrigin:true
                })
            ]
        }*/
    });
});

gulp.task('reload', function () {
	gulp.src(__dev.build.html + '*.html')
		.pipe(connect.reload());
});


gulp.task('watch', function () {
    gulp.watch(__dev.src.html + '**/*.html', ['html']);
    gulp.watch(__dev.src.style + '**/*.scss',['style']);
    gulp.watch(__dev.src.js + '**/*.js', ['javascript']);

    gulp.watch(__dev.build.style + '*.css',['reload']);
    gulp.watch(__dev.build.js + '*.js', ['reload']);
    gulp.watch(__dev.build.html + '*.html', ['reload']);
});

gulp.task('default', ['html', 'style', 'img', 'images', 'javascript', 'fonts', 'connect', 'watch']);

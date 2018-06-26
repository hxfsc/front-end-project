var gulp = require('gulp'),
    mkdir = require('mkdirp');

var includeFile = require('gulp-file-include'),
    connect = require('gulp-connect'),
    //proxy = require('http-proxy-middleware'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnext = require('cssnext'),
    cssnano = require('cssnano'),
    precss = require('precss'),
    rollup = require('rollup'),
    rollupUglify = require('rollup-plugin-uglify').uglify,
    babel = require('rollup-plugin-babel');


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
        precss,
        cssnext,
        autoprefixer({browsers: ['>1%', 'last 12 version']}),
        cssnano({
            reduceIdents: false
        }),
    ];
    gulp.src(__dev.src.style + "*.css")
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


gulp.task('javascript', function() {
	// gulp.src(__dev.src.js + '**/*.*')
    // .pipe(gulp.dest(__dev.build.js));

    rollup.rollup({
        input: __dev.src.js + "/main.js",
        plugins: [babel({
            exclude:"node_modules/**"
        }), rollupUglify()]
    }).then(bundle => {
        bundle.write({
            file: __dev.build.js + "/main.js",
            format: "umd",
            sourcemap: true
        })
    })

});

gulp.task('fonts', function() {
	gulp.src('./src/fonts/' + '*.*')
	.pipe(gulp.dest('./build/public/fonts'));
});


gulp.task('connect', function() {
    connect.server({
        root: __dev.build.html,
        port: __dev.port,
        //host: "192.168.3.38",
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
    gulp.watch(__dev.src.style + '**/*.css',['style']);
    gulp.watch(__dev.src.js + '**/*.js', ['javascript']);

    gulp.watch(__dev.build.style + '*.css',['reload']);
    gulp.watch(__dev.build.js + '*.js', ['reload']);
    gulp.watch(__dev.build.html + '*.html', ['reload']);
});

gulp.task('default', ['html', 'style', 'img', 'images', 'javascript', 'fonts', 'connect', 'watch']);

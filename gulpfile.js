/**
 * @描述: gulpfile
 * @作者: chenjiujiu
 * @创建日期: 2018/3/18
 */

/*
* 文件结构
* -dist//代码产出目录
* -dev//开发目录
* 	-lib
* 	-css
* 	-js
* 	-scss
* 	-images
* 	-font
* 	-index.html
*/

/*==工具引入==*/
var gulp = require('gulp'); //gulp
var browserSync = require('browser-sync').create(); //浏览器刷新
var reload= browserSync.reload;
var htmlmin = require('gulp-htmlmin');	//html压缩
var sass = require('gulp-sass');	//scss编译
var cssmin = require('gulp-cssmin');	//css压缩
var uglify = require('gulp-uglify'); //js压缩
var imagemin = require('gulp-imagemin'); //img压缩
var del = require('del'); //清空
var rename = require('gulp-rename'); //重命名
var runSequence = require('run-sequence'); //异步执行代码
/*==文件路径定义==*/
var config = {
	//开发文件
	html:	'./dev/**/*.html',	//html
	css:	'./dev/css/**/*.css',	//css
	js:	'./dev/js/**/*.js',	//js
	images:	'./dev/images/**/*',	//img
	font:	'./dev/font/**/*',	//font
	scss:	['./dev/scss/**/*.scss', '!./dev/scss/**/_*.scss'],
	scssc:	'./dev/css',
	lib:'./dev/**/*.*',
	//生产路径
	htmlDist:	'./dist',
	cssDist:	'./dist/css',
	jsDist:	'./dist/js',
	imagesDist:	'./dist/images',
	fontDist:	'./dist/font',
	libDist:'./dev/lib'
};
/*==编译scss到src/css==*/
gulp.task('scssc',function(){
	return gulp.src(config.scss)	//查找
		.pipe(sass())	//编译
		.pipe(gulp.dest(config.scssc))	//输出
		.pipe(reload({stream:true}))	//重新加载
});
/*==压缩html，压缩后放入dest==*/
gulp.task('html',function(){
	return gulp.src(config.html)	//查找
		.pipe(htmlmin({	//压缩
			removeComments: true,//清除HTML注释
			collapseWhitespace: true,//压缩HTML
			collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
			removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
			removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
			removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
			minifyJS: true,//压缩页面JS
			minifyCSS: true//压缩页面CSS
		}))
		.pipe(gulp.dest(config.htmlDist))	//输出
});
/*==压缩css，压缩后放入dest/css==*/
gulp.task('css',function(){
	return gulp.src(config.css)	//查找
		.pipe(cssmin())	//压缩
		.pipe(gulp.dest(config.cssDist))	//输出
});
/*==压缩js，压缩后放入dest/js==*/
gulp.task('js',function(){
	return gulp.src(config.js)	//查找
		.pipe(uglify())	//压缩
		.pipe(gulp.dest(config.jsDist))	//输出
});
/*==压缩图片，压缩后放入dest/images==*/
gulp.task('img',function(){
	return gulp.src(config.images)	//文件查找
		.pipe(imagemin({	//image压缩参数
			optimizationLevel:5,	//优化等级(0-7),默认:3
			progressive:true,	//无损压缩jpg图片,默认:false
			interlaces:true,	//隔行扫描gif进行渲染,默认:false
			multipass:true	//多次优化svg直到完全优化,默认:false
		}))
		.pipe(gulp.dest(config.imagesDist));	//文件输出
});
/*==复制字体文件到dest/images==*/
gulp.task('font',function(){
	return gulp.src(config.font)	//文件查找
		.pipe(gulp.dest(config.fontDist));	//文件输出
});
/*==复制lib文件dest/lib==*/
gulp.task('lib',function(){
	return gulp.src(config.lib)	//文件查找
		.pipe(gulp.dest(config.libDist));	//文件输出
});
/*==打包前清空dest文件夹内容==*/
gulp.task('del',function(cb){
	return del(['dist/**/*'], cb)
});
/*==同步刷新==*/
gulp.task('serve',function(){
	browserSync.init({	//启动browserSync服务
		server:{
			baseDir:'./dev',	//启动服务的目录
			index:'index.html'	//启动文件名
		},
		open:'external'//启动时自动打开的网址，external表示可外部打开url
	});
	//监听文件变化，执行相应任务
	gulp.watch(config.scss,['scssc']);
	gulp.watch([config.html,config.js,config.images]).on('change', reload);
});

/*==默认调用开发模式==*/
gulp.task('default', ['serve']);
/*==build 项目打包==*/
gulp.task('build', function(cb){
	runSequence(
		'del',
		['html','css','js','img','font','lib'],
		cb
	);
});





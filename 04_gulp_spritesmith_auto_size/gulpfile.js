const gulp = require('gulp');
const spritesmith = require('gulp.spritesmith');
const buffer = require('vinyl-buffer');
const merge = require('merge-stream');
const stylus = require('gulp-stylus');
const runSequence = require('run-sequence');

gulp.task('sprite',()=>{
    console.log('sprite');
    const spriteData = gulp.src('src/sprite_src/*')
        .pipe(spritesmith({
            imgName: '../img/sprite.png',
            cssName: '_sprite.css',
            padding: 4,
            imgOpts: { quality: 100 },
            cssTemplate: 'src/css/template/basic.hbs',
            cssHandlebarsHelpers: {      
                echo( o ){
                    console.log(o);
                },  
                percent(value, base) {
                    return `${value / base * 100}%`;
                },
                bgPosition(spriteSize, size, offset) {
                    const result = offset / (size - spriteSize) * 100;
                    if( isNaN( result )){
                        return "0";
                    }
                    return `${result}%`;
                },
            },
        }));
    const imgStream = spriteData.img
        .pipe(buffer())
        .pipe(gulp.dest('dist/img/'));

    const cssStream = spriteData.css
        .pipe(gulp.dest('src/css'));
    return merge(imgStream, cssStream);
});

gulp.task('stylus',()=>{
    console.log('stylus');
    return gulp.src('src/css/**/*.styl')
        .pipe(stylus({
            compress: false,
            'include css': true,
        }))
        .pipe(gulp.dest('dist/css'))
});

gulp.task('default', ()=> runSequence('sprite','stylus'));
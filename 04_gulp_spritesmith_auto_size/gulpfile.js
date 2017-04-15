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
            cssTemplate: 'src/css/handlebars/basic.handlebars',
            cssHandlebarsHelpers: {               
                half(num) {
                    return `${Math.floor(num / 2)}px`;
                },
                retinaBGS(spriteSheetWidth, itemWidth) {
                    return `${(spriteSheetWidth / itemWidth) * 100}%`;
                },
                getVW(itemWidth) {
                    return `${(itemWidth / 640) * 100}vw`;
                },
                autoSizePosition(spriteSheetSize, itemSize, itemOffset) {
                    const s = spriteSheetSize / itemOffset;
                    const w = spriteSheetSize / 640;
                    return `${(w / s) * 100}vw`;
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
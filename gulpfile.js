const { src, dest, watch, parallel } = require("gulp");
//css
const sass = require("gulp-sass")(require("sass"));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');


//imagenes
const cache = require('gulp-cache');
const webp = require('gulp-webp');
const imagemin = require("gulp-imagemin");
const avif = require("gulp-avif");
//JavaScript
const tercer = require('gulp-terser-js');
function css(done) {
    //identificar el archivo de sass
    //compilarlo
    //almacenar en el disco duro
    src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([ autoprefixer(), cssnano() ]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css'));

    done();
}
function imagenes(done) {
    const options = {
        optimizationLevel: 3
    }
    src('src/img/**/*.{png,jpg}')
        .pipe(cache(imagemin(options)))
        .pipe(dest('build/img'))
    done();
}
function versionWebp(done) {
    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe(webp(opciones))
        .pipe(dest('build/img'))
    done()
}

function versionAvif(done) {
    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'))
    done()
}

function javascrip(done) {
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(tercer())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'))

    done()
}

function dev(done) {
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascrip);
    done();
}

exports.css = css;
exports.javascrip = javascrip;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.imagenes = imagenes;
exports.dev = parallel(versionWebp, imagenes, versionAvif, javascrip, dev);
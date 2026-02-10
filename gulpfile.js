const { src, dest } = require("gulp");
const gulp = require("gulp");
const browsersync = require("browser-sync").create();
const fileinclude = require("gulp-file-include");
const del = require("del");
const scss = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
// const imagemin = require("gulp-imagemin");

const projectFolder = "build";
const sourceFolder = "src";

const path = {
  build: {
    html: projectFolder + "/",
    css: projectFolder + "/css/",
    js: projectFolder + "/js/",
    img: projectFolder + "/img/",
    fonts: projectFolder + "/fonts/",
    libs: projectFolder + "/libs/",
  },
  src: {
    html: [sourceFolder + "/*.html", "!" + sourceFolder + "/_*.html"],
    css: sourceFolder + "/scss/style.scss",
    js: sourceFolder + "/js/script.js",
    img: sourceFolder + "/img/**/*.{jpg,png,svg,gif,ico,webp,mp4}",
    fonts: sourceFolder + "/fonts/*.{woff,woff2,ttf}",
    libs: sourceFolder + "/libs/*",
  },
  watch: {
    html: sourceFolder + "/**/*.html",
    css: sourceFolder + "/scss/**/*.scss",
    js: sourceFolder + "/js/**/*.js",
    img: sourceFolder + "/img/**/*.{jpg,png,svg,gif,ico,webp,mp4}",
    fonts: sourceFolder + "/fonts/*.{woff,woff2,ttf}",
    libs: sourceFolder + "/libs/*",
  },
  clean: "./" + projectFolder + "/",
};

function browserSync(params) {
  browsersync.init({
    server: {
      baseDir: "./" + projectFolder + "/",
    },
    port: 3000,
    notify: false,
  });
}

function html() {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}

function css() {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: "expanded",
      }),
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: [">0.01%"],
        cascade: true,
      }),
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

function js() {
  return src(path.src.js).pipe(fileinclude()).pipe(dest(path.build.js)).pipe(browsersync.stream());
}

function images() {
  return (
    src(path.src.img)
      // .pipe(
      //     imagemin({
      //         progressive: true,
      //         interlaced: true,
      //         optimizationLevel: 4,
      //     })
      // )
      .pipe(dest(path.build.img))
      .pipe(browsersync.stream())
  );
}

function fonts() {
  return src(path.src.fonts).pipe(dest(path.build.fonts)).pipe(browsersync.stream());
}

function libs() {
  return src(path.src.libs).pipe(dest(path.build.libs)).pipe(browsersync.stream());
}

function watchFiles(params) {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
  gulp.watch([path.watch.fonts], fonts);
  gulp.watch([path.watch.libs], libs);
}

function clean(params) {
  return del(path.clean);
}

const build = gulp.series(clean, gulp.parallel(html, css, js, images, fonts, libs));
const watch = gulp.parallel(build, watchFiles, browserSync);

exports.libs = libs;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;

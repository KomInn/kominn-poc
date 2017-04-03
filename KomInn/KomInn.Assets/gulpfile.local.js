var gulp = require('gulp');
var sass = require('gulp-sass');
var webpack = require('webpack');

var paths = {   
    libroot:"./Provisioning/Site Assets/", 
    js:"./Provisioning/Site Assets/js",
    css:"./Provisioning/Site Assets/css",
    npmmodules:"./node_modules/"    
}

var npmmodules = {
    "react": paths.npmmodules + "react/dist/react*.js",
    "react-dom":paths.npmmodules + "react-dom/dist/react-dom*.js",
    "bootstrap":paths.npmmodules + "bootstrap/dist/**/*",
    "jquery":paths.npmmodules + "jquery/dist/*.min.*"    
};

gulp.task("default", ['sass', 'copynpmmodules']);

/* SASS */
gulp.task("sass", function () {
    return gulp.src("./Styles/Style.scss").
    pipe(sass())
    .pipe(gulp.dest(paths.css));
});

gulp.task('sasscompile', function () {
    gulp.watch("./Styles/Style.scss", ["sass"]);
});


/* Copy libs */ 
gulp.task('copynpmmodules', function () {
    for (var src in npmmodules) {       
        gulp.src(npmmodules[src])
        .pipe(gulp.dest(paths.libroot + "lib/" + src));
    }
});

/* Livereload */ 
gulp.task('serve', function() {
  gulp.src('app')
    .pipe(server({
      livereload: true,
      directoryListing: true,
      open: true,
      defaultFile:"./Pages/index.html",
      host:"192.168.0.10"
      
    }));
});

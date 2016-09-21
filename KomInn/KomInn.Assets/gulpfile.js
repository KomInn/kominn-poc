var gulp = require('gulp');
var sass = require('gulp-sass');
var webpack = require('webpack-stream');

var paths = {   
    sp_libroot:"W:\\", 
    sp_js:"W:\\js\\",
    sp_css:"W:\\css\\",
    sp_sitepageslib:"X:\\",
    sptest_libroot:"Y:\\",
    lc_sitepagessrc:"./Provisioning/SitePages/",
    lc_libroot:"./Provisioning/SiteAssets/",
    lc_js:"./Provisioning/SiteAssets/js/",
    lc_css:"./Provisioning/SiteAssets/css/",
    npmmodules:"./node_modules/"    
}

var npmmodules = {
    "react": paths.npmmodules + "react/dist/react*.js",
    "react-dom":paths.npmmodules + "react-dom/dist/react-dom*.js",
    "bootstrap":paths.npmmodules + "bootstrap/dist/**/*",
    "jquery":paths.npmmodules + "jquery/dist/*.min.*",
    "typeahead":paths.npmmodules + "corejs-typeahead/dist/*", 
    "jquery.autogrow-textarea":paths.npmmodules + "jquery.autogrow-textarea/*.js"    
};

gulp.task("default", ['sass', 'copynpmmodules', 'tsc', 'copypages']);

/* SASS */
gulp.task("sass", function () {
    return gulp.src("./Styles/Style.scss").
    pipe(sass())
    .pipe(gulp.dest(paths.lc_css))
    .pipe(gulp.dest(paths.sp_css));
});

/* TSX */
gulp.task("tsc", ['copynpmmodules'], function() {
    return gulp.src('./Scripts/dependencies.js')
        .pipe(webpack(require('./webpack.config.js')))               
        .pipe(gulp.dest(paths.lc_js))
        .pipe(gulp.dest(paths.sp_js));
});

gulp.task("pushtest", ['tsc'], function() {
    return gulp.src("./Provisioning/SiteAssets/**/*")
    .pipe(gulp.dest(paths.sptest_libroot));
});

/* Pages */
gulp.task("copypages", function() {
     return gulp.src(paths.lc_sitepagessrc+"*.aspx")           
           .pipe(gulp.dest(paths.sp_sitepageslib));       
  
});


gulp.task('sasscompile', function () {
    gulp.watch("./Styles/Style.scss", ["sass"]);
});

gulp.task('tscauto', function() {
    gulp.watch("./Provisioning/SiteAssets/js/bundle.js", ["distributejs","sass"])
});

gulp.task("distributejs", function() {
    gulp.src("./Provisioning/SiteAssets/js/bundle.js")
    .pipe(gulp.dest(paths.sp_js));
});


/* Copy libs */ 
gulp.task('copynpmmodules', function () {
    for (var src in npmmodules) {       
        gulp.src(npmmodules[src])
        .pipe(gulp.dest(paths.lc_libroot + "lib/" + src))
        .pipe(gulp.dest(paths.sp_libroot + "lib/" + src));
       
    }
});


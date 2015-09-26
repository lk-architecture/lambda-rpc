import gulp from "gulp";
import {execSync} from "child_process";
import babel from "gulp-babel";
import eslint from "gulp-eslint";
import mocha from "gulp-spawn-mocha";

gulp.task("build", function () {
    try {
        execSync("rm -r dist/");
    } catch (err) {
        // Ignore
    }
    return gulp.src("src/**/*.js")
        .pipe(babel())
        .pipe(gulp.dest("dist/"));
});

gulp.task("test", function () {
    return gulp.src(["test/**/*.js"])
        .pipe(mocha({
            compilers: "js:babel/register",
            env: {
                NODE_ENV: "test",
                NODE_PATH: "./src/"
            },
            istanbul: true
        }));
});

gulp.task("lint", function () {
    return gulp.src(["src/**/*.js"])
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task("default", ["test", "lint"], function () {
    return gulp.watch(["src/**/*.js", "test/**/*.js"], ["test", "lint"]);
});

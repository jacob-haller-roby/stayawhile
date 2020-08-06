const gulp = require('gulp');
const fs = require("fs");
const rmrf =  require("rmrf");
const {spawn} = require("child_process");

const PathTo = {
    ServerSrc: 'server/src',
    Distrib: 'server/dist',
    ClientDistrib: 'server/dist/build',
    ClientBuild: 'client/build',
    Server: 'server'
};

const spawnOpts = {
    shell: true,
    cwd: __dirname,
    stdio: ['ignore', 'inherit', 'inherit'],
};

function waitForProcess(childProcess) {
    return new Promise((resolve, reject) => {
        childProcess.once('exit', (code) => {
            if (code === 0) {
                resolve(code);
            } else {
                reject(code);
            }
        });
        childProcess.once('error', (err) => {
            reject(err);
        });
    });
}

async function clean() {
    rmrf(PathTo.Distrib);
    fs.mkdirSync(PathTo.Distrib);
    return Promise.resolve();
}

async function compileClient() {
    const args = ['--cwd', 'client', 'build'];
    return waitForProcess(spawn('yarn', args, spawnOpts));
}

async function compileServer() {
    const args = ['--cwd', 'server', 'build'];
    return waitForProcess(spawn('yarn', args, spawnOpts));
}

async function compileServerDev() {
    const args = ['--cwd', 'server', 'build-dev'];
    return waitForProcess(spawn('yarn', args, spawnOpts));
}

function bundleStaticsToServer() {
    return gulp.src(`${PathTo.ClientBuild}/**/*.*`, { base: PathTo.ClientBuild }).pipe(gulp.dest(`${PathTo.ClientDistrib}`));
}

exports.build = gulp.series(clean, compileServer, compileClient, bundleStaticsToServer);
exports.buildDev = gulp.series(clean, compileServerDev, compileClient, bundleStaticsToServer);
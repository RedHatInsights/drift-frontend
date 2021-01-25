/* global require, module, __dirname, process */

const path = require('path');
const appName = require('../package.json').insights.appname;
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin({
    branch: true
});
const entry = process.env.NODE_ENV === 'production' ?
    path.resolve(__dirname, '../src/entry.js') :
    path.resolve(__dirname, '../src/entry-dev.js');

let deploymentEnv = '/apps';
let release = '';
const gitBranch = process.env.BRANCH || gitRevisionPlugin.branch();
const betaBranch =
    gitBranch === 'master' ||
    gitBranch === 'qa-beta' ||
    gitBranch === 'prod-beta';
const buildStable = process.env.BUILD_STABLE === 'true';

const buildBeta = (betaBranch || process.env.BUILD_BETA === 'true') && !buildStable;

if (process.env.NODE_ENV === 'production' && buildBeta) {
    deploymentEnv = '/beta/apps';
}

const publicPath = `${deploymentEnv}/${appName}/`;

module.exports = {
    paths: {
        entry,
        public: path.resolve(__dirname, '../dist'),
        src: path.resolve(__dirname, '../src'),
        presentationalComponents: path.resolve(__dirname, '../src/PresentationalComponents'),
        smartComponents: path.resolve(__dirname, '../src/SmartComponents'),
        pages: path.resolve(__dirname, '../src/pages'),
        static: path.resolve(__dirname, '../static'),
        publicPath
    },
    deploymentEnv,
    release
};

const { resolve } = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const config = require('@redhat-cloud-services/frontend-components-config');
const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../'),
    https: false,
    debug: true,
    ...process.env.BUILD_STABLE && { deployment: 'apps' },
    ...process.env.BUILD_BETA && { deployment: 'beta/apps' }
});

plugins.push(
    require('@redhat-cloud-services/frontend-components-config/federated-modules')({
        root: resolve(__dirname, '../')
    })
);

module.exports = function(env) {
    if (env && env.analyze === 'true') {
        plugins.push(new BundleAnalyzerPlugin());
    }

    return {
        ...webpackConfig,
        plugins
    };
};

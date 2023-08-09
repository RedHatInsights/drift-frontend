const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');

const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../'),
    debug: true,
    https: true,
    useProxy: true,
    routesPath: process.env.CONFIG_PATH,
    appUrl: process.env.BETA ? [ '/beta/insights/drift', '/preview/insights/drift' ] : [ '/insights/drift' ],
    env: process.env.BETA ? 'stage-beta' : 'stage-stable',
    deployment: process.env.BETA ? 'beta/apps' : 'apps'
});

plugins.push(
    require('@redhat-cloud-services/frontend-components-config/federated-modules')({
        root: resolve(__dirname, '../'),
        exposes: {
            './RootApp': resolve(__dirname, '../src/DevEntry')
        },
        exclude: [ 'react-redux', 'react-router-dom' ],
        shared: [
            {
                'react-redux': {
                    requiredVersion: '*',
                    singleton: true
                }
            },
            {
                'react-router-dom': {
                    singleton: true,
                    requiredVersion: '*'
                }
            }
        ]
    })
);

module.exports = {
    ...webpackConfig,
    plugins,
    devServer: {
        ...webpackConfig.devServer,
        hot: false,
        liveReload: false
    }
};

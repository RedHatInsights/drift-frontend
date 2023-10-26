const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');

const proxyConfiguration = {
    rootFolder: resolve(__dirname, '../'),
    useProxy: process.env.PROXY === 'true',
    appUrl: process.env.BETA ? [ '/beta/insights/drift', '/preview/insights/drift' ] : [ '/insights/drift' ],
    deployment: process.env.BETA ? 'beta/apps' : 'apps',
    env: process.env.BETA ? 'stage-beta' : 'stage-stable',
    proxyVerbose: true,
    debug: true
};

const { config: webpackConfig, plugins } = config(proxyConfiguration);

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

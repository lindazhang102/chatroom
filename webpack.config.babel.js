import { defaultConfig } from './webpacks/utils';

import clientConfig from './webpacks/client';

const webpackConfig = [
    clientConfig,
];
webpackConfig.publicPath = defaultConfig.output.publicPath;

module.exports = webpackConfig;

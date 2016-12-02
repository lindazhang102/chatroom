import { defaultConfig } from './webpacks/utils';

import adminConfig from './webpacks/admin';
import clientConfig from './webpacks/client';
import mobileConfig from './webpacks/mobile';

const webpackConfig = [
    adminConfig,
    clientConfig,
    mobileConfig
];
webpackConfig.publicPath = defaultConfig.output.publicPath;

module.exports = webpackConfig;

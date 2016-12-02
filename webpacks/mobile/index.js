import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer';

import entry from './entry';
import { fileHash, env, isLocal, isDevelopmentEnv,
    defaultPlugins, imageLoader, defaultConfig, NODE_PATH, } from '../utils';

const rootPath = path.join(__dirname, '../../');

const plugins = [
    ...defaultPlugins,
];

const config = Object.assign({}, defaultConfig, {
    entry,
    resolve: {
        root: [
            NODE_PATH,
        ],
        alias: {
            config: path.join(rootPath, `/configs/client/config.${env}.js`),
        },
    },
    plugins,
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: path.join(rootPath, `/node_modules`),
            loaders: ['babel'],
        }, {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract('css!postcss!less'),
        }, imageLoader],
    },
});

export default config;

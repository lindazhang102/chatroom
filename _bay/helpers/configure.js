/* eslint no-param-reassign: 0 */
import path from 'path';
import i18n from 'i18n';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackAssets from 'express-webpack-assets';
import cookieParser from 'cookie-parser';

import { fetch } from './request';

import webpackConfig from '../../webpack.config.babel';

const rootPath = path.join(__dirname, '../../');

const setLocals = (config) => (req, res, next) => {
    Object.assign(res.locals, {
        cssWebpackPath: (filename) =>
            `${config.STATIC_URL}${res.locals.webpack_asset(filename).css}`,
        jsWebpackPath: (filename) =>
            `${config.STATIC_URL}${res.locals.webpack_asset(filename).js}`,
    });
    next();
};

const setFetch = () => (req, res, next) => {
    res.fetch = (url, options) => fetch(url, req, res, options);
    next();
};

export const configure = (app, config) => {
    const env = app.get('env');
    const isDevelopmentEnv = !(env === 'production' || env === 'debug');

    // Set app locals
    app.locals.isProductionEnv = !isDevelopmentEnv;
    app.locals.baydnPath = (filepath) => `${config.BAYDN_URL}${filepath}`;
    app.locals.imagePath = (url) => `${config.STATIC_URL}/chatroom/images/${url}`;
    app.locals.assetsPath = (filename) => `${config.STATIC_URL}${filename}`;
    app.locals.LOGIN_URL = config.LOGIN_URL;
    app.locals.basedir = path.join(rootPath, '/_bay/views');

    // Webpack
    if (isDevelopmentEnv) {
        const compiler = webpack(webpackConfig);
        app.use(webpackDevMiddleware(compiler, {
            noInfo: true,
            publicPath: webpackConfig.publicPath,
        }));
        app.use(webpackHotMiddleware(compiler));
    }

    // Middleswares
    // webpack assets (path based on app.js)
    app.use(webpackAssets('public/webpack-assets.json', { devMode: isDevelopmentEnv }));
    // req.cookies.${cookie}
    app.use(cookieParser());
    // custom
    app.use(setLocals(config));
    app.use(setFetch());

    // View Engine
    // pug
    app.set('views', path.join(rootPath, '/views'));
    app.set('view engine', 'pug');

    // Static Resources (path based on app.js)
    app.use('/chatroom/public', express.static('public'));
    app.use('/chatroom/images', express.static('images'));
};

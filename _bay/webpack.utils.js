import webpack from 'webpack';
import path from 'path';

import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer';
import AssetsWebpackPlugin from 'assets-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';

export const fileHash = (fileName) => {
    const name = fileName.split('.');
    if (!isDevelopmentEnv) {
        return `${name[0]}-[chunkhash].${name[1]}`;
    }
    return fileName;
};

export const env = process.env.NODE_ENV;
export const isLocal = process.env.SB_LOCAL === 'local';
export const isDevelopmentEnv = env === 'development';

const rootPath = path.join(__dirname, '../');

export const NODE_PATH = path.join(isLocal ? rootPath : '/usr/local/lib', '/node_modules');
export const ASSETS_PATH = path.join(rootPath, '/public');
export const PUBLIC_PATH = '/chatroom/public/';

export const devHot = entryPath => (
    [entryPath].concat(isDevelopmentEnv ? [
        'webpack-hot-middleware/client',
        'webpack/hot/only-dev-server',
    ] : [])
);

export const defaultPlugins = [
    new CleanWebpackPlugin([`.${PUBLIC_PATH}`]),
    new ExtractTextPlugin(fileHash('[name].css')),
    new AssetsWebpackPlugin({
        path: path.join(rootPath, '/public'),
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(isDevelopmentEnv ? 'development' : 'production'),
        },
    }),
];

if (isDevelopmentEnv) {
    defaultPlugins.push(new webpack.HotModuleReplacementPlugin());
} else {
    defaultPlugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
        },
    }));
}

export const defaultConfig = {
    postcss: () => [autoprefixer({
        browsers: ['> 0.02%'],
    })],
    resolve: {
        root: [NODE_PATH],
    },
    resolveLoader: {
        modulesDirectories: [NODE_PATH],
    },
    output: {
        path: ASSETS_PATH,
        filename: fileHash('[name].js'),
        publicPath: PUBLIC_PATH,
    },
    devtool: isDevelopmentEnv ? '#eval' : false,
};

export const imageLoader = {
    test: /\.(png|svg|jpg)$/,
    loader: 'url-loader?limit=5000&name=[path][sha512:hash:base64:16].[ext]',
};

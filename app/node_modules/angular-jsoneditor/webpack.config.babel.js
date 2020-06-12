// webpack.config.js

import webpack from 'webpack';
import path from 'path';
const libraryName = 'angular-jsoneditor';
const outputFile = libraryName + '.js';

export default {
    eslint: {
        configFile: '.eslintrc.json',
        fix: false
    },
    entry: __dirname + '/src/index.js',
    devtool: 'source-map',
    output: {
        path: __dirname + '/dist',
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        preLoaders: [
            {test: /\.js$/, loader: 'eslint-loader', exclude: /node_modules/}
        ],
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['ng-annotate', 'babel-loader']
            },
            {
                test: /\.(html|json)$/,
                loader: 'raw-loader'
            },
            {
                test: /\.svg/,
                loader: 'svg-url-loader'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }
        ]
    },
    resolve: {
        root: path.resolve('./src'),
        extensions: ['', '.js']
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};

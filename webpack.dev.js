const { merge } = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common.js');



module.exports = merge(common, {
    devServer: {
        compress: true,
        static: path.join(__dirname, 'example'),
        port: 9000,
    },
    devtool: 'inline-source-map',
    entry: {
        'alcm.logger.js': ['./src/index.ts'],
    },
    mode: 'development',
    output: {
        filename: '[name]',
        library: {
            name: ['alcm', 'logger'],
            type: 'umd'
        },
        path: path.resolve(__dirname, 'example'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'example/index.html',
            title: 'Logger Test',
        }),
    ],
});

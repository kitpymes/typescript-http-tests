var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        'main': './main.ts'
    },
    output: {
        filename: './bundle/[name].js',
        libraryTarget: 'var',
        library: '[name]'
    },
    devtool: "source-map",
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: ['ts-loader']
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            inject: true
        })
    ],
    externals: {

    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 4040,
        open: true 
    }
};
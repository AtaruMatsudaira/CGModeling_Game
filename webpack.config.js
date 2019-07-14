const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'src', 'app.ts'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js',
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
            },
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'node_modules/three/examples/js'),
                ],
                use: 'imports-loader?THREE=three',
            },
            {
                test: /\.(vs|fs|txt)$/,
                include: [
                    path.resolve(__dirname, "src"),
                ],
                use: 'raw-loader',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new CopyWebpackPlugin([
            { from: '*.png', context: 'src' },
            { from: '*.jpg', context: 'src' },
            { from: '*.gif', context: 'src' },
        ]),
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        port: 8080,
    },
}

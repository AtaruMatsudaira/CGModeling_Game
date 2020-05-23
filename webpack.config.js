const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

/**
 * @type import('webpack').Configuration
 */
module.exports = {
    mode: 'development',
    entry: './src/app.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js',
        chunkFilename: 'vendor.js',
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
                test: /\.(vs|fs|txt)$/,
                include: [
                    path.resolve(__dirname, "src"),
                ],
                use: 'raw-loader',
            },
        ],
    },
    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: '**/*',
                    context: 'src',
                    globOptions: {
                        ignore: ['*.ts', '*.js', '*.fs', '*.vs', '*.txt']
                    },
                    noErrorOnMissing: true,
                },
                {
                    from: '**/*',
                    context: 'assets',
                    noErrorOnMissing: true,
                }
            ],
        }),
    ],
    devtool: "inline-source-map",
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        port: 8080,
    },
}

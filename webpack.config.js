const path = require('path');

module.exports = {
    mode: 'development',
    entry: './app.ts',
    output: {
        path: path.resolve(__dirname, ''),
        filename: 'app.js',
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
        ],
    },
    devtool: 'source-map',
}

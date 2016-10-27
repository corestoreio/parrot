var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        './src/index.js'
    ],
    output: {
        path: path.resolve(__dirname, '/static/dist'),
        filename: 'bundle.js',
        publicPath: path.resolve(__dirname, '/static/')
    },
    module: {
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ],
        loaders: [
            {
                test: /\.js$/,
                loaders: [
                    'react-hot',
                    'babel-loader'
                ],
                exclude: /node_modules/,
                include: path.join(__dirname, 'src')
            }
        ]
    }
}
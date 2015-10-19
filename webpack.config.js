var webpack = require('webpack');

module.exports = {
    devtool: 'eval',
    context: __dirname + '/public',
    entry: {
        javascript: [
        'webpack-dev-server/client?http://0.0.0.0:8889', // WebpackDevServer host and port
        'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
        "./src/app.jsx"
        ],
        html: "./index.html",
    },
    output: {
        path: __dirname + '/public/dist',
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            { 
                test: /\.jsx$/, 
                exclude: /node_modules/,
                loaders: ["react-hot", "babel-loader"]
            },
            {
                test: /\.html$/,
                loader: "file?name=[name].[ext]",
            },
            { 
                test: /\.less$/, 
                loader: "style!css!less" 
            }
        ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ]
}
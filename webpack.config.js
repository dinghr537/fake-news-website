const webpack = require("webpack");
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
    'home',
    'data',
    'method',
    'demo1',
    'newsEditor',
].map((entry, index) => {
    const config = {
        entry: `./src/${entry}.jsx`,
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: `${entry}.bundle.js`,
        },
        // optimization: {
        //     splitChunks: {
        //         chunks: 'all',
        //         cacheGroups:
        //     },
        // },
        module: {
            rules: [
                {
                    test: /\.js|\.jsx$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-react']
                        }
                    }
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: 'style-loader',
                        },
                        {
                            loader: 'css-loader',
                        },
                        {
                            loader: 'sass-loader',
                        },
                    ]
                },
                {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    use: [
                        'url-loader?limit=10000',
                        'img-loader'
                    ]
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                filename: `${entry}.html`,
                // chunks: [`${entry}`],
                template: './src/template.html',
            }),
        ]
    }

    // Comments below are for the original dev server, but now we're using another server, see /server/index.js

    //     if (index == 0) {
    //         config.devServer = {
    //             contentBase: path.join(__dirname, 'dist'),
    //             compress: true,
    //             port: 4000,
    //             setup(app) {

    //                 let express = require('express');
    //                 app.use(express.json());
    //                 app.use(express.urlencoded());

    //                 app.get("/get/some-data", function (req, res) {
    //                     console.log(req);
    //                     res.send("GET res sent from webpack dev server")
    //                 })

    //                 app.post("/post/some-data", express.json(), function (req, res) {
    //                     console.log(req.body);
    //                     res.send({
    //                         content: "Fall back news: <num><num1><num2><num3>日美國總統<per0>與英國<en>首相<per1>於<loc0>舉行雙<en2>邊會談，兩人會後發布聯合聲明，<per0>表示支持<org0>..." })
    //                 })
    //             }
    //         }
    //     }

    return config;
});

const webpack = require("webpack");
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
    'home',
    'data',
    'method',
    'demo1',
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

    if (index == 0) {
        config.devServer = {
            contentBase: path.join(__dirname, 'dist'),
            compress: true,
            port: 4000,
            setup(app) {

                let express = require('express');
                app.use(express.json());
                app.use(express.urlencoded());

                app.get("/get/some-data", function (req, res) {
                    console.log(req);
                    res.send("GET res sent from webpack dev server")
                })

                app.post("/post/some-data", express.json(), function (req, res) {
                    console.log(req.body);
                    res.send({
                        content: "好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊\
好啊好啊好啊好啊好啊好啊，好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊\
好啊好啊好啊好啊好啊好啊好。啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊\
好啊好啊好啊好啊好啊好啊好啊好，啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊\
好啊好啊好啊好啊好啊好啊好啊好啊好。啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊\
好啊好啊好啊好啊好啊好啊好啊好啊好啊好，啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊\
好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好。啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊好啊" })
                })
            }
        }
    }

    return config;
});

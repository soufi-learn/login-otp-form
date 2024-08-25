require("dotenv").config();
const path = require("node:path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");


// create MPA with webpack
module.exports = {
    // mode
    mode: "development",
    // entry file 
    entry: {
        main: "./src/js/main.js"
    },
    // output file
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "js/[name]-[contenthash].js", // hash file
        clean: true // remove not useful files and clean dist folder
    },
    // dev server
    devServer: {
        static: {
            directory: path.resolve(__dirname, "./src/pages"),
        },
        compress: false,
        open: true,
        port: process.env.frontPort || 8081,
    },
    // plugins
    plugins: [
        // bind env vars
        new webpack.DefinePlugin({
            "process.env.baseUrl": JSON.stringify(process.env.baseUrl),
        }),
        // css modules
        new MiniCssExtractPlugin({
            filename: "styles/[name]-[contenthash].css"
        }),
        // pages
        new HtmlWebpackPlugin(
            {
                template: "./src/pages/index.html",
                minify: true,
                filename: "index.html",
                chunks: ["main"]
            }
        )
    ],
    // loaders
    module: {
        rules: [
            // add css modules 
            {
                test: /\.css$/i, // regex
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            // add png svg png jpg jpeg modules
            {
                test: /\.(png|jpg|svg|gif|jpeg)$/i, // regex
                type: "asset/resource"
            },
            // add fonts modules
            {
                test: /\.(woff|woff2|eot|ttf|tof)$/i, // regex
                type: "asset/resource"
            },
            // add babel modules
            {
                test: /\.(?:js|mjs|cjs)$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: "ie 11" }]
                        ]
                    }
                }
            }
        ]
    },

    // optimization
    optimization: {
        minimize: false,
        minimizer: [
            new TerserWebpackPlugin(),
        ],
    },
}
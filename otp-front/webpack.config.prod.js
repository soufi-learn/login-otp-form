const path = require("node:path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

module.exports = {
    // mode 
    mode: "production",
    // entry file 
    entry: {
        main: "./src/js/main.js"
    },
    // output file
    output: {
        // path.resole is node js code or path.join
        path: path.resolve(__dirname, "./dist"),
        filename: "js/[name]-[contenthash].js",
        clean: true,
    },
    // plugins
    plugins: [
        // css modules
        new MiniCssExtractPlugin({
            filename: "styles/[name]-[contenthash].css"
        }),
        // pages
        new HtmlWebpackPlugin(
            {
                template: "./src/pages/index.html",
                minify: true,
                filename: "pages/index.html",
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
                type: "asset/resource",
                generator: {
                    filename: 'public/img/[name][ext]',
                },
            },
            // add fonts modules
            {
                test: /\.(woff|woff2|eot|ttf|tof)$/i, // regex
                type: "asset/resource",
                generator: {
                    filename: 'public/fonts/[name][ext]',
                },
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
        minimize: true,
        minimizer: [
            new TerserWebpackPlugin(),
        ],
    },

};
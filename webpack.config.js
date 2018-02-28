/**
 * Created by Administrator on 2017/10/9.
 */
const path = require('path');
var webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');//清理dist目录文件
const HtmlWebpackPlugin = require('html-webpack-plugin'); //html导出
const ExtractTextPlugin = require('extract-text-webpack-plugin');//分离样式表
const extractCSS = new ExtractTextPlugin(process.env.NODE_ENV === 'production' ? 'css/[name]-css.min.css' : 'css/[name]-css.css');//导出css
const extractSass = new ExtractTextPlugin(process.env.NODE_ENV === 'production' ? 'css/[name]-scss.min.css' : 'css/[name]-scss.css')//导出sass
const balili = require('babili-webpack-plugin');//压缩代码
const autoprefixer = require('autoprefixer'); //补全css各种hack
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');//压缩css
module.exports = {
    devtool: 'cheap-source-map',
    /*devServer: {
     historyApiFallback: false,
     inline: true,//注意：不写hot: true，否则浏览器无法自动更新；也不要写colors:true，progress:true等，webpack2.x已不支持这些
     },*/
    entry: {
        'index': ['./src/index.js'],
    },
    output: {
        filename: 'js/[name].[hash].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            //使用babel加载.js文件
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'react','stage-1']
                    }
                },
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015','react','stage-1']
                    }
                }
            },
            //加载css
            {
                test: /\.css$/,
                exclude: /(node_modules|bower_components)/,
                use: extractCSS.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader'],
                    publicPath: '../'
                })
            },
            {
                test: /\.scss/i,
                use: extractSass.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader', 'postcss-loader'],
                    publicPath: "../"
                })
            },
            {
                test: /\.less$/,
                use: extractSass.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'less-loader', 'postcss-loader'],
                    publicPath: '../'
                })
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        'css': ExtractTextPlugin.extract({
                            use: ['css-loader?minimize=true', 'postcss-loader'],
                            fallback: 'vue-style-loader',
                            publicPath: "../"
                        }),
                        // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                        // the "scss" and "sass" values for the lang attribute to the right configs here.
                        // other preprocessors should work out of the box, no loader config like this necessary.
                        scss: ExtractTextPlugin.extract({
                            use: ['css-loader?minimize=true!', 'sass-loader', 'postcss-loader'],
                            fallback: 'vue-style-loader',
                            publicPath: "../"
                        }),
                        'sass': ExtractTextPlugin.extract({
                            use: ['css-loader?minimize=true!', 'sass-loader?indentedSyntax', 'postcss-loader'],
                            fallback: 'vue-style-loader',
                            publicPath: "../"
                        }),
                    }
                    // other vue-loader options go here
                }
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    'url-loader?limit=8192000&hash=sha512&digest=hex&name=img/[hash].[ext]',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            gifsicle: {
                                interlaced: false
                            },
                            optipng: {
                                optimizationLevel: 1
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            },
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            }
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        /*alias: {
         'vue$': 'vue/dist/vue.esm.js'
         },*/
        extensions: ['*', '.js', '.json','.jsx']
    },
    plugins: [
        //全局挂载
        /*new webpack.ProvidePlugin({
         $: 'jquery',
         jQuery: 'jquery',
         'window.jQuery': 'jquery'
         }),*/
        new CleanWebpackPlugin(['dist/js', 'dist/css', 'dist/img']),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            inject: 'body',
            chunks: ['index'],
            hash: true
        }),
        extractCSS,
        extractSass,
        (process.env.NODE_ENV === 'production') ? new balili() : function () {
        },//区分生产环境与开发环境，压缩js
        (process.env.NODE_ENV === 'production') ? new OptimizeCssAssetsPlugin() : function () {
        }//区分生产环境与开发环境,压缩css
        //new webpack.HotModuleReplacementPlugin()

    ]
}
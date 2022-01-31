const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = (env, argv) => {
    const isProd = argv.mode === 'production'
    const isDev = !isProd

    console.log(`Run build in ${isProd ? 'production' : 'development'} mode!`)

    const filename = (ext) => {
        return isProd ? `[name].[hash].bundle.${ext}` : `[name].bundle.${ext}`
    }

    const plugins = () => {
        return [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({ template: './index.html' }),
            new CopyPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, 'src', 'icon.ico'),
                        to: path.resolve(__dirname, 'dist')
                    }
                ]
            }),
            new MiniCssExtractPlugin({ filename: filename('css') }),
            new ESLintPlugin({ extensions: ['ts'] })
        ]
    }

    const optimize = () => {
        const config = {
            splitChunks: {
                chunks: 'all'
            },
            minimize: true
        }
        if (isProd) {
            config.minimizer = [new CssMinimizerPlugin(), new TerserPlugin()]
        }

        return config
    }

    return {
        target: 'web',
        context: path.resolve(__dirname, 'src'),
        entry: {
            main: ['@babel/polyfill', './index.ts']
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: filename('js'),
            publicPath: ''
        },
        devtool: isDev ? 'source-map' : false,
        devServer: {
            port: 4200,
            open: true,
            watchContentBase: true
        },
        optimization: optimize(),
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@core': path.resolve(__dirname, 'src/core'),
                '@components': path.resolve(__dirname, 'src/components/'),
                '@media': path.resolve(__dirname, 'src/assets'),
                '@styles': path.resolve(__dirname, 'src/scss'),
                '@redux': path.resolve(__dirname, 'src/redux'),
                '@fonts': path.resolve(__dirname, 'src/assets/fonts')
            }
        },
        plugins: plugins(),
        module: {
            rules: [
                {
                    test: /\.s[ac]ss$/i,
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
                },
                {
                    test: /\.(js)|(ts)x?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env', '@babel/preset-typescript'],
                                plugins: ['@babel/proposal-class-properties']
                            }
                        },
                        'ts-loader'
                    ]
                },
                {
                    test: /\.(woff2?|ttf|eot)$/i,
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]'
                    }
                },
                {
                    test: /\.(png|jpe?g|gif|jp2|webp)$/,
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]'
                    }
                }
            ]
        }
    }
}

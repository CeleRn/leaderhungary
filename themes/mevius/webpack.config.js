'use strict';

// Зависимости
const webpack = require("webpack");
const path = require('path');
const _ = require('lodash');

const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


// Настройка для SVGO-loader
let svgoConfig = JSON.stringify({
  plugins: [{
    removeTitle: true
  }, {
    removeUselessStrokeAndFill: true
  }, {
    removeAttrs: {
      attrs: '(stroke|fill)'
    },
  }, {
    convertColors: {
      shorthex: false
    }
  }, {
    convertPathData: true
  }]
});

module.exports = {
    context: path.join(__dirname, "src"),
  
    entry: {
      commons: './index.js'
    },
    output: {
      path: path.join(__dirname, "source", "assets"),
      publicPath: '/',
      filename: 'js/[name].js'
    },
    resolve: {
      modules: ['node_modules'],
      extensions: ['.js', ".json", ".scss"]
    },
    resolveLoader: {
        modules: ["node_modules"],
        extensions: [".js", ".json"],
        mainFields: ["loader", "main"],
        moduleExtensions: ['-loader']
    },
    target: 'web',
    module: {
      rules: [
        // rules for modules (configure loaders, parser options, etc.)
        { // Javascript
          test: /\.js$/,
          include: [
            path.join(__dirname, "assets"),
            path.join(__dirname, "node_modules", "svg-sprite-loader", "lib", "plugin.js")
          ],
          exclude: /\/node_modules\//,
          loader: 'babel',
          query: {
            cacheDirectory: true, // включить кэширование
            presets: 'es2015'
          }
        }, 
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: process.env.NODE_ENV === 'development',
              },
            },
            'css-loader',
            // 'postcss-loader',
            'sass-loader',
          ],
        },
        // {
        //     test: /\.css$/,
        //     use: [
        //       {
        //         loader: MiniCssExtractPlugin.loader,
        //         options: {
        //           // you can specify a publicPath here
        //           // by default it uses publicPath in webpackOptions.output
        //           publicPath: '../',
        //           hmr: process.env.NODE_ENV === 'development',
        //         },
        //       },
        //       'css-loader',
        //     ]
        // },
        { // Картинки 
          test: /\.pdf$/,
          use: 'file?name=assets/pdf/[name].[ext]'
        },
        { // Картинки 
          test: /\.(png|jpg|svg|gif)$/,
          exclude: path.join(__dirname, "assets", "icons"),
          use: 'file?name=images/[name].[ext]'
        }, { // Копируем шрифты
          test: /\.(ttf|eot|woff|woff2)$/,
          use: 'file?name=fonts/[path][name].[ext]'
        }, {
          test: /\.svg$/,
          include: path.join(__dirname, "assets", "icons"),
          use: [
            {
              loader: 'svg-sprite-loader',
              options: {
                extract: true,
                spriteFilename: 'icons/icons-sprite.svg'
              }
            }, {
              loader: 'svgo-loader?' // + svgoConfig
            }
          ]
        }, {
          test: /\.ejs$/,
          use: [
              {
                loader: "ejs-webpack-loader",
                options: {
                  data: {title: "New Title", someVar:"hello world"},
                  htmlmin: false
                }
              }
          ]
      }, {
        test: /\.svg$/,
        include: path.join(__dirname, "src", "icons"),
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              spriteFilename: 'icons/icons-sprite.svg'
            }

          }, {
            loader: 'svgo-loader?' + svgoConfig
          }
        ]
      },
      ],
      noParse: /jquery\/dist\/jquery.js/
    },
    plugins: [
      // new webpack.NoEmitOnErrorsPlugin(),
    //   new extractCSS({
    //     filename: 'assets/css/[name].css',
    //     allChunks: true
    //   }),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // all options are optional
        filename: 'css/[name].css',
        ignoreOrder: false, // Enable to remove warnings about conflicting order
      }),
      new webpack.ProvidePlugin({
        _: "lodash",
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        Popper: ['popper.js', 'default'],
        // In case you imported plugins individually, you must also require them here:
        Util: "exports-loader?Util!bootstrap/js/dist/util",
        Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
        Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
        Button: "exports-loader?Button!bootstrap/js/dist/button",
        Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
        Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
        Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
        Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
        Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
        Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
        Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip"
      }),
    //   new SpriteLoaderPlugin(),
      new SpriteLoaderPlugin(),
      new webpack.HotModuleReplacementPlugin({
        // Options...
      })
    ],
    // devServer: {
    //   host: '0.0.0.0',
    //   // allowedHosts: [
    //   //   'http://code.udelta.ru',
    //   //   '62.109.26.95'
    //   // ],
    //   // contentBase: __dirname + "/public/",
    //   contentBase: path.join(__dirname, "public"),
    //   // compress: true,
    //   port: 9000
    // }
  };
  
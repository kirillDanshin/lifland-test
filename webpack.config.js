/* eslint-disable import/no-extraneous-dependencies */
const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const RemoveWebpackPlugin = require('remove-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const functions = require('postcss-functions');
const precss = require('precss');
const atImport = require('postcss-import');
const easyImport = require('postcss-easy-import');
const postCssModules = require('postcss-modules');

const postCssLoader = [
	'css-loader?modules',
	'&importLoaders=1',
	'&localIdentName=[name]__[local]___[hash:base64:5]',
	'&disableStructuralMinification',
	'!postcss-loader',
];

module.exports = {
	devtool: 'source-map',
	entry: {
		index: './frontend/src/index.jsx',
	},
	output: {
		path: './frontend/dist',
		filename: '/static/js/[name].js',
	},
	plugins: [
		new RemoveWebpackPlugin('./frontend/dist', 'hide'),
		new webpack.NoErrorsPlugin(),
		new HtmlWebpackPlugin({
			template: './frontend/src/index.html',
			inject: false,
		}),
		new webpack.optimize.DedupePlugin(),
		new ExtractTextPlugin('static/css/styles.css', {}),
	],
	resolve: {
		moduleDirectories: ['node_modules'],
		extensions: ['', '.js', '.jsx'],
	},
	module: {
		loaders: [
			{
				test: /\.json$/,
				loader: 'json-loader',
			}, {
				test: /\.(js|jsx)$/,
				loaders: ['babel'],
				exclude: /node_modules/,
				include: __dirname,
			}, {
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style-loader', postCssLoader.join('')),
			}, {
				test: /\.png$/,
				loader: 'file-loader?name=/static/images/[hash].[ext]',
			}, {
				test: /\.jpg$/,
				loader: 'file-loader?name=/static/images/[hash].[ext]',
			}, {
				test: /\.gif$/,
				loader: 'file-loader?name=/static/images/[hash].[ext]',
			}, {
				test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
				loader: 'file-loader?name=/static/fonts/[hash].[ext]',
			}, {
				test: /\.(mp4|webm|ogv)(\?[a-z0-9]+)?$/,
				loader: 'file-loader?name=/static/video/[hash].[ext]',
			},
		],
	},
	postcss() {
		return [
			atImport({
				plugins: [easyImport],
			}),
			require('postcss-assets')({
				loadPaths: ['**'],
			}),
			require('postcss-mq-keyframes'),
			require('postcss-flexbugs-fixes'),
			postCssModules({
				scopeBehaviour: 'global',
				generateScopedName: '[name]__[local]___[hash:base64:5]',
			}),
			autoprefixer,
			precss(),
			require('postcss-mixins')({
				mixins: require('./frontend/src/styles/mixins'),
			}),
			require('postcss-simple-vars')({
				variables: require('./frontend/src/styles/vars'),
			}),
			functions(),
		];
	},
};

if (NODE_ENV === 'production') {
	postCssLoader.splice(1, 1); // drop human readable names

	module.exports.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				drop_console: true,
				unsafe: true,
			},
		})
	);

	delete module.exports.devtool;
}

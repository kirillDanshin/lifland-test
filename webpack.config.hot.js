/* eslint-disable import/no-extraneous-dependencies */
const PORT = process.env.PORT || '8080';
console.log('Listening on', PORT);
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const functions = require('postcss-functions');
const precss = require('precss');
const atImport = require('postcss-import');
const easyImport = require('postcss-easy-import');
const postCssModules = require('postcss-modules');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const postCssLoader = [
	'css-loader?modules',
	'&importLoaders=1',
	'&localIdentName=[name]__[local]___[hash:base64:5]',
	'&disableStructuralMinification',
	'!postcss-loader',
];

module.exports = {
	devtool: 'source-map',
	entry: [
		'react-hot-loader/patch',
		`webpack-dev-server/client?http://localhost:${PORT}`,
		'webpack/hot/only-dev-server',
		'./frontend/src/index.jsx',
	],
	output: {
		path: './frontend/dist',
		filename: 'js/[name].js',
	},
	plugins: [
		new webpack.NoErrorsPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			template: './frontend/src/index.hot.html',
		}),
		new webpack.optimize.DedupePlugin(),
	],
	resolve: {
		moduleDirectories: ['node_modules'],
		extensions: ['', '.js', '.jsx'],
	},
	module: {
		loaders: [
			{
				test: /\.(js|jsx)$/,
				loaders: ['react-hot-loader/webpack', 'babel'],
				exclude: /node_modules/,
				include: __dirname,
			}, {
				test: /\.css$/,
				loaders: ['style-loader', postCssLoader.join('')],
			}, {
				test: /\.png$/,
				loader: 'file-loader?name=images/[hash].[ext]',
			}, {
				test: /\.jpg$/,
				loader: 'file-loader?name=images/[hash].[ext]',
			}, {
				test: /\.gif$/,
				loader: 'file-loader?name=images/[hash].[ext]',
			}, {
				test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
				loader: 'file-loader?name=fonts/[hash].[ext]',
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
	devServer: {
		contentBase: './frontend/dist',
		hot: true,
		host: 'localhost',
		port: PORT,
	},
};

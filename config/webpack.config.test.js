const webpack = require('webpack');
const path = require('path');

module.exports = {
	resolve: {
		extensions: ['.ts', '.js']
	},
	entry: path.resolve(__dirname, '../test/index.ts'),
	/**
	 * Inline source maps, generated by TypeScript compiler, will be used.
	 */
	devtool: 'inline-source-map',
	module: {
		/**
		 * Note: Ignored files should not have calls to import, require, define or any other importing mechanism.
		 *
		 * PhantomJS could stall if an older lodash version is imported (which does requires). This could happen
		 * when a outdated node package is used. In case of failing test remove the conflicting library from noParse
		 * key.
 		 */
		noParse: function(content) {
			return /lodash/.test(content);
		},
		rules: [
			/**
			 * Unlike ts-loader, awesome-typescript-loader doesn't allow to override TS compiler options
			 * in query params. We use separate `tsconfig.test.json` file, which only differs in one thing:
			 * inline source maps. They are used for code coverage report.
			 *
			 * See project repository for details / configuration reference:
			 * https://github.com/s-panferov/awesome-typescript-loader
			 */
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: {
					loader: 'awesome-typescript-loader',
					options: {
						configFileName: path.resolve(__dirname, '../config/tsconfig.webpack.json'),
					}
				},
			},
			/**
			 * Instruments TS source files for subsequent code coverage.
			 * See https://github.com/deepsweet/istanbul-instrumenter-loader
			 */
			{
				test: /\.ts$/,
				use: 'istanbul-instrumenter-loader',
				exclude: [
					/node_modules/,
					/test/,
					/Spec\.ts$/
				],
				enforce: 'post',
			}
		]
	},
	stats: {
		colors: true
	}
};

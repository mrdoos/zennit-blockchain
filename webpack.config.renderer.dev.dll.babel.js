/**
 * Builds the DLL for development electron renderer process
 */
import { CheckNodeEnv } from '../internals/scripts/CheckNodeEnv';
import { dependencies } from '../package.json';
import baseConfig, { defaultNodePolyfillsForRenderer } from './webpack.config.base';
import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';

CheckNodeEnv('development');

const dist = path.join(__dirname, '..', 'dll');

// eslint-disable-next-line import/no-default-export
export default merge(baseConfig, {
  context: path.join(__dirname, '..'),

  devtool: 'eval',

  mode: 'development',

  target: 'web',

  externals: ['fsevents', 'crypto-browserify'],

  /**
   * Use `module` from `webpack.config.renderer.dev.js`
   */
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  module: require('./webpack.config.renderer.dev.babel').default.module,

  entry: {
    renderer: Object.keys(dependencies || {}),
  },

  output: {
    library: 'renderer',
    path: dist,
    filename: '[name].dev.dll.js',
    libraryTarget: 'var',
  },

  resolve: {
    fallback: defaultNodePolyfillsForRenderer,
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join(dist, '[name].json'),
      name: '[name]',
    }),

    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        context: path.join(__dirname, '..', 'app'),
        output: {
          path: path.join(__dirname, '..', 'dll'),
        },
      },
    }),
  ],
});

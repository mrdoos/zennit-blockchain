/**
 * Build config for electron renderer process
 */
import { CheckNodeEnv } from '../internals/scripts/CheckNodeEnv';
import DeleteSourceMaps from '../internals/scripts/DeleteSourceMaps';
import baseConfig, { defaultNodePolyfillsForRenderer } from './webpack.config.base';
import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { merge } from 'webpack-merge';

CheckNodeEnv('production');
DeleteSourceMaps();

const devtoolsConfig =
  process.env.DEBUG_PROD === 'true'
    ? {
        devtool: 'source-map',
      }
    : {};

// eslint-disable-next-line import/no-default-export
export default merge(baseConfig, {
  ...devtoolsConfig,

  mode: 'production',

  target: 'web',

  entry: [
    'core-js',
    'regenerator-runtime/runtime',
    path.join(__dirname, '..', 'app/polyfill.ts'),
    path.join(__dirname, '..', 'app/index.tsx'),
  ],

  output: {
    path: path.join(__dirname, '..', 'app/dist'),
    publicPath: './dist/',
    filename: 'renderer.prod.js',
  },

  resolve: {
    alias: {
      'bn.js': path.join('./node_modules/bn.js'),
    },
    fallback: defaultNodePolyfillsForRenderer,
  },

  module: {
    rules: [
      // WOFF Font
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
          },
        },
      },
      // WOFF2 Font
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
          },
        },
      },
      // TTF Font
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/octet-stream',
          },
        },
      },
      // EOT Font
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader',
      },
      // Common Image Formats
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/,
        use: 'url-loader',
      },
    ],
  },

  // optimization: {
  //   minimizer: process.env.E2E_BUILD
  //     ? []
  //     : [
  //         new TerserPlugin({
  //           parallel: true,
  //           sourceMap: true,
  //           cache: true,
  //         }),
  //       ],
  // },

  plugins: [
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
      NODE_ENV: 'production',
      DEBUG_PROD: false,
      E2E_BUILD: false,
    }),

    new BundleAnalyzerPlugin({
      analyzerMode: process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
      openAnalyzer: process.env.OPEN_ANALYZER === 'true',
    }),

    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),

    new CopyPlugin({
      patterns: [{ from: 'node_modules/argon2-browser/dist/argon2.wasm', to: '.' }],
      patterns: [{ from: 'app/preload.js', to: '.' }],
    }),
  ],
});

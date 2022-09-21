const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: ['vuex-module-decorators', 'vuex-persist'],
  runtimeCompiler: true,
  configureWebpack: {
    plugins: [
      // new BundleAnalyzerPlugin(),
      new CompressionPlugin()
    ]
  },
  chainWebpack: config => {
    config.optimization.minimizer('terser').tap(args => {
      const { terserOptions } = args[0]
      terserOptions.keep_classnames = true
      terserOptions.keep_fnames = true
      return args;
    })
  } 
})

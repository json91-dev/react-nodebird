const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = withBundleAnalyzer({
  distDir: '.next',
  webpack(config) {
    const prod = process.env.NODE_ENV === 'production';

    const plugins = [
      ...config.plugins,
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/),
    ];

    if (prod) {
      plugins.push(new CompressionPlugin()); // main.js => main.js.gz)
    }

    // console.log('config', config); // 기본적인 next의 config 출력
    // console.log('rules', config.module.rules[0]);
    return {
      ...config,
      mode: prod ? 'production' : 'development',
      devtool: prod ? 'hidden-source-map' : 'eval', // production일때 sourcemap 제공
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          {
            loader: 'webpack-ant-icon-loader',
            enforce: 'pre',
            include: [
              require.resolve('@ant-design/icons/lib/dist'),
            ],
          },
        ],
      },
      plugins,
    };
  },
});

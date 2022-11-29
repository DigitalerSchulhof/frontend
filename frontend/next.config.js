const path = require('path');
const { yieldModules, readJsonSync } = require('./custom/utils');

const {
  PathsPlugin: DshPathsPlugin,
} = require('./custom/webpack/plugins/paths');

const withTM = require('next-transpile-modules')(
  [...yieldModules()]
    .map((m) => readJsonSync(`${m}/package.json`))
    .filter((m) => m.dsh)
    .map((m) => m.name)
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.tsx?$/,
      use: {
        loader: require.resolve('./custom/webpack/loaders/shell'),
      },
    });

    const pathsPluginIndex = config.resolve.plugins.findIndex(
      (p) => p.constructor.name === 'JsConfigPathsPlugin'
    );
    if (pathsPluginIndex === -1) {
      config.resolve.plugins.push(new DshPathsPlugin());
    } else {
      config.resolve.plugins[pathsPluginIndex] = new DshPathsPlugin();
    }

    // Since symlinked modules are resolved in their actual directory, they need access to this node_modules (where they're installed) to resolve modules injected by the shellLoader
    config.resolve.modules.push(path.resolve(__dirname, 'node_modules'));

    return config;
  },
};

module.exports = withTM(nextConfig);

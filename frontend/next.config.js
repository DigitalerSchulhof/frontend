const path = require('path');
const { findNearestPackageJson, readJsonSync } = require('./.custom/utils');

const {
  PathsPlugin: DshPathsPlugin,
} = require('./.custom/webpack/plugins/paths');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, options) => {
    config.module.rules.push({
      use: [
        require.resolve('./.custom/webpack/loaders/shell'),
        require.resolve('./.custom/webpack/loaders/i18n'),
      ],
      enforce: 'pre',
      include: (p) => {
        if (!p.endsWith('.ts') && !p.endsWith('.tsx')) return false;
        const pkg = readJsonSync(findNearestPackageJson(p));
        return 'dsh' in pkg;
      },
      type: 'javascript/auto',
    });

    config.module.rules.push({
      use: options.defaultLoaders.babel,
      include: (p) => {
        if (!p.endsWith('.ts') && !p.endsWith('.tsx')) return false;
        const pkg = readJsonSync(findNearestPackageJson(p));
        return 'dsh' in pkg;
      },
      type: 'javascript/auto',
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

module.exports = nextConfig;

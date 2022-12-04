const path = require('path');
const { findNearestPackageJson, readJsonSync } = require('./.custom/utils');

const {
  PathsPlugin: DshPathsPlugin,
} = require('./.custom/webpack/plugins/paths');

// Do this import so that the IDE debugger is able to attach to loaders too
require('./.custom/webpack/loaders');

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, options) => {
    config.module.rules.push({
      use: {
        loader: require.resolve('./.custom/webpack/loaders'),
        options: {
          isDev: options.dev,
        },
      },
      enforce: 'pre',
      /**
       * @param {string} p
       */
      include: (p) => {
        if (!p.endsWith('.ts') && !p.endsWith('.tsx')) return false;
        const pkg = readJsonSync(findNearestPackageJson(p));
        return 'dsh' in pkg;
      },
      type: 'javascript/auto',
    });

    config.module.rules.push({
      use: options.defaultLoaders.babel,
      /**
       * @param {string} p
       */
      include: (p) => {
        if (!p.endsWith('.ts') && !p.endsWith('.tsx')) return false;
        const pkg = readJsonSync(findNearestPackageJson(p));
        return 'dsh' in pkg;
      },
      type: 'javascript/auto',
    });

    const pathsPluginIndex = config.resolve.plugins.findIndex(
      /**
       * @param {import("webpack").ResolvePluginInstance} p
       */
      (p) => p.jsConfigPlugin
    );
    if (pathsPluginIndex === -1) {
      config.resolve.plugins.push(new DshPathsPlugin());
    } else {
      config.resolve.plugins[pathsPluginIndex] = new DshPathsPlugin();
    }

    // Since symlinked modules are resolved in their actual directory, they need access to this node_modules (where they're installed) to resolve modules injected by the shellLoader
    config.resolve.modules.push(path.join(options.dir, 'node_modules'));

    return config;
  },
};

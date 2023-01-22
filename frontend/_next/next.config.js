// Do this import so that the IDE debugger is able to attach to loaders too
require('./.custom/loaders');

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  webpack: (config, options) => {
    /**
     * @type {import('webpack').RuleSetRule}
     */
    const loader = {
      use: {
        loader: require.resolve('./.custom/loaders'),
        /**
         * @type {import('./custom/loaders').Options}
         */
        options: {
          isDev: options.dev,
        },
      },
      enforce: 'pre',
      include: (p) => {
        return p.endsWith('.ts') || p.endsWith('.tsx');
      },
      type: 'javascript/auto',
    };

    config.module.rules.push({
      use: options.defaultLoaders.babel,
      /**
       * @param {string} p
       */
      include: (p) => {
        return p.endsWith('.ts') || p.endsWith('.tsx');
      },
      type: 'javascript/auto',
    });

    config.resolve.alias['@formatjs/icu-messageformat-parser'] =
      '@formatjs/icu-messageformat-parser/no-parser';
    config.module.rules.push(loader);
    return config;
  },
};

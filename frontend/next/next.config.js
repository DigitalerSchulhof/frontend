/**
 * @satisfies {import('next').NextConfig}
 */
module.exports = {
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    /**
     * @satisfies {import('webpack').RuleSetRule}
     */
    // const loader = {
    //   loader: './loader',
    //   type: 'javascript/auto',
    //   include: (p) => p.includes('app'),
    // };

    // config.module.rules.push(loader);

    return config;
  },
};

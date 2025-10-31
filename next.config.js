/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.scales-chords.com',
      },
    ],
  },
  // Turbopack configuration for Next.js 16
  turbopack: {},
  // Webpack configuration (only used when --webpack flag is passed)
  webpack: (config, { isServer }) => {
    // Add ignore patterns for file watching
    if (config.watchOptions) {
      config.watchOptions.ignored = [
        ...(config.watchOptions.ignored || []),
        '**/app/api/songs/**',
        '**/app/songs/**',
      ];
    } else {
      config.watchOptions = {
        ignored: [
          '**/node_modules/**',
          '**/app/api/songs/**',
          '**/app/songs/**',
        ],
      };
    }
    return config;
  },
}

module.exports = nextConfig


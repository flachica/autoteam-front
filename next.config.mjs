/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    TRUSTED_HOSTS: process.env.TRUSTED_HOSTS,
  },
  i18n: {
    locales: ['es-ES'],
    defaultLocale: 'es-ES',
  },
  images: {
    disableStaticImages: false,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-Forwarded-Host',
            value: '$host',
          },
          {
            key: 'X-Forwarded-Proto',
            value: '$scheme',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

export default withNextIntl({
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '/storage/**',
            },
            {
                protocol: 'https',
                hostname: 'Api.aydaivf.com',
                pathname: '/uploads/**',
            },
            {
                protocol: 'https',
                hostname: '**.aydaivf.com',
            },
        ],
        domains: ['localhost', 'Api.aydaivf.com'],
    },
});
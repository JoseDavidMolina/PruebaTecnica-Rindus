/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  images: {
    domains: ['openweathermap.org'],
    unoptimized: true,
  },
};

module.exports = nextConfig

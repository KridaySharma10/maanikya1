/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'example.com',
      'images.unsplash.com',
      'cdn.shopify.com',
      'res.cloudinary.com',
      'imgur.com',
      'i.imgur.com',
      'picsum.photos',
      'firebasestorage.googleapis.com',
      'placeholder.com',
      'gstatic.com',
      'www.gstatic.com',
      'lh3.googleusercontent.com',
      'storage.googleapis.com',
      'watchbox-cdn.imgix.net',
      'cdn.chrono24.com',
      'hodinkee.imgix.net',
      'static.patek.com',
      'content.rolex.com',
      'www.omegawatches.com',
    ],
  },
  serverExternalPackages: ['firebase'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig


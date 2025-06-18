/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal config for Clerk compatibility
  experimental: {
    serverComponentsExternalPackages: ['@clerk/nextjs']
  }
};

export default nextConfig;
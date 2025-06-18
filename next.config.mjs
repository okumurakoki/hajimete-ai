/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal config for Clerk compatibility
  serverExternalPackages: ['@clerk/nextjs']
};

export default nextConfig;
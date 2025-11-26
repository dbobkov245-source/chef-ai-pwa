/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  // Ensure environment variables are available
  env: {
    // Note: GOOGLE_API_KEY is automatically available on server-side
    // Do NOT add it here publicly if you want to keep it strict, 
    // but Next.js handles process.env.GOOGLE_API_KEY fine in API routes.
  }
};

export default nextConfig;
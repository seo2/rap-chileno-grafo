import type { NextConfig } from 'next';
import { join } from 'node:path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: join(process.cwd()),
};

export default nextConfig;

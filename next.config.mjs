import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;

// Lets `next dev` access Cloudflare bindings (no-op for this app today).
initOpenNextCloudflareForDev();

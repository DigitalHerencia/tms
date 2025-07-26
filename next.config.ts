/** @type {import('next').NextConfig} */
const nextConfig: import( 'next' ).NextConfig = {
  // React 19 strict‑mode everywhere
  reactStrictMode: true,

  /* ───── Development ergonomics ───── */
  // Let the File‑System Access API (and other cross‑origin tools) hit your
  // dev server without CORS errors.
  allowedDevOrigins: ['http://localhost:3000', 'chrome-extension://*'], // tweak as needed :contentReference[oaicite:0]{index=0}

  /* ───── RSC / Route‑handler bundling ───── */
  // NEW in v15 → top‑level, renamed from `serverComponentsExternalPackages`
  // Opt‑out packages that rely on Node APIs so they’re required() at runtime.
  serverExternalPackages: ['@babel/parser', '@babel/traverse'] ,

  /* ───── Build‑performance toggles ───── */
  experimental: {
    webpackBuildWorker: true,           // spawn a worker for each webpack job (on by default, but keep explicit)
    parallelServerBuildTraces: true,    // needs `webpackBuildWorker: true` :contentReference[oaicite:2]{index=2}
    parallelServerCompiles: true        // ditto
  },

  /* ───── Quality‑gating you’re intentionally relaxing ───── */
  eslint:     { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  /* ───── Images ───── */
  images: { unoptimized: true }
};

export default nextConfig;

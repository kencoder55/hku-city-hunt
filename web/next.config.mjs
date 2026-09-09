/** @type {import('next').NextConfig} */
import path from "node:path";
import { fileURLToPath } from "node:url";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
const dir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  // React Compiler uses a Babel webpack-loader under Turbopack. That path
  // panics during HMR ("Resource path ... need to be on project filesystem").
  reactCompiler: process.env.NODE_ENV === "production",

  compress: true,

  productionBrowserSourceMaps: false,

  turbopack: {
    root: dir,
  },

  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["@mui/material", "@mui/icons-material"],
  },
};

export default withNextIntl(nextConfig);

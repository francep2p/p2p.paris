import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  reactStrictMode: true,
  i18n: {
    locales: ["en", "fr", "catchAll"],
    defaultLocale: "catchAll",
  },
  async redirects() {
    return [
      {
        source: "/catchAll",
        destination: "/fr",
        locale: false,
        permanent: false,
      },
      {
        source: "/catchAll/(!api/):slug*",
        destination: "/fr/:slug*",
        locale: false,
        permanent: false,
      },
      {
        source: `/festival`,
        destination: `/fr/events/festival-2`,
        permanent: false,
        basePath: false,
      },
      {
        source: "/:locale*/event/:slug*",
        destination: "/:locale*/events/:slug*",
        permanent: true,
      },
      {
        source: `/hackathon`,
        destination: `/fr/events/hackathon-2`,
        permanent: false,
        basePath: false,

      }
    ];
  },
  trailingSlash: true,
};

export default nextConfig;

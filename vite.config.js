import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import commonjs from "vite-plugin-commonjs"; // Add this line

// Related: https://github.com/remix-run/remix/issues/2835#issuecomment-1144102176
// Replace the HOST env var with SHOPIFY_APP_URL so that it doesn't break the remix server. The CLI will eventually
// stop passing in HOST, so we can remove this workaround after the next major release.
if (
  process.env.HOST &&
  (!process.env.SHOPIFY_APP_URL ||
    process.env.SHOPIFY_APP_URL === process.env.HOST)
) {
  process.env.SHOPIFY_APP_URL = process.env.HOST;
  delete process.env.HOST;
}

const host = new URL(process.env.SHOPIFY_APP_URL || "http://localhost")
  .hostname;
let hmrConfig;

if (host === "localhost") {
  hmrConfig = {
    protocol: "ws",
    host: "localhost",
    port: 64999,
    clientPort: 64999,
  };
} else {
  hmrConfig = {
    protocol: "wss",
    host: host,
    port: parseInt(process.env.FRONTEND_PORT) || 8002,
    clientPort: 443,
  };
}

export default defineConfig({
  ssr: {
    noExternal: [
      "/remix-utils/",
      "@shopify/polaris-viz",
      "@juggle/resize-observer",
      "@react-spring/animated",
      "@react-spring/core",
      "@react-spring/shared",
      "@react-spring/types",
      "@react-spring/web",
      "@shopify/polaris-viz",
      "@shopify/polaris-viz-core",
      "d3-array",
      "d3-color",
      "d3-format",
      "d3-interpolate",
      "d3-path",
      "d3-scale",
      "d3-shape",
      "d3-time",
      "d3-time-format",
      "internmap",
      "use-debounce",
    ],
  },
  server: {
    port: Number(process.env.PORT || 3000),
    hmr: hmrConfig,
    fs: {
      // See https://vitejs.dev/config/server-options.html#server-fs-allow for more information
      allow: ["app", "node_modules"],
    },
  },
  plugins: [
    remix({
      ignoredRouteFiles: ["**/.*"],
    }),
    tsconfigPaths(),
    commonjs({
      include: ["@shopify/polaris"], // Explicitly include @shopify/polaris
    }), // Add this line
  ],
  build: {
    assetsInlineLimit: 0,
  },
});
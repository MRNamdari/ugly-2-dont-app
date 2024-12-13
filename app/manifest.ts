import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ugly2Don't",
    short_name: "Ugly2Dont",
    description:
      "A simple, straightforward app that steps on your nerves so you get things done.",
    theme_color: "#2e4c51",
    background_color: "#ffffff",
    display: "standalone",
    start_url: "/pwa",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    orientation: "portrait",
  };
}

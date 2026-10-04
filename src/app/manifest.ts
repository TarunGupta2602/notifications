import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lark",
    short_name: "Lark",
    description: "Neighbourhood grocery on Maple Lane.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3ecdf",
    theme_color: "#9c3b28",
    icons: [
      {
        src: "/badge",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}

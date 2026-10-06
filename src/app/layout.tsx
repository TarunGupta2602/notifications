import type { Metadata, Viewport } from "next";
import { Noto_Sans_Devanagari } from "next/font/google";
import { LiveToasts } from "@/components/LiveToasts";
import "./globals.css";
import "./parvah-home.css";

const sans = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lark",
  description: "Neighbourhood grocery on Maple Lane.",
  applicationName: "Lark",
};

export const viewport: Viewport = {
  themeColor: "#f7f4ee",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} h-full`}>
      <body className={`${sans.className} min-h-full antialiased`}>
        <LiveToasts />
        {children}
      </body>
    </html>
  );
}

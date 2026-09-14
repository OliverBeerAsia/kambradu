import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { withBasePath } from "@/lib/base-path";
import "./globals.css";

/**
 * The two faces ship with the site. next/font serves them from the build,
 * preloads them, and keeps them correct under a base path; the CSS reaches
 * them through the variables set on <html>.
 */
const inter = localFont({
  src: "../../public/fonts/inter-variable-latin.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap"
});

const montserrat = localFont({
  src: "../../public/fonts/montserrat-900-latin.woff2",
  variable: "--font-montserrat",
  weight: "900",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: "Kambradu",
    template: "%s | Kambradu"
  },
  description: "Learn something useful. Connect it to a person, place or memory. Keep what matters.",
  icons: {
    icon: withBasePath("/icon.svg"),
    apple: withBasePath("/apple-touch-icon.png")
  },
  other: {
    "kambradu-release": process.env.KAMBRADU_RELEASE_SHA ?? "development",
    "kambradu-built-at": process.env.KAMBRADU_BUILD_DATE ?? "development",
    "kambradu-environment": process.env.KAMBRADU_RELEASE_ENV ?? "local"
  }
};

export const viewport: Viewport = {
  themeColor: "#FFF9F2",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body>{children}</body>
    </html>
  );
}

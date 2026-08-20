import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Kambradu",
    template: "%s | Kambradu"
  },
  description: "Learn something useful. Connect it to a person, place or memory. Keep what matters.",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png"
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
    <html lang="en">
      <head>
        <link
          as="font"
          crossOrigin=""
          href="/fonts/inter-variable-latin.woff2"
          rel="preload"
          type="font/woff2"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

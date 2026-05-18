import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Kambradu",
    template: "%s | Kambradu"
  },
  description: "Kristang-first language preservation, learning, contribution, and steward review.",
  icons: {
    icon: "/hegel.png",
    apple: "/hegel.png"
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Kambradu",
    statusBarStyle: "default"
  }
};

export const viewport: Viewport = {
  themeColor: "#171717",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

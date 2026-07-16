import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Kambradu",
    template: "%s | Kambradu"
  },
  description: "An independent prototype for learning Kristang and keeping personal language memories.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg"
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Kambradu",
    statusBarStyle: "default"
  }
};

export const viewport: Viewport = {
  themeColor: "#1E1B18",
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

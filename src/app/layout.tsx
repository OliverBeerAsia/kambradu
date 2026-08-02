import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Kambradu",
    template: "%s | Kambradu"
  },
  description: "Learn a Kristang word. Connect it to your life. Keep what matters.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg"
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
      <body>{children}</body>
    </html>
  );
}

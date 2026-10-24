import type { Metadata, Viewport } from "next";
import { StoreProvider } from "@/lib/store";
import { Toast } from "@/components/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Courtly",
  description: "東京で、品よくテニスを。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FAF9F6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&display=swap"
        />
      </head>
      <body className="font-sans antialiased">
        <StoreProvider>
          <div className="relative mx-auto min-h-dvh max-w-md bg-cream">{children}</div>
          <Toast />
        </StoreProvider>
      </body>
    </html>
  );
}

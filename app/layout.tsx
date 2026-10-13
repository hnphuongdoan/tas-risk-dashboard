import type { Metadata } from "next/metadata";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tasmanian Bridge Risk Dashboard",
  description: "Infrastructure risk analytics dashboard analyzing Tasmanian load-limited bridges.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Tasmanian Bridge Risk Dashboard</title>
        <meta name="description" content="Infrastructure risk analytics dashboard analyzing Tasmanian load-limited bridges." />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
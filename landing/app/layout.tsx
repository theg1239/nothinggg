import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MCPverse",
  description: "Your website description",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head></head>
      <body className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 min-h-screen">
        {children}
      </body>
    </html>
  );
}

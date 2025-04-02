import type { Metadata } from "next";
import { MouseGradient } from "@/components/mouse-gradient";
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
      <body>
        {children}
        <MouseGradient />
      </body>
    </html>
  );
}

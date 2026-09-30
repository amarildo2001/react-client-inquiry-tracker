import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Client Inquiry Tracker · Amarildo Prendi",
  description: "A React dashboard with a REST API for managing client inquiries.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
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

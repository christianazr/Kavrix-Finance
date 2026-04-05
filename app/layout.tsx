import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kavrix Finance",
  description: "Premium finance app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

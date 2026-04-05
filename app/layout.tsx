import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kavrix Finance",
  description: "Premium monthly budgeting app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0f] text-white antialiased">{children}</body>
    </html>
  );
}


import type { Metadata } from "next";
import Navbar from "../components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alumini | Your Alumni Community",
  description:
    "Reconnect with alumni, discover career journeys, and build meaningful professional connections.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import "./globals.css";

const geistSans = Raleway({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stinq",
  description: "Choice Your Best",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased`}>
        <SessionProvider session={session}>

          <Navbar />
          <main className="bg-white-100 min-h-screen">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Pacifico, Caveat, Inter } from "next/font/google";
import "./globals.css";

const pacifico = Pacifico({
  variable: "--font-pacifico",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Will You Be My Valentine? 💖",
  description: "A very special, romantic Valentine's proposal made just for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${pacifico.variable} ${caveat.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="font-sans min-h-full flex flex-col bg-[#fff5f6] text-[#2c1d20]">
        {children}
      </body>
    </html>
  );
}


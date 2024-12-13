import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ugly2Don't",
  description: "your ugly 2 do app",
  icons: "/favicon.svg",
};

const fredoka = Fredoka({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fredoka.className} overflow-x-clip bg-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ugly2Don't",
  description: "your ugly 2 do app",
  icons: "/favicon.svg",
  openGraph: {
    title: "Ugly2Don't",
    description:
      "A simple, straightforward app that steps on your nerves so you get things done.",
    images: { url: "/preview.jpg" },
  },
  other: {
    "theme-color": "#2e4c51",
  },
  authors: { name: "MO⋅RE⋅NAM", url: "https://github.com/MRNamdari/" },
  creator: "Mohammad Reza Namdari",
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

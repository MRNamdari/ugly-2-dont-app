import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ugly2Don't",
  authors: { name: "MO⋅RE⋅NAM", url: "https://github.com/MRNamdari/" },
  applicationName: "Ugly2Don't App",
  creator: "Mohammad Reza Namdari",
  metadataBase: new URL("https://ugly-2-dont-app.pages.dev/"),
  openGraph: {
    title: "Ugly2Don't",
    description:
      "A simple, straightforward app that steps on your nerves so you get things done.",
    images: { url: "/preview.jpg" },
  },
  description: "your ugly 2 do app",
  other: {
    "theme-color": "#2e4c51",
  },
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

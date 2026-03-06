import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { Providers } from "./providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "e-scores — Live Esports Tracker",
  description: "Live esports scores, tournaments, teams and players. Built by Emre Tosman.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        {/* Prevent flash: apply saved theme before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen bg-surface-0 text-text-0 antialiased">
        <Providers>
          <Header />
          <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
          <Footer />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}

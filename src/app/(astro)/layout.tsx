import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, IBM_Plex_Mono } from "next/font/google";
import "./astro-sheet.css";

// Font configurations
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-astro-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-astro-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-astro-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: 'Astro Character Dashboard',
  description: 'Your cosmic identity revealed.',
};

export default function AstroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`astro-scope ${cormorant.variable} ${inter.variable} ${ibmPlexMono.variable}`}
    >
      {/* Background pattern is handled by .astro-scope .bg-pattern in css */}
      <div className="bg-pattern" />
      
      
      {children}
    </div>
  );
}

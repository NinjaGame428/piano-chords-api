import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { LanguageProvider } from "@/contexts/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Piano Chords Database",
  description: "Complete database of piano chords with audio playback",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <Navigation />
          <main>{children}</main>
          <footer className="bg-gray-100 mt-12 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
              <p>Piano Chords Database &copy; {new Date().getFullYear()}</p>
              <p className="text-sm mt-2">
                Data sourced from{' '}
                <a
                  href="https://www.scales-chords.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  scales-chords.com
                </a>
              </p>
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}


"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import YourImages from "@/components/YourImages";
import ImageModal from "@/components/ImageModal";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  return (
    <html lang="en" suppressHydrationWarning className={geistSans.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <QueryClientProvider client={queryClient}>
                <Navbar />
                <ImageModal />

                {children}
                <div className="fixed bottom-0 right-0 p-5">
                  <YourImages />
                </div>
                <Footer />
              </QueryClientProvider>
            </ThemeProvider>
          </SessionProvider>
        </Suspense>
      </body>
    </html>
  );
}

import "@/app/globals.css";

import React from "react";

import { Providers } from "@/components/providers";
import { Adsbar } from "@/components/site-header/ads-bar";
import { Navbar } from "@/components/site-header/navbar";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { fontMono, fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Next.js + TypeScript Starter",
  description: "A starter template for Next.js and TypeScript",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <React.StrictMode>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            fontSans.variable,
            fontMono.variable,
            "min-h-screen scroll-smooth font-sans antialiased"
          )}
        >
          <Providers>
            <div className="flex flex-col">
              <Adsbar />
              <Navbar />
              <main className="container flex-1">{children}</main>
            </div>
          </Providers>

          <TailwindIndicator />
        </body>
      </html>
    </React.StrictMode>
  );
}

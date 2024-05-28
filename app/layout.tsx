import "@/app/globals.css";

import React from "react";

import { Providers } from "@/components/providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Next.js + TypeScript Starter",
  description: "A starter template for Next.js and TypeScript",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          fontSans.variable,
          "min-h-screen scroll-smooth font-sans antialiased"
        )}
      >
        <Providers>{children}</Providers>

        <TailwindIndicator />
      </body>
    </html>
  );
}

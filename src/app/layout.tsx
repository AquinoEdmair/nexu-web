import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { GlobalNotification } from "@/components/layout/GlobalNotification";

const manrope = Manrope({ 
  subsets: ["latin"],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: "NEXU - Inversión en Oro",
  description: "Plataforma fintech de inversión de alto rendimiento.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${manrope.variable} ${manrope.className} min-h-[100dvh] bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed antialiased`}>
        <Providers>
          <GlobalNotification />
          {children}
        </Providers>
      </body>
    </html>
  );
}

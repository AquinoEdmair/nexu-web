import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { GlobalNotification } from "@/components/layout/GlobalNotification";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

const manrope = Manrope({
  subsets: ["latin"],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: "NEXU - Inversión en Oro",
  description: "Plataforma fintech de inversión de alto rendimiento.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body className={`${manrope.variable} ${manrope.className} min-h-[100dvh] bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed antialiased`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>
            <GlobalNotification />
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

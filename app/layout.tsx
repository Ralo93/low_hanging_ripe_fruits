import "./globals.css";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LanguageProvider } from "@/components/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import type { Lang } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Prozessradar",
  description: "Interne Prozessschmerzen sichtbar machen und später gezielt verbessern.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "en" ? "en" : "de" as Lang;

  return (
    <html lang={lang}>
      <body>
        <LanguageProvider initialLang={lang}>
          <div className="lang-toggle-wrapper">
            <LanguageToggle />
          </div>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

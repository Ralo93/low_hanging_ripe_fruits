import "./globals.css";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LanguageProvider } from "@/components/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import type { Lang } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Personality Quick",
  description: "10 questions, 5 dimensions, personalised AI prompt",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value ?? "en") as Lang;

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

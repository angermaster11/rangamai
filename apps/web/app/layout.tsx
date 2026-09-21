import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/ui/JsonLd";
import { getSiteSettings } from "@/lib/content";
import { SITE_NAME, SITE_URL, organizationJsonLd } from "@/lib/seo";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — AI & Software Solutions`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "RANGAMAI builds AI-powered software, intelligent agents, web and mobile applications, and custom digital solutions for businesses.",
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `${SITE_NAME} — AI & Software Solutions`,
    description:
      "AI-powered software, intelligent agents, web and mobile apps, and custom solutions.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — AI & Software Solutions`,
    description:
      "AI-powered software, intelligent agents, web and mobile apps, and custom solutions.",
  },
  robots: { index: true, follow: true },
};

/**
 * Sets the theme attribute before first paint so a stored dark-mode choice
 * doesn't flash light. Mirrors the logic in ThemeToggle; kept tiny + inlined.
 */
const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <JsonLd data={organizationJsonLd(settings)} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

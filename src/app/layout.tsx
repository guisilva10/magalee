import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "./_components/ui/sonner";
import { ThemeProvider } from "./_components/theme/theme-provider";
// import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "Magalee",
  description: "Software de análise nutricional",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

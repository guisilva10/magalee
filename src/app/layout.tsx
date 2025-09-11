import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "./_components/ui/sonner";

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
        {children}
        <Toaster />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";

export const metadata: Metadata = {
  title: "nine delights",
  description: "angelina&apos;s daily implementation of the nine delights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-foreground min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

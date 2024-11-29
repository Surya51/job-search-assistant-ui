import type { Metadata } from "next";
import "./globals.css";
import StickyHeader from "@/components/sticky-header";
import { AuthProvider } from "@/components/auth-context";

export const metadata: Metadata = {
  title: "Interview Assistant",
  description: "Assistant to generate questions based on resume and job description"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <StickyHeader />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

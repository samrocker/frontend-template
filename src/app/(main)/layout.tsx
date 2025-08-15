import type { Metadata } from "next";
import "../../style/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import Applayout from "@/components/core/AppLayout";

export const metadata: Metadata = {
  title: "PostLearn Dashboard",
  description: "PostLearn Dashboard",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <Applayout>
          {children}
          </Applayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-source-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Tasks",
    template: "%s · Tasks",
  },
  description: "A simple task list kept in memory.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sourceSans.variable} font-sans antialiased`}>
        <div className="mx-auto min-h-screen w-full max-w-2xl px-4 py-8">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <div>
              <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                Lume Studio
              </p>
              <Link href="/" className="text-2xl font-bold text-ink">
                Tasks
              </Link>
            </div>
            <Link
              href="/tasks/new"
              className="inline-flex items-center rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
                New task
            </Link>
          </header>
          {/*
            Pages own the tRPC provider. If this layout wrapped them in a
            client component, notFound() could not set a 404 status.
          */}
          {children}
        </div>
      </body>
    </html>
  );
}

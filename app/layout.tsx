import type { Metadata } from "next";
import { Inter, Silkscreen } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const silkscreen = Silkscreen({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-silkscreen",
});

export const metadata: Metadata = {
  title: "Magpie — Evidence intelligence for GEO",
  description:
    "Did the market change, or did the measurement break? Trusted source evidence, quarantine and verified self-healing for B2B GEO intelligence.",
};

function TopBar() {
  return (
    <div className="border-b border-zinc-800 bg-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2">
        <p className="font-dot text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
          MAGPIE // EVIDENCE INTELLIGENCE
        </p>
        <p className="hidden items-center gap-2 font-dot text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 sm:flex">
          <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
          SENSOR ONLINE
        </p>
      </div>
      <div className="scan-line h-px w-full opacity-80" />
    </div>
  );
}

function Nav() {
  const items = [
    { href: "/", label: "STORY" },
    { href: "/business", label: "BUSINESS" },
    { href: "/engineering", label: "ENGINEERING" },
    { href: "/incidents/inc_001", label: "INCIDENT" },
    { href: "/lab/source", label: "SOURCE" },
  ];
  return (
    <nav className="border-b border-zinc-900 bg-black/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">
        <Link href="/" className="font-dot text-sm font-bold tracking-[0.3em] text-zinc-50">
          MAGPIE<span className="text-[#D71921]">.</span>
        </Link>
        <div className="flex flex-wrap items-center gap-5">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-dot text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 transition-colors hover:text-zinc-50"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${silkscreen.variable} bg-black`}>
      <body className="min-h-screen font-sans antialiased">
        <TopBar />
        <Nav />
        {children}
        <footer className="border-t border-zinc-900">
          <div className="mx-auto max-w-6xl px-6 py-4">
            <p className="font-dot text-[10px] uppercase tracking-[0.2em] text-zinc-600">
              MAGPIE · CONTROLLED DEMONSTRATION · BRIGHT DATA COLLECTOR c_mt4m8fix1gze0scg44 ·
              REPLAY OF GENUINE SNAPSHOTS
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

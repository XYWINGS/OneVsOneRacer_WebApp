import "./globals.css";
import Navbar from "./main/components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full w-full bg-gray-900">
        <Navbar />
        <main className="h-[calc(100%-4rem)]">
          {children}
        </main>
      </body>
    </html>
  );
}

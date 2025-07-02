import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">OneVSOneRacer</h1>
      <Link href="/game" className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
        Play Game
      </Link>
    </main>
  );
}

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          OneVSOneRacer
        </Link>
        <div className="flex gap-4">
          <Link href="/main" className="hover:text-blue-400">
            Home
          </Link>
          <Link href="/game" className="hover:text-blue-400">
            Game
          </Link>
        </div>
      </div>
    </nav>
  );
}
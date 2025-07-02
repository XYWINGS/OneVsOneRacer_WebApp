import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-300 transition-all"
        >
          🏁 OneVSOneRacer
        </Link>
        <div className="flex gap-6">
          <Link
            href="/game"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200 text-gray-300 hover:text-white"
          >
            🎮 Game
          </Link>
        </div>
      </div>
    </nav>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          OneVSOneRacer
        </h1>
        <p className="text-xl text-gray-400 mb-8">Challenge your friends in real-time multiplayer racing</p>

        <div className="space-y-4">
          <Link
            href="/game"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 text-lg font-semibold shadow-lg"
          >
            🏁 Start Racing
          </Link>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2 text-blue-400">🚗 Real-time Racing</h3>
              <p className="text-gray-300">Race against friends with smooth real-time multiplayer action</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2 text-purple-400">🎮 Easy Controls</h3>
              <p className="text-gray-300">Use arrow keys or WASD to control your racing car</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2 text-green-400">🏆 Quick Matches</h3>
              <p className="text-gray-300">Create or join rooms instantly with simple room codes</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

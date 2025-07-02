export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">OneVSOneRacer</h1>
      <div className="flex gap-4">
        <button className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
          Create Room
        </button>
        <button className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition">
          Join Room
        </button>
      </div>
    </main>
  );
}
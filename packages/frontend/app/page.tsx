import { CreateCall } from "@/components/CreateCall";
import { Feed } from "@/components/Feed";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Back It (Onchain)
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Put your money where your mouth is.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <CreateCall />
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Live Calls</h2>
            <Feed />
          </div>
        </div>
      </div>
    </main>
  );
}

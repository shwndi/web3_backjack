export default function TestPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Tailwind CSS Test</h1>
      <h2 className="text-2xl font-bold text-green-600 mb-8">This should be styled</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="text-gray-700">If you can see this text styled, Tailwind is working.</p>
      </div>
    </div>
  )
}
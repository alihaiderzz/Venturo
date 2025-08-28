export default function TestHomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Venturo 🚀
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your site is live on Vercel!
        </p>
        <div className="space-y-4">
          <p className="text-lg text-gray-700">
            The homepage is working correctly.
          </p>
          <p className="text-sm text-gray-500">
            This is a test page to verify routing.
          </p>
        </div>
      </div>
    </div>
  )
}

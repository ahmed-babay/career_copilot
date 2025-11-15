import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI Career Copilot
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
            Analyze your CV and job descriptions to find skill gaps and get personalized learning recommendations
          </p>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
            Powered by AI embeddings to accurately match your skills with job requirements
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link
              href="/analyze"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/plan"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              View My Plan
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-3xl mb-4">📄</div>
            <h3 className="text-xl font-semibold mb-2">Upload Your CV</h3>
            <p className="text-gray-600">
              Upload your CV in PDF or TXT format. Our AI will extract and analyze your skills automatically.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Compare Skills</h3>
            <p className="text-gray-600">
              Paste a job description and see which skills match, which are missing, and what's nice to have.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-3xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold mb-2">Learn & Grow</h3>
            <p className="text-gray-600">
              Get curated YouTube tutorials for each missing skill and build your personalized learning plan.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2">Upload CV</h4>
              <p className="text-sm text-gray-600">Upload your CV file or paste text</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2">Paste Job Description</h4>
              <p className="text-sm text-gray-600">Enter the job description you're interested in</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2">Get Analysis</h4>
              <p className="text-sm text-gray-600">See matched, missing, and nice-to-have skills</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">4</span>
              </div>
              <h4 className="font-semibold mb-2">Learn & Apply</h4>
              <p className="text-sm text-gray-600">Get YouTube tutorials and build your plan</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


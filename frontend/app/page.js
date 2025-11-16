import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            AI Career Copilot
          </h1>
          <p className="text-xl text-slate-300 mb-4 max-w-2xl mx-auto">
            Analyze your CV and job descriptions to find skill gaps and get personalized learning recommendations
          </p>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
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
              className="bg-slate-700 text-blue-400 px-8 py-3 rounded-lg font-semibold border-2 border-blue-500 hover:bg-slate-600 transition-colors"
            >
              View My Plan
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
            <div className="text-3xl mb-4">📄</div>
            <h3 className="text-xl font-semibold mb-2 text-white">Upload Your CV</h3>
            <p className="text-slate-300">
              Upload your CV in PDF or TXT format. Our AI will extract and analyze your skills automatically.
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2 text-white">Compare Skills</h3>
            <p className="text-slate-300">
              Paste a job description and see which skills match, which are missing, and what's nice to have.
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
            <div className="text-3xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold mb-2 text-white">Learn & Grow</h3>
            <p className="text-slate-300">
              Get curated YouTube tutorials for each missing skill and build your personalized learning plan.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-500/20 border border-blue-500/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-400 font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2 text-white">Upload CV</h4>
              <p className="text-sm text-slate-300">Upload your CV file or paste text</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-500/20 border border-blue-500/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-400 font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2 text-white">Paste Job Description</h4>
              <p className="text-sm text-slate-300">Enter the job description you're interested in</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-500/20 border border-blue-500/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-400 font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2 text-white">Get Analysis</h4>
              <p className="text-sm text-slate-300">See matched, missing, and nice-to-have skills</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-500/20 border border-blue-500/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-400 font-bold">4</span>
              </div>
              <h4 className="font-semibold mb-2 text-white">Learn & Apply</h4>
              <p className="text-sm text-slate-300">Get YouTube tutorials and build your plan</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


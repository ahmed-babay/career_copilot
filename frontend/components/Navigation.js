import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-slate-800 shadow-lg border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-400 hover:text-blue-300">
              AI Career Copilot
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-slate-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/analyze"
              className="text-slate-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Analyze
            </Link>
            <Link
              href="/plan"
              className="text-slate-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              My Plan
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}


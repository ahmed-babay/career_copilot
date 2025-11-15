import './globals.css'

export const metadata = {
  title: 'AI Career Copilot - Skill Gap & Learning Recommender',
  description: 'Analyze your CV and job descriptions to find skill gaps and get personalized learning recommendations',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}


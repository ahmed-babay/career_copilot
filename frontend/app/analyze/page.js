'use client';

import { useState } from 'react';
import { analyzeCV, compareSkills, getTutorialsForSkills } from '@/lib/api';
import SkillBadge from '@/components/SkillBadge';

// LocalStorage key used by /plan
const PLAN_KEY = 'learningPlan';

export default function AnalyzePage() {
  const [cvText, setCvText] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [savingSkill, setSavingSkill] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFile(file);
      setCvText(''); // Clear text input when file is selected
    }
  };

  // Load current plan from localStorage
  const readPlan = () => {
    try {
      const raw = window.localStorage.getItem(PLAN_KEY);
      if (!raw) return { skills: [] };
      const parsed = JSON.parse(raw);
      return { skills: Array.isArray(parsed.skills) ? parsed.skills : [] };
    } catch {
      return { skills: [] };
    }
  };

  // Save plan to localStorage
  const writePlan = (plan) => {
    window.localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
  };

  // Save all videos for a single missing skill to plan (dedup by videoId)
  const saveSkillVideosToPlan = (skillName, category, videos) => {
    setSavingSkill(skillName);
    try {
      const plan = readPlan();
      const idx = plan.skills.findIndex((s) => s.skill === skillName);
      if (idx === -1) {
        plan.skills.push({ skill: skillName, category, videos: [...videos] });
      } else {
        const existing = plan.skills[idx];
        const existingIds = new Set((existing.videos || []).map((v) => v.videoId));
        const merged = [...(existing.videos || [])];
        for (const v of videos) {
          if (!existingIds.has(v.videoId)) merged.push(v);
        }
        plan.skills[idx] = { ...existing, videos: merged };
      }
      writePlan(plan);
    } finally {
      setSavingSkill('');
    }
  };

  // Save single video under a skill
  const saveSingleVideoToPlan = (skillName, category, video) => {
    saveSkillVideosToPlan(skillName, category, [video]);
  };

  const handleAnalyze = async () => {
    if (!cvText && !cvFile) {
      setError('Please provide CV text or upload a file');
      return;
    }

    if (!jdText.trim()) {
      setError('Please provide a job description');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // Step 1: Analyze CV
      console.log('📄 Analyzing CV...');
      const cvAnalysis = await analyzeCV(cvText, cvFile);
      
      // Log CV chunks
      if (cvAnalysis.chunks) {
        console.log(`\n📝 CV segmented into ${cvAnalysis.chunksCount} chunks:`);
        cvAnalysis.chunks.forEach((chunk, index) => {
          console.log(`   CV Chunk ${index + 1} (${chunk.length} chars): "${chunk.substring(0, 100)}${chunk.length > 100 ? '...' : ''}"`);
        });
      }
      
      // Step 2: Compare skills
      console.log('\n🔍 Comparing skills with job description...');
      const comparison = await compareSkills(
        cvAnalysis.text,
        jdText,
        0.5, // threshold
        0.6  // matchThreshold
      );
      
      // Log JD chunks
      if (comparison.debug && comparison.debug.jdChunks) {
        console.log(`\n📝 Job Description segmented into ${comparison.debug.jdChunksCount} chunks:`);
        comparison.debug.jdChunks.forEach((chunk, index) => {
          console.log(`   JD Chunk ${index + 1} (${chunk.length} chars): "${chunk.substring(0, 100)}${chunk.length > 100 ? '...' : ''}"`);
        });
      }
      
      console.log('\n✅ Analysis complete!');
      console.log(`   Matched: ${comparison.summary.totalMatched}`);
      console.log(`   Missing: ${comparison.summary.totalMissing}`);
      console.log(`   Nice to Have: ${comparison.summary.totalNiceToHave}`);

      // Step 3: Get tutorials for missing skills
      const missingSkills = comparison.missing.map(s => s.skill);
      let tutorials = {};
      if (missingSkills.length > 0) {
        const tutorialsData = await getTutorialsForSkills(missingSkills, 3);
        tutorials = tutorialsData.tutorials || {};
      }

      setResults({
        cvSkills: cvAnalysis.skills || [],
        comparison,
        tutorials,
      });
    } catch (err) {
      setError(err.message || 'An error occurred during analysis');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Analyze Your Skills</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column: Input */}
          <div className="space-y-6">
            {/* CV Input Section */}
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
              <h2 className="text-xl font-semibold mb-4 text-white">Your CV</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Upload CV (PDF/TXT)
                </label>
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {cvFile && (
                  <p className="mt-2 text-sm text-slate-300">Selected: {cvFile.name}</p>
                )}
              </div>

              <div className="mb-4">
                <p className="text-sm text-slate-400 mb-2">OR</p>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Paste CV Text
                </label>
                <textarea
                  value={cvText}
                  onChange={(e) => {
                    setCvText(e.target.value);
                    setCvFile(null); // Clear file when text is entered
                  }}
                  placeholder="Paste your CV content here..."
                  rows={8}
                  className="w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                  disabled={!!cvFile}
                />
              </div>
            </div>

            {/* Job Description Section */}
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
              <h2 className="text-xl font-semibold mb-4 text-white">Job Description</h2>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the job description here..."
                rows={10}
                className="w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Analyzing...' : 'Analyze Skills'}
            </button>

            {error && (
              <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="space-y-6">
            {results && (
              <>
                {/* Summary */}
                <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
                  <h2 className="text-xl font-semibold mb-4 text-white">Analysis Summary</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-400">
                        {results.comparison.summary.totalMatched}
                      </div>
                      <div className="text-sm text-slate-300">Matched</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-400">
                        {results.comparison.summary.totalMissing}
                      </div>
                      <div className="text-sm text-slate-300">Missing</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-slate-300">
                        {results.comparison.summary.totalNiceToHave}
                      </div>
                      <div className="text-sm text-slate-300">Nice to Have</div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-sm text-slate-300">Match Rate: </span>
                    <span className="text-lg font-semibold text-white">
                      {results.comparison.summary.matchPercentage}%
                    </span>
                  </div>
                </div>

                {/* Matched Skills */}
                {results.comparison.matched.length > 0 && (
                  <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
                    <h3 className="text-lg font-semibold mb-3 text-emerald-400">
                      ✅ Matched Skills ({results.comparison.matched.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {results.comparison.matched.map((skill) => (
                        <SkillBadge
                          key={skill.skill}
                          skill={skill.skill}
                          category={skill.category}
                          similarity={skill.similarity}
                          showSimilarity={true}
                          variant="matched"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Skills */}
                {results.comparison.missing.length > 0 && (
                  <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
                    <h3 className="text-lg font-semibold mb-3 text-red-400">
                      ❌ Missing Skills ({results.comparison.missing.length})
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {results.comparison.missing.map((skill) => (
                        <SkillBadge
                          key={skill.skill}
                          skill={skill.skill}
                          category={skill.category}
                          similarity={skill.jdSimilarity}
                          showSimilarity={true}
                          variant="missing"
                        />
                      ))}
                    </div>
                    
                    {/* Tutorials for missing skills */}
                    {Object.keys(results.tutorials).length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-3 text-white">📚 Recommended Tutorials</h4>
                        <div className="space-y-6">
                          {Object.entries(results.tutorials).map(([skill, videos]) => (
                            <div key={skill} className="border-l-4 border-blue-500 pl-4">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-white">{skill}</h5>
                                <button
                                  onClick={() => saveSkillVideosToPlan(
                                    skill,
                                    // find category from comparison list fallback 'other'
                                    (results.comparison.missing.find(s => s.skill === skill)?.category) || 'other',
                                    videos
                                  )}
                                  disabled={savingSkill === skill}
                                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 disabled:bg-slate-700"
                                >
                                  {savingSkill === skill ? 'Saving...' : 'Save All to Plan'}
                                </button>
                              </div>
                              <div className="space-y-2">
                                {videos.map((video) => (
                                  <div key={video.videoId} className="flex items-start gap-2">
                                    <a
                                      href={video.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex-1 p-2 bg-slate-700 rounded hover:bg-slate-600 transition-colors"
                                    >
                                      <div className="text-sm font-medium text-blue-400">
                                        {video.title}
                                      </div>
                                      <div className="text-xs text-slate-400">
                                        {video.channelTitle}
                                      </div>
                                    </a>
                                    <button
                                      onClick={() => saveSingleVideoToPlan(
                                        skill,
                                        (results.comparison.missing.find(s => s.skill === skill)?.category) || 'other',
                                        video
                                      )}
                                      className="text-xs bg-emerald-600 text-white px-2 py-1 rounded-md hover:bg-emerald-700"
                                    >
                                      Save
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Nice to Have Skills */}
                {results.comparison.niceToHave.length > 0 && (
                  <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
                    <h3 className="text-lg font-semibold mb-3 text-slate-300">
                      💡 Nice to Have Skills ({results.comparison.niceToHave.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {results.comparison.niceToHave.map((skill) => (
                        <SkillBadge
                          key={skill.skill}
                          skill={skill.skill}
                          category={skill.category}
                          similarity={skill.similarity}
                          showSimilarity={true}
                          variant="niceToHave"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {!results && !loading && (
              <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700 text-center text-slate-400">
                <p>Enter your CV and job description, then click "Analyze Skills" to see results.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}



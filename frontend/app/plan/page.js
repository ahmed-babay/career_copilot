"use client";

import { useEffect, useState } from "react";
import SkillBadge from "@/components/SkillBadge";

// LocalStorage key
const PLAN_KEY = "learningPlan";

export default function PlanPage() {
  const [plan, setPlan] = useState({ skills: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PLAN_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Normalize shape
        setPlan({ skills: Array.isArray(parsed.skills) ? parsed.skills : [] });
      }
    } catch (_) {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const clearPlan = () => {
    window.localStorage.removeItem(PLAN_KEY);
    setPlan({ skills: [] });
  };

  return (
    <main className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">My Learning Plan</h1>
          <button
            onClick={clearPlan}
            className="bg-slate-700 text-slate-200 px-4 py-2 rounded-md border border-slate-600 hover:bg-slate-600"
          >
            Clear Plan
          </button>
        </div>

        {loading ? (
          <div className="text-slate-300">Loading...</div>
        ) : plan.skills.length === 0 ? (
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 text-slate-300">
            Your learning plan is empty. Go to Analyze and add tutorials to your plan.
          </div>
        ) : (
          <div className="space-y-6">
            {plan.skills.map((item) => (
              <div key={item.skill} className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <SkillBadge skill={item.skill} category={item.category || "other"} variant="niceToHave" />
                  <span className="text-slate-300 text-sm">{(item.videos || []).length} videos</span>
                </div>
                <div className="space-y-2">
                  {(item.videos || []).map((video) => (
                    <a
                      key={video.videoId}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-slate-700 rounded hover:bg-slate-600 transition-colors"
                    >
                      <div className="text-sm font-medium text-blue-400">{video.title}</div>
                      <div className="text-xs text-slate-400">{video.channelTitle}</div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

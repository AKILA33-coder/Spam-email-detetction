import { AlertTriangle, BadgeCheck, Brain, Gauge, KeyRound } from "lucide-react";

export default function PredictionCard({ result, loading }) {
  const isSpam = result?.prediction === "Spam";
  const confidence = Math.round((result?.confidence_score || 0) * 100);

  return (
    <div className="glass-panel floating-card rounded-2xl p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">Prediction Result</p>
          <h2 className="mt-2 text-2xl font-black">Threat Classification</h2>
        </div>
        <Brain className="h-7 w-7 text-fuchsia-300" />
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
        {!result && !loading && (
          <div className="py-8 text-center text-slate-400">
            Run a scan to reveal classification, confidence, keywords, and AI insight.
          </div>
        )}

        {loading && (
          <div className="space-y-4 py-8">
            <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 shadow-neon" />
            <div className="mx-auto h-3 w-48 rounded-full bg-white/10" />
            <div className="mx-auto h-3 w-64 rounded-full bg-white/[0.08]" />
          </div>
        )}

        {result && !loading && (
          <div>
            <div className="flex items-center gap-4">
              <div
                className={`grid h-16 w-16 place-items-center rounded-2xl ${
                  isSpam ? "bg-rose-500/18 text-rose-200 shadow-pink" : "bg-emerald-400/15 text-emerald-200 shadow-cyan"
                }`}
              >
                {isSpam ? <AlertTriangle className="h-8 w-8" /> : <BadgeCheck className="h-8 w-8" />}
              </div>
              <div>
                <p className="text-sm text-slate-400">Detected as</p>
                <p className={`text-4xl font-black ${isSpam ? "text-rose-200" : "text-emerald-200"}`}>{result.prediction}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Gauge className="h-4 w-4 text-cyan-300" /> Confidence
                </div>
                <p className="mt-2 text-3xl font-black">{confidence}%</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <KeyRound className="h-4 w-4 text-fuchsia-300" /> Spam Keywords
                </div>
                <p className="mt-2 text-sm text-slate-200">
                  {result.spam_keywords?.length ? result.spam_keywords.join(", ") : "No obvious keyword triggers"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

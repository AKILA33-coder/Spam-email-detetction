import { Loader2, ScanSearch, Sparkles, Type } from "lucide-react";

export default function EmailInput({ email, setEmail, wordCount, loading, onPredict }) {
  return (
    <div className="glass-panel floating-card rounded-2xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-fuchsia-200">Message Scanner</p>
          <h2 className="mt-2 text-2xl font-black text-white">Paste suspicious content</h2>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-3 py-2 text-sm text-cyan-100">
          <Type className="h-4 w-4" />
          {wordCount} words
        </div>
      </div>

      <div className="relative mt-5 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/75">
        {loading && <div className="scan-line" />}
        <textarea
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Example: Congratulations! You have won a free cash prize. Click here to claim now..."
          className="min-h-56 w-full resize-none bg-transparent p-5 text-base leading-7 text-slate-100 outline-none placeholder:text-slate-600"
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Sparkles className="h-4 w-4 text-fuchsia-300" />
          Keyword extraction, confidence scoring, and history logging run after every scan.
        </div>
        <button
          type="button"
          onClick={onPredict}
          disabled={loading}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 px-6 py-3 font-black text-white shadow-neon transition hover:scale-[1.02] disabled:cursor-wait disabled:opacity-70"
        >
          <span className="absolute inset-0 bg-white/20 opacity-0 transition group-hover:opacity-100" />
          <span className="relative flex items-center gap-2">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ScanSearch className="h-5 w-5" />}
            {loading ? "Analyzing Signal..." : "Detect Spam"}
          </span>
        </button>
      </div>
    </div>
  );
}

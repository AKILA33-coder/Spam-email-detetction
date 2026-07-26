export default function MetricsCard({ label, value, detail, tone = "cyan" }) {
  const colors = {
    cyan: "from-cyan-400 to-blue-500 shadow-cyan",
    purple: "from-violet-400 to-purple-600 shadow-neon",
    pink: "from-fuchsia-400 to-pink-600 shadow-pink",
    green: "from-emerald-300 to-cyan-400 shadow-cyan",
  };
  const width = Math.max(8, Math.min(100, Math.round(Number(value) * 100 || 0)));

  return (
    <article className="glass-panel floating-card rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">{label}</p>
          <p className="mt-3 text-4xl font-black text-white">{Math.round((Number(value) || 0) * 100)}%</p>
        </div>
        <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${colors[tone]}`} />
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
        <div className={`metric-bar h-full rounded-full bg-gradient-to-r ${colors[tone]}`} style={{ width: `${width}%` }} />
      </div>
      <p className="mt-3 text-sm text-slate-400">{detail}</p>
    </article>
  );
}

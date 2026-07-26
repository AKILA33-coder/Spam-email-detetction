import { BarChart3, Flame, LineChart, PieChart } from "lucide-react";

function MiniBars({ analytics }) {
  const rows = analytics.timeline?.length ? analytics.timeline : [{ day: "Today", total: 1, spam: 0, ham: 1, confidence: 0.8 }];
  const max = Math.max(...rows.map((row) => row.total || 1));
  return (
    <div className="flex h-48 items-end gap-3">
      {rows.map((row) => (
        <div key={row.day} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full items-end gap-1">
            <div
              className="w-1/2 rounded-t-lg bg-gradient-to-t from-rose-500 to-fuchsia-400 shadow-pink"
              style={{ height: `${Math.max(8, ((row.spam || 0) / max) * 170)}px` }}
            />
            <div
              className="w-1/2 rounded-t-lg bg-gradient-to-t from-cyan-500 to-emerald-300 shadow-cyan"
              style={{ height: `${Math.max(8, ((row.ham || 0) / max) * 170)}px` }}
            />
          </div>
          <span className="max-w-16 truncate text-[10px] text-slate-500">{row.day}</span>
        </div>
      ))}
    </div>
  );
}

function Donut({ stats }) {
  const spam = stats.spam_predictions || 0;
  const ham = stats.ham_predictions || 0;
  const total = spam + ham || 1;
  const spamPct = (spam / total) * 100;
  return (
    <div className="grid place-items-center">
      <div
        className="relative grid h-48 w-48 place-items-center rounded-full shadow-neon"
        style={{ background: `conic-gradient(#fb7185 0 ${spamPct}%, #22d3ee ${spamPct}% 100%)` }}
      >
        <div className="grid h-32 w-32 place-items-center rounded-full bg-slate-950 text-center">
          <div>
            <p className="text-4xl font-black">{Math.round(spamPct)}%</p>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Spam Mix</p>
          </div>
        </div>
      </div>
      <div className="mt-5 flex gap-4 text-sm">
        <span className="flex items-center gap-2 text-rose-200"><i className="h-2 w-2 rounded-full bg-rose-400" /> Spam</span>
        <span className="flex items-center gap-2 text-cyan-200"><i className="h-2 w-2 rounded-full bg-cyan-300" /> Ham</span>
      </div>
    </div>
  );
}

export default function ChartSection({ stats, analytics }) {
  const topKeywords = analytics.top_keywords?.length
    ? analytics.top_keywords
    : [{ keyword: "free", count: 3 }, { keyword: "claim", count: 2 }, { keyword: "urgent", count: 1 }];

  return (
    <section className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
      <div className="glass-panel floating-card rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-cyan-200">Live Analytics</p>
            <h2 className="mt-2 text-2xl font-black">Spam vs Ham Timeline</h2>
          </div>
          <LineChart className="h-7 w-7 text-cyan-300" />
        </div>
        <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
          <MiniBars analytics={analytics} />
        </div>
      </div>

      <div className="glass-panel floating-card rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-fuchsia-200">Distribution</p>
            <h2 className="mt-2 text-2xl font-black">Threat Ratio</h2>
          </div>
          <PieChart className="h-7 w-7 text-fuchsia-300" />
        </div>
        <div className="mt-5">
          <Donut stats={stats} />
        </div>
      </div>

      <div className="glass-panel floating-card rounded-2xl p-5 xl:col-span-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-rose-200">Keyword Heatmap</p>
            <h2 className="mt-2 text-2xl font-black">Most Triggered Spam Signals</h2>
          </div>
          <Flame className="h-7 w-7 text-rose-300" />
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {topKeywords.map((item, index) => (
            <div key={item.keyword} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-white">{item.keyword}</span>
                <span className="text-slate-400">#{index + 1}</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="metric-bar h-full rounded-full bg-gradient-to-r from-rose-400 via-fuchsia-400 to-cyan-300"
                  style={{ width: `${Math.min(100, item.count * 18 + 16)}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-400">{item.count} detections</p>
            </div>
          ))}
        </div>
        <div className="sr-only"><BarChart3 /></div>
      </div>
    </section>
  );
}

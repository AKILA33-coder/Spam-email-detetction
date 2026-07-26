import ChartSection from "../components/ChartSection.jsx";
import MetricsCard from "../components/MetricsCard.jsx";

export default function Analytics({ stats, analytics, history }) {
  const spamRate = stats.total_predictions ? stats.spam_predictions / stats.total_predictions : 0;
  const hamRate = stats.total_predictions ? stats.ham_predictions / stats.total_predictions : 0;

  return (
    <div className="space-y-5">
      <section className="glass-panel neon-border rounded-2xl p-8">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-200">Advanced Admin Dashboard</p>
        <h1 className="mt-4 text-5xl font-black gradient-text md:text-7xl">Live Spam Analytics</h1>
        <p className="mt-4 max-w-3xl text-slate-300">
          Monitor message volume, prediction distribution, model confidence, and keyword trends from the SQLite
          prediction ledger.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <MetricsCard label="Spam Rate" value={spamRate} detail={`${stats.spam_predictions} of ${stats.total_predictions} records flagged.`} tone="pink" />
        <MetricsCard label="Ham Rate" value={hamRate} detail={`${stats.ham_predictions} safe messages in history.`} tone="green" />
        <MetricsCard label="Mean Confidence" value={stats.average_confidence} detail={`Average message length: ${stats.average_words} words.`} tone="cyan" />
      </section>

      <ChartSection stats={stats} analytics={analytics} />

      <section className="glass-panel rounded-2xl p-5">
        <p className="text-xs font-bold uppercase tracking-[0.26em] text-fuchsia-200">Recent Events</p>
        <div className="mt-5 grid gap-3">
          {history.slice(0, 8).map((row) => (
            <div key={row.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
              <div>
                <p className="font-semibold text-white">{row.prediction}</p>
                <p className="line-clamp-1 text-sm text-slate-400">{row.email_message}</p>
              </div>
              <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-sm text-cyan-100">
                {Math.round(row.confidence_score * 100)}%
              </span>
            </div>
          ))}
          {history.length === 0 && <p className="text-slate-400">No analytics events yet. Run a scan from the dashboard.</p>}
        </div>
      </section>
    </div>
  );
}

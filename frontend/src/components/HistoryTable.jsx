import { Trash2 } from "lucide-react";

export default function HistoryTable({ history, onClearHistory }) {
  return (
    <section className="glass-panel rounded-2xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-cyan-200">Audit Trail</p>
          <h2 className="mt-2 text-2xl font-black">Prediction History</h2>
        </div>
        <button
          type="button"
          onClick={onClearHistory}
          className="flex items-center gap-2 rounded-xl border border-rose-300/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/18"
        >
          <Trash2 className="h-4 w-4" />
          Delete History
        </button>
      </div>

      <div className="d-md-none mt-4 space-y-3">
        {history.length === 0 && <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-slate-400">No prediction records yet.</div>}
        {history.map((row) => (
          <div key={row.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="mb-2 text-xs text-slate-400">{row.created_at}</div>
            <p className="mb-3 line-clamp-3 text-sm text-slate-200">{row.email_message}</p>
            <div className="d-flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  row.prediction === "Spam" ? "bg-rose-500/15 text-rose-200" : "bg-emerald-400/15 text-emerald-200"
                }`}
              >
                {row.prediction}
              </span>
              <span className="rounded-full bg-cyan-300/15 px-3 py-1 text-xs text-cyan-100">
                {Math.round(row.confidence_score * 100)}%
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">{row.word_count} words</span>
            </div>
            <div className="mt-2 text-xs text-slate-400">{row.spam_keywords || "none"}</div>
          </div>
        ))}
      </div>

      <div className="table-fade mt-5 hidden max-h-[28rem] overflow-auto rounded-2xl border border-white/10 md:block">
        <table className="w-full min-w-[780px] border-collapse text-left text-sm">
          <thead className="sticky top-0 bg-slate-950/95 text-xs uppercase tracking-[0.18em] text-slate-400 backdrop-blur">
            <tr>
              <th className="p-4">Message</th>
              <th className="p-4">Prediction</th>
              <th className="p-4">Confidence</th>
              <th className="p-4">Words</th>
              <th className="p-4">Keywords</th>
              <th className="p-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.08]">
            {history.length === 0 && (
              <tr>
                <td className="p-8 text-center text-slate-400" colSpan="6">No prediction records yet.</td>
              </tr>
            )}
            {history.map((row) => (
              <tr key={row.id} className="transition hover:bg-white/5">
                <td className="max-w-sm p-4 text-slate-300">
                  <span className="line-clamp-2">{row.email_message}</span>
                </td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      row.prediction === "Spam" ? "bg-rose-500/15 text-rose-200" : "bg-emerald-400/15 text-emerald-200"
                    }`}
                  >
                    {row.prediction}
                  </span>
                </td>
                <td className="p-4 text-cyan-100">{Math.round(row.confidence_score * 100)}%</td>
                <td className="p-4 text-slate-300">{row.word_count}</td>
                <td className="p-4 text-slate-400">{row.spam_keywords || "none"}</td>
                <td className="p-4 text-slate-500">{row.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

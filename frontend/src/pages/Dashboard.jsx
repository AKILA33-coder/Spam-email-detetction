import { ArrowRight, Bot, Gauge, History, ShieldCheck, SignalHigh } from "lucide-react";
import ChartSection from "../components/ChartSection.jsx";
import EmailInput from "../components/EmailInput.jsx";
import HistoryTable from "../components/HistoryTable.jsx";
import InsightPanel from "../components/InsightPanel.jsx";
import MailIllustration from "../components/MailIllustration.jsx";
import MetricsCard from "../components/MetricsCard.jsx";
import PredictionCard from "../components/PredictionCard.jsx";

function StatStrip({ stats }) {
  const items = [
    { label: "Total Scans", value: stats.total_predictions, icon: History, color: "text-cyan-200" },
    { label: "Spam Flags", value: stats.spam_predictions, icon: ShieldCheck, color: "text-rose-200" },
    { label: "Safe Mail", value: stats.ham_predictions, icon: Bot, color: "text-emerald-200" },
    { label: "Avg Confidence", value: `${Math.round((stats.average_confidence || 0) * 100)}%`, icon: Gauge, color: "text-fuchsia-200" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="glass-soft floating-card rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{item.label}</p>
                <p className="mt-2 text-3xl font-black">{item.value}</p>
              </div>
              <Icon className={`h-8 w-8 ${item.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Hero({ onOpenDetector, onNavigate }) {
  return (
    <section className="glass-panel neon-border relative overflow-hidden rounded-2xl p-6 md:p-8">
      <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-fuchsia-400/10 blur-3xl" />
      <div className="relative z-10 grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-4 py-2 text-sm text-cyan-100">
            <SignalHigh className="h-4 w-4" />
            Real-time AI spam detection platform
          </div>
          <h1 className="mt-6 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
            <span className="shimmer-text">Cyberpunk Spam Mail Detection</span>
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            A premium Flask, SQLite, React, Tailwind CSS, and machine learning dashboard that classifies suspicious
            messages, stores prediction history, tracks model metrics, and surfaces live threat intelligence.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onOpenDetector}
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-black text-slate-950 transition hover:scale-[1.02]"
            >
              Open Detector <ArrowRight className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate("analytics")}
              className="rounded-xl border border-white/15 bg-white/[0.08] px-5 py-3 font-black text-white transition hover:bg-white/[0.14]"
            >
              View Analytics
            </button>
          </div>
        </div>
        <MailIllustration />
      </div>
    </section>
  );
}

export default function Dashboard({
  email,
  setEmail,
  wordCount,
  result,
  history,
  stats,
  analytics,
  loading,
  booting,
  onPredict,
  onClearHistory,
  onNavigate,
}) {
  const metrics = stats.model_metrics || {};
  const openDetector = () => {
    onNavigate("dashboard");
    window.requestAnimationFrame(() => {
      document.getElementById("detector-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className="space-y-5">
      <Hero onOpenDetector={openDetector} onNavigate={onNavigate} />
      <StatStrip stats={stats} />

      <section id="detector-panel" className="scroll-mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <EmailInput email={email} setEmail={setEmail} wordCount={wordCount} loading={loading} onPredict={onPredict} />
        <PredictionCard result={result} loading={loading || booting} />
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <MetricsCard label="Accuracy" value={metrics.accuracy} detail="Overall model correctness on the evaluation split." tone="cyan" />
        <MetricsCard label="Precision" value={metrics.precision} detail="How often spam predictions are truly spam." tone="purple" />
        <MetricsCard label="Recall" value={metrics.recall} detail="How many spam messages the model catches." tone="pink" />
      </section>

      <InsightPanel result={result} stats={stats} />
      <ChartSection stats={stats} analytics={analytics} />
      <HistoryTable history={history} onClearHistory={onClearHistory} />
    </div>
  );
}

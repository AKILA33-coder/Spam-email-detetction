import { BrainCircuit, Cpu, Fingerprint, Zap } from "lucide-react";

export default function InsightPanel({ result, stats }) {
  const insight = result
    ? result.prediction === "Spam"
      ? "The classifier found promotional or urgency-driven language. Review links, claims, prizes, and sender reputation before responding."
      : "The message profile currently resembles legitimate communication. Continue validating sender identity for sensitive requests."
    : "Run a message through the detector to generate an AI insight based on model confidence, keyword triggers, and text structure.";

  const tiles = [
    { label: "Pipeline", value: "TF-IDF", icon: Cpu },
    { label: "Classifier", value: "Logistic", icon: BrainCircuit },
    { label: "Rows", value: stats.model_metrics?.dataset_rows || 0, icon: Fingerprint },
    { label: "Latency", value: "Live", icon: Zap },
  ];

  return (
    <section className="glass-panel floating-card rounded-2xl p-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-fuchsia-200">AI Insights</p>
        <h2 className="mt-2 text-2xl font-black">Decision Intelligence</h2>
      </div>
      <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">{insight}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <div key={tile.label} className="rounded-xl border border-white/10 bg-slate-950/45 p-4">
              <Icon className="h-5 w-5 text-cyan-300" />
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">{tile.label}</p>
              <p className="mt-1 text-xl font-black text-white">{tile.value}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

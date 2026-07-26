import { Database, Layers3, Server, Sparkles } from "lucide-react";

export default function About() {
  const stack = [
    { icon: Layers3, title: "React + Vite", body: "Modular components, responsive dashboard layouts, and advanced Tailwind CSS visual systems." },
    { icon: Server, title: "Flask REST API", body: "Prediction, history, analytics, dashboard stats, model training, and system health endpoints." },
    { icon: Database, title: "SQLite Ledger", body: "Every prediction stores message text, result, confidence, keywords, word count, and timestamp." },
    { icon: Sparkles, title: "Machine Learning", body: "Kaggle SMS Spam Collection preprocessing, duplicate removal, TF-IDF vectors, and Logistic Regression." },
  ];

  return (
    <div className="space-y-5">
      <section className="glass-panel neon-border rounded-2xl p-8">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-fuchsia-200">About Project</p>
        <h1 className="mt-4 text-5xl font-black gradient-text md:text-7xl">Professional Spam Detection Suite</h1>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
          NeuroShield is built as a polished AI SaaS application rather than a simple form demo. It combines a trained
          machine learning model, REST APIs, database-backed history, interactive analytics, confidence scoring, and a
          futuristic cyberpunk interface.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {stack.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="glass-panel floating-card rounded-2xl p-6">
              <Icon className="h-8 w-8 text-cyan-300" />
              <h2 className="mt-4 text-2xl font-black">{item.title}</h2>
              <p className="mt-3 leading-7 text-slate-400">{item.body}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}

import { ShieldCheck } from "lucide-react";

export default function Sidebar({ sections, activeSection, onSectionChange }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-white/10 bg-slate-950/45 p-4 backdrop-blur-2xl lg:block">
      <div className="glass-panel neon-border rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 shadow-neon">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <div>
            <p className="text-lg font-black">NeuroShield</p>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">AI Mail Defense</p>
          </div>
        </div>
      </div>

      <nav className="mt-6 space-y-2">
        {sections.map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.id || (activeSection === "home" && item.id === "dashboard");
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition duration-300 ${
                active
                  ? "bg-gradient-to-r from-cyan-400/20 via-violet-500/20 to-fuchsia-500/20 text-white shadow-cyan"
                  : "text-slate-400 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "text-cyan-200" : "text-slate-500 group-hover:text-fuchsia-200"}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.08] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">Model Core</p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
          <div className="metric-bar h-full w-[91%] rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500" />
        </div>
        <p className="mt-3 text-xs text-slate-400">TF-IDF plus Logistic Regression pipeline active.</p>
      </div>
    </aside>
  );
}

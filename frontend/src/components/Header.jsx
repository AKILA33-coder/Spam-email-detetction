import { Database, Menu, RadioTower, ServerCog } from "lucide-react";

function StatusPill({ icon: Icon, label, value }) {
  const active = ["healthy", "online", "connected", "ready"].includes(String(value).toLowerCase());
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs">
      <Icon className={`h-4 w-4 ${active ? "text-emerald-300" : "text-cyan-300"}`} />
      <span className="text-slate-400">{label}</span>
      <span className={active ? "text-emerald-200" : "text-cyan-200"}>{value}</span>
    </div>
  );
}

export default function Header({ health, booting }) {
  return (
    <header className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/35 p-3 backdrop-blur-xl">
      <button className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/6 lg:hidden" type="button">
        <Menu className="h-5 w-5" />
      </button>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-200/80">Premium AI SaaS Console</p>
        <p className="text-sm text-slate-400">Real-time spam intelligence, model telemetry, and SQLite audit trail.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <StatusPill icon={RadioTower} label="API" value={booting ? "checking" : health.api} />
        <StatusPill icon={Database} label="DB" value={booting ? "checking" : health.database} />
        <StatusPill icon={ServerCog} label="Model" value={booting ? "checking" : health.model} />
      </div>
    </header>
  );
}

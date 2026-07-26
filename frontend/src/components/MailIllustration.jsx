import { LockKeyhole, ShieldAlert, Sparkles, Zap } from "lucide-react";

export default function MailIllustration() {
  return (
    <div className="glass-panel floating-card relative min-h-[32rem] overflow-hidden rounded-2xl p-6 pb-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(56,189,248,0.18),transparent_42%)]" />
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-fuchsia-200">3D Defense Layer</p>
          <h2 className="mt-2 text-2xl font-black">Neural Mail Firewall</h2>
        </div>
        <Sparkles className="h-7 w-7 text-cyan-300" />
      </div>

      <div className="scene-perspective relative z-10 mt-12 grid place-items-center">
        <div className="mail-orbit" />
        <div className="mail-platform-glow" />

        <div className="isometric-mail animate-float">
          <div className="mail-depth mail-face mail-metal relative h-48 w-72 rounded-xl border border-cyan-200/30">
            <div className="mail-highlight" />
            <div className="mail-lid absolute inset-0 rounded-xl" />
            <div className="mail-flap-fold" />
            <div className="mail-side mail-side-right" />
            <div className="mail-side mail-side-bottom" />
            <div className="mail-ridge" />

            <div className="absolute left-8 top-7 h-4 w-40 rounded-full bg-cyan-200/20" />
            <div className="absolute left-8 top-16 h-3 w-52 rounded-full bg-fuchsia-200/16" />
            <div className="absolute bottom-7 right-8 grid h-16 w-16 place-items-center rounded-2xl bg-rose-500/18 text-rose-100 shadow-pink">
              <ShieldAlert className="h-9 w-9" />
            </div>
            <div className="absolute -right-4 -top-4 grid h-12 w-12 place-items-center rounded-2xl bg-cyan-300/20 text-cyan-100 shadow-cyan">
              <Zap className="h-6 w-6" />
            </div>
            <div className="mail-beam" />
          </div>
          <div className="mail-shadow mx-auto h-12 w-72 rounded-[50%] bg-black/55 blur-md" />
        </div>
      </div>

      <div className="relative z-10 mt-8 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {["TF-IDF", "LogReg", "SQLite"].map((item) => (
          <div
            key={item}
            className="rounded-xl border border-white/15 bg-white/[0.08] px-3 py-2 text-center text-sm font-semibold tracking-wide text-cyan-100"
          >
            {item}
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-xl border border-emerald-300/15 bg-emerald-300/[0.08] px-4 py-3 text-sm text-emerald-100">
        <LockKeyhole className="h-5 w-5" />
        Model telemetry and prediction audit log are synchronized.
      </div>
    </div>
  );
}

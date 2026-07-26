import { useEffect, useMemo, useState } from "react";
import { Activity, BarChart3, BrainCircuit, Home, Info, Mail, MessageCircle, Radar } from "lucide-react";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Analytics from "./pages/Analytics.jsx";
import About from "./pages/About.jsx";
import { api } from "./services/api.js";

const sections = [
  { id: "home", label: "Home", icon: Home },
  { id: "dashboard", label: "Dashboard", icon: Radar },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "about", label: "About Project", icon: Info },
  { id: "contact", label: "Contact", icon: MessageCircle },
];

const emptyStats = {
  total_predictions: 0,
  spam_predictions: 0,
  ham_predictions: 0,
  average_confidence: 0,
  average_words: 0,
  recent_activity: [],
  model_metrics: { accuracy: 0, precision: 0, recall: 0, dataset_rows: 0, source: "loading" },
};

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(emptyStats);
  const [analytics, setAnalytics] = useState({ timeline: [], top_keywords: [] });
  const [health, setHealth] = useState({ api: "checking", model: "checking", database: "checking" });
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [error, setError] = useState("");

  const wordCount = useMemo(() => email.trim().split(/\s+/).filter(Boolean).length, [email]);

  async function refreshDashboard() {
    const [historyPayload, statsPayload, analyticsPayload, healthPayload] = await Promise.all([
      api.history(),
      api.stats(),
      api.analytics(),
      api.health(),
    ]);
    setHistory(historyPayload.history || []);
    setStats({ ...emptyStats, ...statsPayload });
    setAnalytics(analyticsPayload);
    setHealth(healthPayload);
  }

  useEffect(() => {
    refreshDashboard()
      .catch((requestError) => setError(requestError.message))
      .finally(() => setBooting(false));
  }, []);

  async function handlePredict() {
    if (!email.trim()) {
      setError("Paste an email or SMS message before scanning.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const prediction = await api.predict(email);
      setResult(prediction);
      setActiveSection("dashboard");
      await refreshDashboard();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleClearHistory() {
    await api.clearHistory();
    await refreshDashboard();
  }

  const shellClasses = "min-h-screen overflow-hidden bg-void text-slate-100";
  const mobileSections = sections.filter((item) => item.id !== "home");

  return (
    <div className={shellClasses}>
      <div className="pointer-events-none fixed inset-0 cyber-grid opacity-70" />
      <div className="particle left-[12%] top-[16%]" />
      <div className="particle left-[76%] top-[12%] [animation-delay:1.1s]" />
      <div className="particle left-[68%] top-[72%] [animation-delay:2.6s]" />
      <div className="particle left-[24%] top-[84%] [animation-delay:4.2s]" />

      <div className="relative z-10 flex min-h-screen">
        <Sidebar sections={sections} activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="container-fluid min-w-0 flex-1 px-3 pb-8 pt-4 md:px-4 lg:px-5">
          <Header health={health} booting={booting} />

          <div className="d-lg-none mb-3">
            <div className="glass-soft rounded-3 p-2">
              <div className="d-flex flex-wrap gap-2">
                {mobileSections.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    className={`btn btn-sm ${
                      activeSection === item.id || (activeSection === "home" && item.id === "dashboard")
                        ? "btn-info"
                        : "btn-outline-light"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100 shadow-pink">
              {error}
            </div>
          )}

          {(activeSection === "home" || activeSection === "dashboard") && (
            <Dashboard
              email={email}
              setEmail={setEmail}
              wordCount={wordCount}
              result={result}
              history={history}
              stats={stats}
              analytics={analytics}
              loading={loading}
              booting={booting}
              onPredict={handlePredict}
              onClearHistory={handleClearHistory}
              onNavigate={setActiveSection}
            />
          )}

          {activeSection === "analytics" && <Analytics stats={stats} analytics={analytics} history={history} />}
          {activeSection === "about" && <About />}
          {activeSection === "contact" && (
            <section className="glass-panel neon-border rounded-2xl p-8">
              <div className="flex items-center gap-3 text-neon-cyan">
                <Mail className="h-6 w-6" />
                <span className="text-sm font-semibold uppercase tracking-[0.24em]">Contact</span>
              </div>
              <h1 className="mt-5 text-4xl font-black gradient-text md:text-6xl">NeuroShield Support Desk</h1>
              <p className="mt-4 max-w-3xl text-slate-300">
                This build is ready for academic demos, portfolio presentations, and client-style product walkthroughs.
                Extend this section with your team email, GitHub repository, deployment link, and project documentation.
              </p>
              <div className="mt-4 rounded-xl border border-cyan-200/20 bg-cyan-200/10 p-3 text-sm text-cyan-100">
                Max retained history rows: {stats.max_history_rows || 5000}
              </div>
            </section>
          )}
        </main>
      </div>

      <div className="pointer-events-none fixed bottom-0 left-1/2 h-48 w-[58rem] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="pointer-events-none fixed right-0 top-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="sr-only">
        <Activity /> <BrainCircuit />
      </div>
    </div>
  );
}

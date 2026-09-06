"use client";

import { useState } from "react";
import { Activity, ArrowDown, ArrowUp, Bell, Check, ChevronDown, ChevronRight, CircleHelp, FileText, Globe2, LayoutDashboard, Link2, Menu, MoreHorizontal, PanelLeftClose, Play, Search, Settings, ShieldAlert, TriangleAlert } from "lucide-react";

const changes = [
  { icon: "404", title: "Pages became 404", count: 23, level: "critical", trend: "+23", text: "Previously healthy pages are now returning errors." },
  { icon: "NO", title: "Pages became noindex", count: 17, level: "critical", trend: "+17", text: "Pages were changed from indexable to noindex." },
  { icon: "↗", title: "Canonical URLs changed", count: 8, level: "warning", trend: "+8", text: "Canonical destinations differ from the previous crawl." },
  { icon: "Tt", title: "Page titles changed", count: 31, level: "warning", trend: "+31", text: "Title tags were updated since your last crawl." },
];

const history = [
  { id: "#3", when: "Today, 9:42 AM", urls: 432, changes: 47, issues: 16, active: true },
  { id: "#2", when: "Aug 30, 2026", urls: 431, changes: 12, issues: 21 },
  { id: "#1", when: "Aug 23, 2026", urls: 427, changes: "—", issues: 29 },
];

export default function Dashboard() {
  const [running, setRunning] = useState(false);
  const [notice, setNotice] = useState(false);
  const runCrawl = () => { setRunning(true); setTimeout(() => { setRunning(false); setNotice(true); }, 1300); };

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brandmark"><Activity size={19}/></div><span>indexly</span></div>
      <nav>
        <p className="nav-label">WORKSPACE</p>
        <a className="nav-item active"><LayoutDashboard/>Overview</a>
        <a className="nav-item"><Activity/>Changes <b className="badge">47</b></a>
        <a className="nav-item"><ShieldAlert/>Issues <b className="badge muted">16</b></a>
        <a className="nav-item"><FileText/>Pages</a>
        <a className="nav-item"><Globe2/>Crawl history</a>
        <p className="nav-label second">SETTINGS</p>
        <a className="nav-item"><Bell/>Notifications</a>
        <a className="nav-item"><Settings/>Project settings</a>
      </nav>
      <div className="sidebar-bottom">
        <div className="help"><CircleHelp/><div><strong>Need help?</strong><span>Read our quick start guide</span></div><ChevronRight/></div>
        <div className="profile"><div className="avatar">AM</div><div><strong>Alex Morgan</strong><span>alex@northstarseo.com</span></div><MoreHorizontal/></div>
      </div>
    </aside>

    <main>
      <header>
        <button className="icon-btn mobile"><Menu/></button>
        <div className="project-switch"><div className="site-icon">e</div><div><strong>example.com</strong><span>https://example.com</span></div><ChevronDown/></div>
        <div className="header-actions"><span className="last-crawl"><i></i> Last crawled 2 hours ago</span><button className="run" onClick={runCrawl} disabled={running}><Play fill="currentColor"/>{running ? "Crawling…" : "Run crawl"}</button><button className="icon-btn"><Bell/><i className="dot"></i></button></div>
      </header>

      <div className="content">
        {notice && <div className="toast"><Check/> Crawl completed. No new critical changes found.<button onClick={() => setNotice(false)}>×</button></div>}
        <div className="page-title"><div><h1>Good morning, Alex</h1><p>Here’s what changed on <strong>example.com</strong> since your last crawl.</p></div><button className="date-btn">Last 7 days <ChevronDown/></button></div>

        <section className="metrics">
          <article><div className="metric-head"><span>URLs crawled</span><Globe2/></div><div className="metric-value">432 <em className="positive"><ArrowUp/>1</em></div><p>vs. 431 last crawl</p></article>
          <article><div className="metric-head"><span>Open issues</span><TriangleAlert/></div><div className="metric-value">16 <em className="positive"><ArrowDown/>5</em></div><p>5 issues resolved</p></article>
          <article className="accent"><div className="metric-head"><span>Changes detected</span><Activity/></div><div className="metric-value">47 <em className="negative"><ArrowUp/>35</em></div><p>since Aug 30, 2026</p></article>
          <article><div className="metric-head"><span>Site health</span><ShieldAlert/></div><div className="metric-value">92<span className="outof">/100</span></div><div className="health"><i></i></div></article>
        </section>

        <div className="section-heading"><div><h2>Changes that need your attention</h2><p>Important changes detected between your two most recent crawls.</p></div><button className="text-btn">View all changes <ChevronRight/></button></div>
        <section className="change-grid">
          {changes.map((c) => <article className="change-card" key={c.title}>
            <div className={`change-icon ${c.level}`}>{c.icon}</div><div className="change-copy"><div><span className={`pill ${c.level}`}>{c.level}</span><span className={`trend ${c.level}`}>{c.trend}</span></div><h3>{c.title}</h3><p>{c.text}</p><button>View {c.count} URLs <ChevronRight/></button></div>
          </article>)}
        </section>

        <section className="resolved"><div className="resolved-icon"><Check/></div><div><h3>13 issues were resolved</h3><p>Nice work — these issues are no longer present in your latest crawl.</p></div><div className="resolved-tags"><span>7 Missing titles</span><span>4 Broken links</span><span>2 Canonical issues</span></div><button>View resolved <ChevronRight/></button></section>

        <section className="history-card">
          <div className="history-title"><div><h2>Crawl history</h2><p>Track site health and changes over time.</p></div><button className="text-btn">View full history <ChevronRight/></button></div>
          <div className="table"><div className="tr th"><span>CRAWL</span><span>STATUS</span><span>URLS</span><span>CHANGES</span><span>ISSUES</span><span></span></div>
          {history.map((h) => <div className="tr" key={h.id}><span><b>Crawl {h.id}</b><small>{h.when}</small></span><span><i className="status-dot"></i>Completed</span><span>{h.urls}</span><span>{h.changes}</span><span className={h.issues > 20 ? "warn-num" : ""}>{h.issues}</span><span><ChevronRight/></span></div>)}</div>
        </section>
        <footer><span>Indexly monitors your site weekly.</span><button><PanelLeftClose/> Send feedback</button></footer>
      </div>
    </main>
  </div>;
}

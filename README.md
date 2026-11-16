:root {
  --bg: #f5f7f5;
  --panel: #ffffff;
  --soft: #edf7f2;
  --green: #0a3d2e;
  --green-strong: #0c5b4a;
  --green-soft: #dff5eb;
  --text: #12211c;
  --muted: #576b65;
  --line: #dfe9e4;
  --orange: #f59e0b;
  --shadow: 0 12px 30px rgba(10, 61, 46, 0.08);
}

* { box-sizing: border-box; }
html, body, #root {
  margin: 0;
  min-height: 100%;
  background: var(--bg);
  color: var(--text);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
body { direction: rtl; }
button, input, textarea, select { font: inherit; }
button { cursor: pointer; }

.app-shell {
  max-width: 1320px;
  margin: 0 auto;
  padding: 24px 18px 50px;
}

.topbar {
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(10,61,46,0.08);
  border-radius: 22px;
  padding: 18px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 10px;
  z-index: 10;
}

.brand-wrap { display: flex; align-items: center; gap: 12px; }
.brand-mark {
  width: 42px; height: 42px; border-radius: 14px;
  background: linear-gradient(135deg, var(--green), var(--green-strong));
  color: white; display: grid; place-items: center; font-weight: 700; font-size: 1.4rem;
}
.brand-wrap h1 { margin: 0; font-size: 1.6rem; }
.brand-wrap small { color: var(--muted); }

.nav { display: flex; gap: 10px; flex-wrap: wrap; }
.nav-item {
  background: transparent; border: 0; color: var(--muted); font-weight: 600;
  padding: 10px 16px; border-radius: 12px;
}
.nav-item.active { background: var(--green-soft); color: var(--green); }

.primary-btn, .secondary-btn, .chat-input-row button {
  border: 0; border-radius: 12px; padding: 12px 18px; font-weight: 700;
  transition: transform 0.2s ease;
}
.primary-btn {
  background: linear-gradient(135deg, var(--green), var(--green-strong));
  color: white; box-shadow: var(--shadow);
}
.secondary-btn {
  background: var(--soft); color: var(--green);
}
.primary-btn:hover, .secondary-btn:hover, .chat-input-row button:hover { transform: translateY(-1px); }

.main-grid { margin-top: 24px; display: grid; gap: 26px; }

.hero-panel {
  display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 22px;
  background: linear-gradient(135deg, rgba(10,61,46,0.04), rgba(16,185,129,0.04));
  border: 1px solid rgba(10,61,46,0.06);
  border-radius: 32px; padding: 28px;
}

.hero-copy { padding: 18px 10px; }
.eyebrow {
  display: inline-flex; background: var(--green-soft); color: var(--green);
  border-radius: 999px; padding: 8px 14px; font-weight: 700; font-size: 0.82rem;
}
.hero-copy h2 { margin: 18px 0 12px; font-size: clamp(2rem, 5vw, 3.1rem); line-height: 1.2; }
.hero-copy p { color: var(--muted); max-width: 640px; line-height: 1.9; font-size: 1.05rem; }
.cta-row { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 20px; }

.stat-row {
  margin-top: 28px; display: grid; grid-template-columns: repeat(3, minmax(120px, 1fr));
  gap: 14px;
}
.stat-row > div {
  background: white; border: 1px solid var(--line); border-radius: 18px; padding: 16px 14px;
  display: grid; gap: 8px;
}
.stat-row strong { color: var(--green); font-size: 1.5rem; }
.stat-row span { color: var(--muted); }

.ai-card {
  background: rgba(255,255,255,0.9); border: 1px solid rgba(10,61,46,0.08);
  border-radius: 24px; padding: 18px; display: flex; flex-direction: column; min-height: 380px;
}
.ai-card-header {
  display: flex; align-items: center; justify-content: space-between; padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
}
.ai-card-header > div { display: flex; align-items: center; gap: 8px; }
.dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.dot.green { background: #22c55e; }
.chat-box {
  margin-top: 16px; display: flex; flex-direction: column; gap: 10px; flex: 1; overflow: auto;
}
.bubble {
  max-width: 82%; padding: 10px 14px; border-radius: 16px; line-height: 1.8; font-size: 0.95rem;
}
.bubble.assistant { background: var(--soft); border-top-right-radius: 6px; }
.bubble.user {
  align-self: flex-end; background: linear-gradient(135deg, var(--green), var(--green-strong));
  color: white; border-top-left-radius: 6px;
}
.chat-input-row { margin-top: 16px; display: flex; gap: 10px; }
.chat-input-row input {
  flex: 1; min-width: 0; border: 1px solid var(--line); border-radius: 12px; padding: 12px 14px;
  background: #f9fbfa;
}
.chat-input-row button { background: var(--green); color: white; }

.section-block, .request-card, .dashboard-block, .project-panel {
  background: rgba(255,255,255,0.9); border: 1px solid rgba(10,61,46,0.06);
  border-radius: 24px; padding: 22px;
}
.section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
.section-head h3 { margin: 0; font-size: 1.5rem; }
.section-head a { color: var(--green); text-decoration: none; font-weight: 700; }

.service-grid {
  display: grid; grid-template-columns: repeat(4, minmax(150px, 1fr)); gap: 14px;
}
.service-card {
  background: white; border: 1px solid var(--line); border-radius: 20px; padding: 18px 12px;
  display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--text);
  transition: 0.2s ease;
}
.service-card.active {
  border-color: var(--service-accent, var(--green));
  box-shadow: 0 12px 20px rgba(10,61,46,0.08);
}
.service-card .service-icon {
  width: 52px; height: 52px; border-radius: 16px; display: grid; place-items: center;
  font-size: 1.6rem; background: color-mix(in srgb, var(--service-accent) 12%, white);
}

.request-layout { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 22px; }
.field-group { display: grid; gap: 8px; margin-bottom: 18px; }
.field-group label { font-weight: 700; }
.field-group input, .field-group select, .field-group textarea {
  width: 100%; border: 1px solid var(--line); border-radius: 12px; background: #f9fbfa; padding: 12px 14px;
}
.full { width: 100%; }

.task-list { display: grid; gap: 14px; }
.task-item {
  display: flex; justify-content: space-between; gap: 10px; background: #f8faf9; border: 1px solid var(--line);
  border-radius: 16px; padding: 14px;
}
.task-item strong, .task-item span, .task-item small, .task-item b { display: block; }
.task-item strong { margin-bottom: 6px; }
.task-item span { color: var(--muted); }
.task-state { text-align: left; }
.task-state small { color: var(--muted); margin-bottom: 6px; }

.provider-grid { display: grid; grid-template-columns: repeat(4, minmax(200px, 1fr)); gap: 16px; }
.provider-card {
  background: #f8faf9; border: 1px solid var(--line); border-radius: 20px; padding: 18px;
  display: grid; gap: 12px;
}
.provider-top { display: flex; align-items: center; gap: 12px; }
.provider-avatar {
  width: 46px; height: 46px; border-radius: 14px; background: linear-gradient(135deg, rgba(10,61,46,0.1), rgba(10,61,46,0.2));
  display: grid; place-items: center; font-weight: 700; color: var(--green);
}
.provider-top strong, .provider-top small { display: block; }
.provider-top small { color: var(--muted); margin-top: 4px; }
.provider-card p { margin: 0; color: var(--muted); line-height: 1.8; }
.provider-meta {
  display: flex; justify-content: space-between; color: var(--green); font-weight: 700;
}

.tabs { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 18px; }
.tab {
  border: 1px solid var(--line); background: white; color: var(--muted); padding: 10px 16px; border-radius: 12px;
}
.tab.active {
  background: var(--green-soft); border-color: transparent; color: var(--green); font-weight: 700;
}
.dashboard-grid { display: grid; grid-template-columns: repeat(4, minmax(150px, 1fr)); gap: 16px; }
.metric-box {
  background: #f8faf9; border: 1px solid var(--line); border-radius: 20px; padding: 20px 18px;
  display: grid; gap: 8px;
}
.metric-box span { color: var(--muted); }
.metric-box strong { font-size: 1.7rem; color: var(--green); }
.dashboard-note {
  margin-top: 18px; background: var(--soft); color: var(--green); border-radius: 16px; padding: 16px 18px;
  line-height: 1.9; font-weight: 600;
}

.project-box {
  background: linear-gradient(135deg, rgba(10,61,46,0.04), rgba(16,185,129,0.08));
  border: 1px solid rgba(10,61,46,0.06); border-radius: 20px; padding: 18px;
}
.project-metadata {
  display: grid; grid-template-columns: repeat(3, minmax(180px, 1fr)); gap: 16px; margin-bottom: 20px;
}
.project-metadata > div {
  background: white; border: 1px solid var(--line); border-radius: 14px; padding: 14px;
  display: grid; gap: 6px;
}
.project-metadata span { color: var(--muted); }
.project-metadata strong { font-size: 1.08rem; }
.project-steps { display: grid; grid-template-columns: repeat(4, minmax(120px, 1fr)); gap: 12px; }
.step {
  background: rgba(255,255,255,0.7); border: 1px solid var(--line); border-radius: 16px; padding: 16px 10px;
  text-align: center; color: var(--muted);
}
.step span {
  display: inline-grid; place-items: center; width: 28px; height: 28px; border-radius: 50%;
  background: rgba(10,61,46,0.08); font-weight: 700; color: var(--green);
}
.step p { margin: 10px 0 0; }
.step.done { background: #e9f9f0; border-color: #bfe9cf; }
.step.active { background: #eaf4ff; border-color: #bfd8ff; color: var(--green); }

@media (max-width: 980px) {
  .hero-panel, .request-layout, .service-grid, .provider-grid, .dashboard-grid, .project-metadata, .project-steps {
    grid-template-columns: 1fr;
  }
  .topbar { flex-direction: column; align-items: flex-start; gap: 12px; }
}

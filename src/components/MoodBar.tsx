import React from "react";
import type { MoodBarItem } from "../utils/moodUtils";
import "./MoodBar.css";

interface MoodBarProps {
  items?: MoodBarItem[];
  title?: string;
}

const TONE_CLS = ["", "tone-1", "tone-2", "tone-3", "tone-4", "tone-5"];

const MoodBar: React.FC<MoodBarProps> = ({
  items = [],
  title = "Mood Bar",
}) => {
  const summary = items.length ? items : [];
  if (!summary.length) return null;

  const topScore = summary.reduce(
    (best, it) => (it.percent > best.percent ? it : best),
    summary[0],
  ).score;
  const display = summary.map((it) => ({
    ...it,
    active: it.active ?? it.score === topScore,
  }));

  const totalPct = display.reduce((s, it) => s + it.percent, 0) || 1;
  const weighted = display.reduce((s, it) => s + it.score * it.percent, 0);
  const avgPct = (weighted / totalPct / 5) * 100;

  return (
    <section className="mood-bar-card">
      <div className="mood-bar-head">
        <h2>{title}</h2>
      </div>

      <div className="mood-bar-grid">
        {display.map(({ score, emoji, label, percent, active }) => (
          <div key={score} className="mood-bar-item">
            <div
              className={`mood-emoji ${TONE_CLS[score]} ${active ? "active" : ""}`}
            >
              {emoji}
            </div>
            <span className={`mood-emoji-label ${active ? "active" : ""}`}>
              {label}
            </span>
            <span className={`mood-percent ${active ? "active" : ""}`}>
              {percent}%
            </span>
          </div>
        ))}
      </div>

      <div className="mood-bar-progress-section">
        <div className="mood-progress-label">
          <span className="progress-text">ความสุขโดยรวม</span>
          <span className="progress-value">{Math.round(avgPct)}%</span>
        </div>
        <div className="mood-total-track" aria-label="Overall mood level">
          <div className="mood-total-fill" style={{ width: `${avgPct}%` }} />
        </div>
      </div>
    </section>
  );
};

export default MoodBar;

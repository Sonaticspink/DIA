import React, { useMemo } from "react";
import {
  MoodFlowPoint,
  MOOD_EMOJIS,
  calcAverage,
  getMoodEmoji,
} from "../utils/moodUtils";
import "./MoodFlow.css";

interface MoodFlowProps {
  points?: MoodFlowPoint[];
  title?: string;
}

/* ── chart config ── */
const PAD_X = 16;
const CHART_H = 140;
const PAD_Y = 14;

const clamp = (v: number) => Math.max(1, Math.min(5, v));
const toY = (level: number) =>
  CHART_H - PAD_Y - ((clamp(level) - 1) / 4) * (CHART_H - PAD_Y * 2);

type Trend = "up" | "same" | "down";
const TREND: Record<Trend, { icon: string; label: string; cls: string }> = {
  up: { icon: "↑", label: "ดีขึ้น", cls: "trend-up" },
  same: { icon: "→", label: "คงที่", cls: "trend-same" },
  down: { icon: "↓", label: "แย่ลง", cls: "trend-down" },
};

const computeTrend = (pts: MoodFlowPoint[]): Trend => {
  const mid = Math.ceil(pts.length / 2);
  const a = calcAverage(pts.slice(0, mid).map((p) => p.moodLevel));
  const b = calcAverage(pts.slice(mid).map((p) => p.moodLevel));
  if (a === null || b === null) return "same";
  const d = b - a;
  return d > 0.3 ? "up" : d < -0.3 ? "down" : "same";
};

/* ── component ── */
const MoodFlow: React.FC<MoodFlowProps> = ({ points, title = "Mood Flow" }) => {
  const pts = useMemo(() => (points?.length ? points : []), [points]);
  const avg = useMemo(() => calcAverage(pts.map((p) => p.moodLevel)), [pts]);
  const trend = useMemo(() => computeTrend(pts), [pts]);

  // Adjust spacing based on data type
  // 12 points = annual (months), 28-31 = monthly (days)
  const stepX = pts.length === 12 ? 50 : 40;
  const chartW = Math.max(300, PAD_X * 2 + (pts.length - 1) * stepX);

  const positioned = useMemo(
    () =>
      pts.map((p, i) => ({
        ...p,
        x: PAD_X + i * stepX,
        y: toY(p.moodLevel ?? avg ?? 3),
        hasData: p.moodLevel !== null,
      })),
    [pts, avg, stepX],
  );

  // build Bézier curve + area fill (skip null points)
  const { pathD, areaD } = useMemo(() => {
    if (!positioned.length) return { pathD: "", areaD: "" };

    // Helper to build path for a segment of points
    const buildSegmentPath = (segment: typeof positioned): string => {
      if (segment.length === 0) return "";
      const first = segment[0];
      let d = `M ${first.x} ${first.y}`;
      for (let i = 1; i < segment.length; i++) {
        const prev = segment[i - 1];
        const cur = segment[i];
        const cx = (prev.x + cur.x) / 2;
        d += ` C ${cx} ${prev.y}, ${cx} ${cur.y}, ${cur.x} ${cur.y}`;
      }
      return d;
    };

    const pathSegments: string[] = [];
    const areaSegments: string[] = [];
    let currentSegment: typeof positioned = [];

    for (let i = 0; i < positioned.length; i++) {
      const p = positioned[i];
      if (p.hasData) {
        currentSegment.push(p);
      } else {
        // End current segment when null is encountered
        if (currentSegment.length > 0) {
          const segPath = buildSegmentPath(currentSegment);
          pathSegments.push(segPath);
          if (currentSegment.length > 0) {
            const first = currentSegment[0];
            const last = currentSegment[currentSegment.length - 1];
            areaSegments.push(
              `${segPath} L ${last.x} ${CHART_H} L ${first.x} ${CHART_H} Z`,
            );
          }
          currentSegment = [];
        }
      }
    }

    // Handle remaining segment
    if (currentSegment.length > 0) {
      const segPath = buildSegmentPath(currentSegment);
      pathSegments.push(segPath);
      if (currentSegment.length > 0) {
        const first = currentSegment[0];
        const last = currentSegment[currentSegment.length - 1];
        areaSegments.push(
          `${segPath} L ${last.x} ${CHART_H} L ${first.x} ${CHART_H} Z`,
        );
      }
    }

    return {
      pathD: pathSegments.join(" "),
      areaD: areaSegments.join(" "),
    };
  }, [positioned]);

  if (!pts.length) {
    return (
      <section className="mood-flow-card">
        <div className="mood-flow-head">
          <h2>{title}</h2>
        </div>
        <div className="mood-flow-empty">
          <span className="mood-flow-empty-icon">📈</span>
          <p>ยังไม่มีข้อมูลในช่วงเวลานี้</p>
        </div>
      </section>
    );
  }

  const t = TREND[trend];

  return (
    <section className="mood-flow-card">
      <div className="mood-flow-head">
        <h2>{title}</h2>
        <span className="mood-flow-count">
          {pts.length === 12 ? "12 เดือน" : `${pts.length} วัน`}
        </span>
      </div>

      <div className="mood-flow-body">
        <div className="mood-flow-y-axis">
          {[5, 4, 3, 2, 1].map((lv) => (
            <span key={lv} className="mood-flow-y-label">
              {MOOD_EMOJIS[lv]}
            </span>
          ))}
        </div>

        <div className="mood-flow-scroll">
          <div className="mood-flow-canvas" style={{ width: chartW }}>
            <svg
              className="mood-flow-svg"
              viewBox={`0 0 ${chartW} ${CHART_H}`}
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#e91e63" />
                  <stop offset="100%" stopColor="#f06292" />
                </linearGradient>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f06292" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#fce4ec" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {[1, 2, 3, 4, 5].map((lv) => (
                <line
                  key={lv}
                  x1={0}
                  y1={toY(lv)}
                  x2={chartW}
                  y2={toY(lv)}
                  className="mood-flow-gridline"
                />
              ))}
              {positioned.map((p) => (
                <line
                  key={`v${p.x}`}
                  x1={p.x}
                  y1={0}
                  x2={p.x}
                  y2={CHART_H}
                  className="mood-flow-gridline-v"
                />
              ))}

              <path d={areaD} fill="url(#areaGrad)" />
              <path
                d={pathD}
                className="mood-flow-path"
                stroke="url(#lineGrad)"
              />

              {positioned
                .filter((p) => p.hasData)
                .map((p) => (
                  <g key={`p${p.x}`}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={5}
                      className="mood-flow-point-ring"
                    />
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={3.5}
                      className="mood-flow-point"
                    />
                  </g>
                ))}
            </svg>

            <div
              className="mood-flow-labels"
              style={{ paddingLeft: PAD_X, paddingRight: PAD_X }}
            >
              {pts.map((p, i) => (
                <span
                  key={i}
                  className="mood-flow-day"
                  style={{ width: stepX, textAlign: "center" }}
                >
                  {p.dateLabel}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mood-stats-section">
        <div className="mood-stats-row">
          <div className="mood-stat-box">
            <span className="mood-stat-emoji">{getMoodEmoji(avg)}</span>
            <div className="mood-stat-detail">
              <span className="mood-stat-label">อารมณ์เฉลี่ย</span>
              <span className="mood-stat-value">
                {avg !== null ? avg.toFixed(1) : "—"}
                <small> / 5</small>
              </span>
            </div>
          </div>
          <div className={`mood-stat-box ${t.cls}`}>
            <span className="mood-stat-icon">{t.icon}</span>
            <div className="mood-stat-detail">
              <span className="mood-stat-label">แนวโน้ม</span>
              <span className="mood-stat-value">{t.label}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MoodFlow;

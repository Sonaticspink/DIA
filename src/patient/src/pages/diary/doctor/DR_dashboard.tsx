import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { calendarOutline } from "ionicons/icons";
import { useParams } from "react-router-dom";
import { supabase } from "../../../supabaseClient";
import { DiaryRecord, THAI_MONTHS } from "../../../utils/moodUtils";
import "./DR_dashboard.css";

type ViewMode = "weekly" | "monthly" | "annual";

interface ChartPoint {
  label: string;
  value: number | null;
}

/** Format date as YYYY-MM-DD using LOCAL time (avoids UTC timezone shift) */
const toKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const groupByDate = (records: DiaryRecord[]) => {
  const m = new Map<string, number[]>();
  for (const r of records) {
    if (r.happiness === null) continue;
    // take only the date part (YYYY-MM-DD), works for both "2026-03-10" and "2026-03-10T..."
    const k = (r.diary_date ?? "").slice(0, 10);
    const arr = m.get(k) ?? [];
    arr.push(r.happiness);
    m.set(k, arr);
  }
  return m;
};

const avg = (nums: number[]) => nums.reduce((s, v) => s + v, 0) / nums.length;

const buildAnnualPoints = (
  records: DiaryRecord[],
  year: number,
): ChartPoint[] => {
  const g = groupByDate(records);
  return Array.from({ length: 12 }, (_, m) => {
    const days = new Date(year, m + 1, 0).getDate();
    const vals: number[] = [];
    for (let day = 1; day <= days; day++) {
      const k = toKey(new Date(year, m, day));
      (g.get(k) ?? []).forEach((v) => vals.push(v));
    }
    return {
      label: THAI_MONTHS[m].replace(".", "").slice(0, 3),
      value: vals.length ? avg(vals) : null,
    };
  });
};

const buildMonthlyPoints = (
  records: DiaryRecord[],
  year: number,
  month: number,
): ChartPoint[] => {
  const g = groupByDate(records);
  const days = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(year, month, i + 1);
    const levels = g.get(toKey(d));
    return { label: `${i + 1}`, value: levels ? avg(levels) : null };
  });
};

const THAI_DAYS = ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."];

/** Return Monday of the week that contains d */
const getMonday = (d: Date): Date => {
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const m = new Date(d);
  m.setDate(d.getDate() + diff);
  m.setHours(0, 0, 0, 0);
  return m;
};

const buildWeeklyPoints = (
  records: DiaryRecord[],
  weekStart: Date,
): ChartPoint[] => {
  const g = groupByDate(records);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const levels = g.get(toKey(d));
    return { label: THAI_DAYS[i], value: levels ? avg(levels) : null };
  });
};

/* ── inline SVG chart ── */
const PAD = { top: 20, right: 16, bottom: 28, left: 42 };
const CHART_H = 200;
const H = CHART_H + PAD.top + PAD.bottom; // 248

const toY = (v: number) => PAD.top + (1 - (v - 1) / 4) * CHART_H;

const PainChart: React.FC<{ points: ChartPoint[]; containerW?: number }> = ({
  points,
  containerW = 0,
}) => {
  const isAnnual = points.length === 12; // only true for 12-month annual view
  const n = Math.max(points.length - 1, 1);

  /* always fill the container; fall back to a reasonable min when width unknown */
  const minStep = isAnnual ? 40 : 20;
  const step =
    containerW > 0
      ? Math.max((containerW - PAD.left - PAD.right) / n, minStep)
      : isAnnual
        ? 60
        : minStep;

  const W =
    containerW > 0
      ? Math.max(containerW, PAD.left + PAD.right + n * step)
      : PAD.left + PAD.right + n * step;

  /* fixed dot/line size — same across all view modes */
  const dotR = 5;
  const lineW = 2.5;

  const xs = useMemo(
    () => points.map((_, i) => PAD.left + i * step),
    [points, step],
  );

  const validSegs = useMemo(() => {
    const segs: { x: number; y: number }[][] = [];
    let cur: { x: number; y: number }[] = [];
    points.forEach((p, i) => {
      if (p.value !== null) {
        cur.push({ x: xs[i], y: toY(p.value) });
      } else if (cur.length) {
        segs.push(cur);
        cur = [];
      }
    });
    if (cur.length) segs.push(cur);
    return segs;
  }, [points, xs]);

  const pathFor = (seg: { x: number; y: number }[]) => {
    if (!seg.length) return "";
    let d = `M ${seg[0].x} ${seg[0].y}`;
    for (let i = 1; i < seg.length; i++) {
      const cx = (seg[i - 1].x + seg[i].x) / 2;
      d += ` C ${cx} ${seg[i - 1].y}, ${cx} ${seg[i].y}, ${seg[i].x} ${seg[i].y}`;
    }
    return d;
  };

  const areaFor = (seg: { x: number; y: number }[], pathD: string) => {
    if (seg.length < 1) return "";
    return `${pathD} L ${seg[seg.length - 1].x} ${H} L ${seg[0].x} ${H} Z`;
  };

  const yLevels = [5, 4, 3, 2, 1];
  const yLabels: Record<number, string> = {
    5: "ดีมาก",
    4: "ดี",
    3: "ปกติ",
    2: "แย่",
    1: "แย่มาก",
  };

  /* show x-label every N steps so labels don't overlap (min ~28px apart) */
  const labelEvery = Math.ceil(28 / Math.max(step, 1));
  const showLabel = (i: number) => {
    if (i === 0 || i === points.length - 1) return true;
    return (i + 1) % labelEvery === 0;
  };

  const totalAvg = useMemo(() => {
    const vals = points
      .map((p) => p.value)
      .filter((v): v is number => v !== null);
    return vals.length ? avg(vals) : null;
  }, [points]);

  const PAIN_5 = [
    "",
    "เจ็บมากที่สุด",
    "เจ็บมาก",
    "ปานกลาง",
    "เจ็บน้อย",
    "ไม่เจ็บ",
  ];

  return (
    <div className="dr-chart-wrap">
      <div className="dr-chart-scroll">
        <svg
          width={W || undefined}
          height={H}
          viewBox={`0 0 ${W || 718} ${H}`}
          className="dr-chart-svg"
        >
          <defs>
            <linearGradient id="dcLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e91e63" />
              <stop offset="100%" stopColor="#f06292" />
            </linearGradient>
            <linearGradient id="dcAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f06292" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#fce4ec" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* zone backgrounds */}
          <rect
            x={PAD.left}
            y={toY(5)}
            width={W - PAD.left - PAD.right}
            height={toY(4) - toY(5)}
            fill="#e8f5e9"
            opacity="0.7"
          />
          <rect
            x={PAD.left}
            y={toY(4)}
            width={W - PAD.left - PAD.right}
            height={toY(3) - toY(4)}
            fill="#fffde7"
            opacity="0.7"
          />
          <rect
            x={PAD.left}
            y={toY(3)}
            width={W - PAD.left - PAD.right}
            height={toY(2) - toY(3)}
            fill="#fff3e0"
            opacity="0.7"
          />
          <rect
            x={PAD.left}
            y={toY(2)}
            width={W - PAD.left - PAD.right}
            height={toY(1) - toY(2)}
            fill="#fce4ec"
            opacity="0.7"
          />

          {/* grid lines */}
          {yLevels.map((lv) => (
            <line
              key={lv}
              x1={PAD.left}
              y1={toY(lv)}
              x2={W - PAD.right}
              y2={toY(lv)}
              stroke="#f0e0ea"
              strokeWidth="1"
              strokeDasharray="4 3"
            />
          ))}

          {/* y-axis labels */}
          {yLevels.map((lv) => (
            <text
              key={`y${lv}`}
              x={PAD.left - 6}
              y={toY(lv) + 5}
              textAnchor="end"
              fontSize="13"
              fontWeight="600"
              fill="#a0789a"
            >
              {lv}
            </text>
          ))}

          {/* area + line */}
          {validSegs.map((seg, si) => {
            const pd = pathFor(seg);
            return (
              <g key={si}>
                <path d={areaFor(seg, pd)} fill="url(#dcAreaGrad)" />
                <path
                  d={pd}
                  fill="none"
                  stroke="url(#dcLineGrad)"
                  strokeWidth={lineW}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {seg.map((pt, pi) => (
                  <circle
                    key={pi}
                    cx={pt.x}
                    cy={pt.y}
                    r={dotR}
                    fill="#fff"
                    stroke="#e91e63"
                    strokeWidth={isAnnual ? 2.5 : 3}
                  />
                ))}
              </g>
            );
          })}

          {/* x-axis labels inside SVG — always aligned with chart */}
          {points.map((p, i) =>
            isAnnual || showLabel(i) ? (
              <text
                key={`xl${i}`}
                x={xs[i]}
                y={H - 6}
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                fill="#a0789a"
              >
                {p.label}
              </text>
            ) : null,
          )}
        </svg>
      </div>

      {/* legend */}
      <div className="dr-chart-legend">
        {[5, 3, 1].map((lv) => (
          <span key={lv} className="dr-legend-item">
            <i
              style={{
                background:
                  lv >= 4 ? "#5cb85c" : lv === 3 ? "#f0ad4e" : "#d9534f",
              }}
            />
            {lv} = {yLabels[lv]}
          </span>
        ))}
      </div>

      {/* stat cards */}
      <div className="dr-stat-row">
        <div className="dr-stat-card">
          <span className="dr-stat-label">ค่าเฉลี่ย</span>
          <span className="dr-stat-value">
            {totalAvg !== null ? totalAvg.toFixed(1) : "–"}
            <small> / 5</small>
          </span>
          <span className="dr-stat-sub">
            {totalAvg !== null ? PAIN_5[Math.round(totalAvg)] : "ไม่มีข้อมูล"}
          </span>
        </div>
        <div className="dr-stat-card">
          <span className="dr-stat-label">จำนวนวันที่บันทึก</span>
          <span className="dr-stat-value">
            {points.filter((p) => p.value !== null).length}
            <small> วัน</small>
          </span>
          <span className="dr-stat-sub">จากทั้งหมด {points.length} วัน</span>
        </div>
      </div>
    </div>
  );
};

/* ── main page ── */
const DRDashboard: React.FC = () => {
  const { patientId } = useParams<{ patientId?: string }>();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<DiaryRecord[]>([]);
  const [patientName, setPatientName] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("monthly");
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [tempMonth, setTempMonth] = useState(new Date().getMonth());
  const [tempYear, setTempYear] = useState(new Date().getFullYear());

  /* measure dr-dash-main width to pass into PainChart for annual fit */
  const mainRef = useRef<HTMLDivElement>(null);
  const [mainW, setMainW] = useState(0);
  useLayoutEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0) setMainW(rect.width);
    };
    measure();
    const obs = new ResizeObserver(measure);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* card inner width = mainW - card padding (14px * 2 sides = 28px conservative) */
  const chartContainerW = mainW > 0 ? mainW - 32 : 0;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (patientId) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", patientId)
          .single();
        if (profile)
          setPatientName(`${profile.first_name} ${profile.last_name}`);

        const { data, error } = await supabase
          .from("diary")
          .select("diary_date, happiness")
          .eq("user_id", patientId)
          .order("diary_date", { ascending: true });
        if (!error && data) {
          setRecords(data);
          setLoading(false);
          return;
        }
      }
      const { data } = await supabase
        .from("diary")
        .select("diary_date, happiness")
        .order("diary_date", { ascending: true });
      setRecords(data ?? []);
      setLoading(false);
    };
    load();
  }, [patientId]);

  const openPicker = useCallback(() => {
    if (viewMode === "weekly") return; // use arrows for weekly
    setTempMonth(selectedDate.getMonth());
    setTempYear(selectedDate.getFullYear());
    setShowPicker(true);
  }, [selectedDate, viewMode]);

  const applySelection = useCallback(() => {
    const d = new Date(selectedDate);
    d.setMonth(tempMonth);
    d.setFullYear(tempYear);
    setSelectedDate(d);
    setShowPicker(false);
  }, [tempMonth, tempYear, selectedDate]);

  const navigate = useCallback(
    (delta: number) => {
      setSelectedDate((prev) => {
        const d = new Date(prev);
        if (viewMode === "weekly") d.setDate(d.getDate() + delta * 7);
        else if (viewMode === "monthly") d.setMonth(d.getMonth() + delta);
        else d.setFullYear(d.getFullYear() + delta);
        return d;
      });
    },
    [viewMode],
  );

  const points = useMemo(() => {
    if (viewMode === "annual")
      return buildAnnualPoints(records, selectedDate.getFullYear());
    if (viewMode === "weekly")
      return buildWeeklyPoints(records, getMonday(selectedDate));
    return buildMonthlyPoints(
      records,
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
    );
  }, [viewMode, records, selectedDate]);

  const periodLabel = useMemo(() => {
    const y = selectedDate.getFullYear() + 543;
    if (viewMode === "annual") return `ปี ${y}`;
    if (viewMode === "weekly") {
      const mon = getMonday(selectedDate);
      const sun = new Date(mon);
      sun.setDate(mon.getDate() + 6);
      const shortMonth = (d: Date) =>
        THAI_MONTHS[d.getMonth()].replace(".", "").slice(0, 3);
      if (mon.getMonth() === sun.getMonth())
        return `${mon.getDate()}-${sun.getDate()} ${shortMonth(mon)} ${y}`;
      return `${mon.getDate()} ${shortMonth(mon)} - ${sun.getDate()} ${shortMonth(sun)} ${y}`;
    }
    return `${THAI_MONTHS[selectedDate.getMonth()]} ${y}`;
  }, [selectedDate, viewMode]);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="dr-dash-toolbar">
          <IonButtons slot="start">
            <IonBackButton
              text="ย้อนกลับ"
              defaultHref="/doctor-dashboard"
              className="dr-dash-back"
            />
          </IonButtons>
          <IonTitle className="dr-dash-title">กราฟความเจ็บปวด</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="dr-dash-content ion-padding">
        <div className="dr-dash-inner">
          {/* ── left panel: controls ── */}
          <div className="dr-dash-sidebar">
            {patientName && (
              <p className="dr-dash-patient-name">
                คนไข้: <strong>{patientName}</strong>
              </p>
            )}

            <div className="report-mode-tabs">
              {(["weekly", "monthly", "annual"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={viewMode === mode ? "active" : ""}
                  onClick={() => setViewMode(mode)}
                >
                  {mode === "weekly"
                    ? "รายสัปดาห์"
                    : mode === "monthly"
                      ? "รายเดือน"
                      : "รายปี"}
                </button>
              ))}
            </div>

            <div className="report-period-selector">
              <button
                className="period-nav-btn"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                ‹
              </button>
              <div className="report-period" onClick={openPicker}>
                <IonIcon icon={calendarOutline} className="period-icon" />
                <span>{periodLabel}</span>
              </div>
              <button
                className="period-nav-btn"
                onClick={() => navigate(1)}
                disabled={loading}
              >
                ›
              </button>
            </div>
          </div>

          {/* ── right panel: chart ── */}
          <div className="dr-dash-main" ref={mainRef}>
            {loading ? (
              <div className="dr-dash-loading">
                <IonSpinner name="crescent" />
              </div>
            ) : (
              <div className="dr-dash-card">
                <p className="dr-dash-card-title">ระดับความสุขของคนไข้</p>
                <PainChart points={points} containerW={chartContainerW} />
              </div>
            )}
          </div>
        </div>

        <IonModal
          isOpen={showPicker}
          onDidDismiss={() => setShowPicker(false)}
          className="date-picker-modal-wrapper"
        >
          <div className="date-picker-modal">
            <h3 className="picker-title">เลือกช่วงเวลา</h3>
            <div className="picker-content">
              {viewMode === "monthly" && (
                <div className="picker-row">
                  <select
                    className="picker-select"
                    value={tempMonth}
                    onChange={(e) => setTempMonth(Number(e.target.value))}
                  >
                    {THAI_MONTHS.map((name, i) => (
                      <option key={i} value={i}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <div className="picker-underline" />
                </div>
              )}
              <div className="picker-row">
                <select
                  className="picker-select"
                  value={tempYear}
                  onChange={(e) => setTempYear(Number(e.target.value))}
                >
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() - 5 + i;
                    return (
                      <option key={year} value={year}>
                        {year + 543}
                      </option>
                    );
                  })}
                </select>
                <div className="picker-underline" />
              </div>
            </div>
            <div className="picker-actions">
              <button
                className="picker-btn picker-btn-cancel"
                onClick={() => setShowPicker(false)}
              >
                ยกเลิก
              </button>
              <button
                className="picker-btn picker-btn-ok"
                onClick={applySelection}
              >
                ตกลง
              </button>
            </div>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default DRDashboard;

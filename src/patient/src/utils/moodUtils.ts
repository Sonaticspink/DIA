/** Shared types, constants, and mapping functions for mood components */

/* ── Types ── */
export interface DiaryRecord {
  diary_date: string;
  happiness: number | null;
}

export interface MoodFlowPoint {
  dateLabel: string;
  moodLevel: number | null;
}

export interface MoodBarItem {
  score: number;
  emoji: string;
  label: string;
  percent: number;
  active?: boolean;
}

/* ── Constants ── */
export const MOOD_EMOJIS: Record<number, string> = {
  5: "😀",
  4: "🙂",
  3: "😐",
  2: "🙁",
  1: "😞",
};

export const MOOD_CATALOG: ReadonlyArray<{
  score: number;
  emoji: string;
  label: string;
}> = [
  { score: 5, emoji: "😀", label: "ดีมาก" },
  { score: 4, emoji: "🙂", label: "ดี" },
  { score: 3, emoji: "😐", label: "เฉยๆ" },
  { score: 2, emoji: "🙁", label: "ไม่ดี" },
  { score: 1, emoji: "😞", label: "แย่" },
];

export const THAI_MONTHS = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
] as const;

/* ── Helpers ── */
export const calcAverage = (values: (number | null)[]): number | null => {
  const valid = values.filter((v): v is number => v !== null);
  return valid.length ? valid.reduce((s, v) => s + v, 0) / valid.length : null;
};

export const getMoodEmoji = (avg: number | null): string => {
  if (avg === null) return "—";
  const rounded = Math.round(avg);
  return MOOD_EMOJIS[Math.max(1, Math.min(5, rounded))] ?? "😐";
};

/* ── Mapping functions ── */
// For daily view (monthly mode) - shows all days in selected month
export const mapRecordsToMoodFlowPoints = (
  records: DiaryRecord[],
  year: number,
  month: number,
): MoodFlowPoint[] => {
  // Group records by date
  const grouped = new Map<string, number[]>();

  for (const r of records) {
    if (r.happiness === null) continue;
    const key = r.diary_date?.split("T")[0] ?? r.diary_date;
    const arr = grouped.get(key) ?? [];
    arr.push(r.happiness);
    grouped.set(key, arr);
  }

  // Get number of days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Generate all days in the month
  const result: MoodFlowPoint[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const dateKey = d.toISOString().split("T")[0];
    const levels = grouped.get(dateKey);

    result.push({
      dateLabel: `${month + 1}/${day}`,
      moodLevel: levels
        ? levels.reduce((s, l) => s + l, 0) / levels.length
        : null,
    });
  }

  return result;
};

// For annual view - shows 12 months
export const mapRecordsToMoodFlowPointsAnnual = (
  records: DiaryRecord[],
  year: number,
): MoodFlowPoint[] => {
  // Group records by month
  const grouped = new Map<number, number[]>();

  for (const r of records) {
    if (r.happiness === null) continue;
    const d = new Date(r.diary_date);
    if (d.getFullYear() === year) {
      const month = d.getMonth();
      const arr = grouped.get(month) ?? [];
      arr.push(r.happiness);
      grouped.set(month, arr);
    }
  }

  // Generate all 12 months
  const result: MoodFlowPoint[] = [];
  for (let month = 0; month < 12; month++) {
    const levels = grouped.get(month);
    result.push({
      dateLabel: String(month + 1),
      moodLevel: levels
        ? levels.reduce((s, l) => s + l, 0) / levels.length
        : null,
    });
  }

  return result;
};

const FALLBACK_ITEMS: MoodBarItem[] = MOOD_CATALOG.map((m, i) => ({
  ...m,
  percent: [10, 20, 40, 10, 20][i],
  active: i === 2,
}));

export const mapRecordsToMoodBarItems = (
  records: DiaryRecord[],
): MoodBarItem[] => {
  const scores = records
    .map((r) => r.happiness)
    .filter((s): s is number => s !== null && s >= 1 && s <= 5);

  if (!scores.length) return FALLBACK_ITEMS;

  const total = scores.length;
  return MOOD_CATALOG.map((mood) => ({
    ...mood,
    percent: Math.round(
      (scores.filter((s) => s === mood.score).length / total) * 100,
    ),
    active: false,
  }));
};

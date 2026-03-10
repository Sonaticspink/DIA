import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import {
  calendarOutline,
  chevronBackOutline,
  chevronForwardOutline,
  checkmarkOutline,
  closeOutline,
  refreshOutline,
  statsChartOutline,
} from "ionicons/icons";
import { useHistory, useParams } from "react-router-dom";
import { supabase } from "../../../supabaseClient";
import "./DR_PatientDetail.css";

interface DiaryRecord {
  id: number | string;
  diary_date: string;
  hobby: string | null;
  symptoms: string | null;
  food: string | number | null;
  painscore: number | null;
  happiness: number | null;
}

interface CalendarCell {
  key: string;
  dayNumber: number;
  inCurrentMonth: boolean;
}

type DayStatus = "none" | "good" | "bad";

const SELECT_COLUMNS =
  "id, diary_date, hobby, symptoms, food, painscore, happiness";
const THAI_WEEKDAYS = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."] as const;
const MONTH_PICKER_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;
const THAI_MONTHS_SHORT = [
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
const PAIN_LABELS: Record<number, string> = {
  0: "ไม่เจ็บ",
  1: "เจ็บน้อย",
  2: "ปานกลาง",
  3: "เจ็บมาก",
  4: "เจ็บมากที่สุด",
};
const HAPPINESS_LABELS: Record<number, string> = {
  1: "แย่",
  2: "ไม่ค่อยดี",
  3: "ปกติ",
  4: "ดี",
  5: "ดีมาก",
};
const STATUS_LABELS: Record<DayStatus, string> = {
  good: "ปกติ",
  bad: "ควรติดตาม",
  none: "ไม่มีบันทึก",
};

const toDateKey = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

const fromDateKey = (key: string): Date => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const normalizeDateKey = (value: string): string => value.split("T")[0];

const getDayStatus = (record?: DiaryRecord): DayStatus => {
  if (!record) return "none";
  return (record.painscore ?? 0) >= 3 || (record.happiness ?? 3) <= 2
    ? "bad"
    : "good";
};

const formatThaiMonth = (date: Date): string =>
  `${THAI_MONTHS_SHORT[date.getMonth()]} ${date.getFullYear() + 543}`;

const formatThaiFullDate = (key: string): string =>
  fromDateKey(key).toLocaleDateString("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const buildCalendarCells = (monthStart: Date): CalendarCell[] => {
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const targetCells = firstDay + daysInMonth > 35 ? 42 : 35;
  const cells: CalendarCell[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    cells.push({
      key: toDateKey(new Date(year, month - 1, day)),
      dayNumber: day,
      inCurrentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      key: toDateKey(new Date(year, month, day)),
      dayNumber: day,
      inCurrentMonth: true,
    });
  }

  for (let day = 1; cells.length < targetCells; day++) {
    cells.push({
      key: toDateKey(new Date(year, month + 1, day)),
      dayNumber: day,
      inCurrentMonth: false,
    });
  }

  return cells;
};

const toMapByDate = (records: DiaryRecord[]): Record<string, DiaryRecord> =>
  records.reduce(
    (acc, record) => {
      acc[normalizeDateKey(record.diary_date)] = record;
      return acc;
    },
    {} as Record<string, DiaryRecord>,
  );

const fetchDiaryRecords = async (
  patientId?: string,
): Promise<DiaryRecord[]> => {
  if (patientId) {
    const filtered = await supabase
      .from("diary")
      .select(SELECT_COLUMNS)
      .eq("user_id", patientId)
      .order("diary_date", { ascending: true });
    if (!filtered.error) return (filtered.data as DiaryRecord[] | null) ?? [];
  }

  const fallback = await supabase
    .from("diary")
    .select(SELECT_COLUMNS)
    .order("diary_date", { ascending: true });
  if (fallback.error) throw fallback.error;
  return (fallback.data as DiaryRecord[] | null) ?? [];
};

const DRPatientDetail: React.FC = () => {
  const { patientId } = useParams<{ patientId?: string }>();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [recordsByDate, setRecordsByDate] = useState<
    Record<string, DiaryRecord>
  >({});
  const [focusedMonth, setFocusedMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDateKey, setSelectedDateKey] = useState(toDateKey(new Date()));
  const [showPicker, setShowPicker] = useState(false);
  const [tempMonth, setTempMonth] = useState(new Date().getMonth());
  const [tempYear, setTempYear] = useState(new Date().getFullYear());

  const loadDiaryRecords = useCallback(async () => {
    setLoading(true);
    setErrorText("");
    try {
      const records = await fetchDiaryRecords(patientId);
      setRecordsByDate(toMapByDate(records));
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    loadDiaryRecords();
  }, [loadDiaryRecords]);

  const calendarCells = useMemo(
    () => buildCalendarCells(focusedMonth),
    [focusedMonth],
  );
  const selectedRecord = recordsByDate[selectedDateKey];
  const selectedStatus = getDayStatus(selectedRecord);
  const yearOptions = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 10 + i),
    [],
  );

  const { monthRecordedCount, monthBadCount } = useMemo(
    () =>
      calendarCells.reduce(
        (acc, cell) => {
          if (!cell.inCurrentMonth) return acc;
          const status = getDayStatus(recordsByDate[cell.key]);
          if (status !== "none") acc.monthRecordedCount += 1;
          if (status === "bad") acc.monthBadCount += 1;
          return acc;
        },
        { monthRecordedCount: 0, monthBadCount: 0 },
      ),
    [calendarCells, recordsByDate],
  );

  const detailItems = useMemo(() => {
    if (!selectedRecord) return [];
    return [
      { label: "งานอดิเรก", value: selectedRecord.hobby || "-" },
      { label: "ลักษณะอาการ", value: selectedRecord.symptoms || "-" },
      { label: "อาหารที่รับประทาน", value: selectedRecord.food || "-" },
      {
        label: "ความเจ็บปวด",
        value:
          selectedRecord.painscore === null
            ? "-"
            : `${selectedRecord.painscore} - ${PAIN_LABELS[selectedRecord.painscore] || "-"}`,
      },
      {
        label: "ระดับความสุข",
        value:
          selectedRecord.happiness === null
            ? "-"
            : `${selectedRecord.happiness} - ${HAPPINESS_LABELS[selectedRecord.happiness] || "-"}`,
        full: true,
      },
    ];
  }, [selectedRecord]);

  const goToMonth = (delta: number) => {
    setFocusedMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1),
    );
  };

  const onSelectDay = (cell: CalendarCell) => {
    setSelectedDateKey(cell.key);
    if (cell.inCurrentMonth) return;
    const date = fromDateKey(cell.key);
    setFocusedMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  const openPicker = () => {
    setTempMonth(focusedMonth.getMonth());
    setTempYear(focusedMonth.getFullYear());
    setShowPicker(true);
  };

  const applyPickerSelection = () => {
    const monthStart = new Date(tempYear, tempMonth, 1);
    setFocusedMonth(monthStart);
    setSelectedDateKey(toDateKey(monthStart));
    setShowPicker(false);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="dr-patient-detail-toolbar">
          <IonButtons slot="start">
            <IonBackButton
              text="ย้อนกลับ"
              defaultHref="/doctor-dashboard"
              className="dr-back-button"
            />
          </IonButtons>
          <IonTitle className="dr-page-title">การบันทึก</IonTitle>
          <IonButtons slot="end">
            <button
              className="dr-chart-btn"
              onClick={() =>
                history.push(
                  patientId
                    ? `/doctor/pain-chart/${patientId}`
                    : "/doctor/pain-chart",
                )
              }
            >
              <IonIcon icon={statsChartOutline} />
              <span>กราฟ</span>
            </button>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="dr-patient-detail-content ion-padding">
        {loading ? (
          <div className="dr-loading">
            <IonSpinner name="crescent" />
          </div>
        ) : (
          <>
            <section className="dr-daily-sheet">
              <div className="dr-month-switcher">
                <button
                  type="button"
                  className="dr-round-nav"
                  onClick={() => goToMonth(-1)}
                  aria-label="เดือนก่อนหน้า"
                >
                  <IonIcon icon={chevronBackOutline} />
                </button>

                <button
                  type="button"
                  className="dr-month-chip"
                  onClick={openPicker}
                  aria-label="เลือกเดือนและปี"
                >
                  <IonIcon
                    icon={calendarOutline}
                    className="dr-month-chip-icon"
                  />
                  <span>{formatThaiMonth(focusedMonth)}</span>
                </button>

                <button
                  type="button"
                  className="dr-round-nav"
                  onClick={() => goToMonth(1)}
                  aria-label="เดือนถัดไป"
                >
                  <IonIcon icon={chevronForwardOutline} />
                </button>
              </div>

              <div className="dr-weekdays">
                {THAI_WEEKDAYS.map((weekday) => (
                  <span key={weekday}>{weekday}</span>
                ))}
              </div>

              <div className="dr-calendar-grid">
                {calendarCells.map((cell) => {
                  const status = getDayStatus(recordsByDate[cell.key]);
                  const icon =
                    status === "good" ? checkmarkOutline : closeOutline;
                  return (
                    <button
                      key={cell.key}
                      type="button"
                      onClick={() => onSelectDay(cell)}
                      className={`dr-day-cell ${cell.inCurrentMonth ? "" : "muted"}`}
                    >
                      <span
                        className={`dr-day-circle ${status} ${cell.key === selectedDateKey ? "selected" : ""}`}
                      >
                        {status !== "none" && <IonIcon icon={icon} />}
                      </span>
                      <span className="dr-day-number">{cell.dayNumber}</span>
                    </button>
                  );
                })}
              </div>

              <div className="dr-legend">
                {[
                  { cls: "good", text: "มีบันทึกปกติ" },
                  { cls: "bad", text: "มีบันทึกที่ต้องติดตาม" },
                  { cls: "none", text: "ไม่มีบันทึก" },
                ].map((item) => (
                  <span key={item.cls}>
                    <i className={item.cls} />
                    {item.text}
                  </span>
                ))}
              </div>

              <div className="dr-month-summary">
                <div>
                  <strong>{monthRecordedCount}</strong>
                  <small>วันมีบันทึก</small>
                </div>
                <div>
                  <strong>{monthBadCount}</strong>
                  <small>วันควรติดตาม</small>
                </div>
              </div>
            </section>

            <IonModal
              isOpen={showPicker}
              onDidDismiss={() => setShowPicker(false)}
              className="dr-date-picker-modal-wrapper"
            >
              <div className="dr-date-picker-modal">
                <h3 className="dr-picker-title">Select date</h3>
                <div className="dr-picker-content">
                  <div className="dr-picker-row">
                    <select
                      className="dr-picker-select"
                      value={tempMonth}
                      onChange={(e) => setTempMonth(Number(e.target.value))}
                    >
                      {MONTH_PICKER_LABELS.map((month, index) => (
                        <option key={month} value={index}>
                          {month}
                        </option>
                      ))}
                    </select>
                    <div className="dr-picker-underline" />
                  </div>

                  <div className="dr-picker-row">
                    <select
                      className="dr-picker-select"
                      value={tempYear + 543}
                      onChange={(e) =>
                        setTempYear(Number(e.target.value) - 543)
                      }
                    >
                      {yearOptions.map((year) => (
                        <option key={year} value={year + 543}>
                          {year + 543}
                        </option>
                      ))}
                    </select>
                    <div className="dr-picker-underline" />
                  </div>
                </div>

                <div className="dr-picker-actions">
                  <button
                    type="button"
                    className="dr-picker-btn dr-picker-btn-cancel"
                    onClick={() => setShowPicker(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="dr-picker-btn dr-picker-btn-ok"
                    onClick={applyPickerSelection}
                  >
                    OK
                  </button>
                </div>
              </div>
            </IonModal>

            <section className="dr-daily-detail">
              <div className="dr-detail-head">
                <h3>การบันทึกของแต่ละวัน</h3>
                <span className={`status-pill ${selectedStatus}`}>
                  {STATUS_LABELS[selectedStatus]}
                </span>
              </div>
              <p className="dr-detail-date">
                {formatThaiFullDate(selectedDateKey)}
              </p>

              {selectedRecord ? (
                <div className="dr-detail-grid">
                  {detailItems.map((item) => (
                    <div
                      key={item.label}
                      className={`dr-detail-item ${item.full ? "full" : ""}`.trim()}
                    >
                      <label>{item.label}</label>
                      <p>{item.value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dr-empty-detail">
                  <IonIcon icon={refreshOutline} />
                  <p>ยังไม่มีข้อมูลบันทึกในวันที่เลือก</p>
                </div>
              )}
            </section>

            {errorText && (
              <p className="dr-error-text">โหลดข้อมูลไม่สำเร็จ: {errorText}</p>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default DRPatientDetail;

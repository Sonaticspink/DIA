import { IonContent, IonPage, IonIcon, IonModal } from "@ionic/react";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import DiaryNavBar from "../../components/DiaryNavBar";
import DiaryHeader from "../../components/DiaryHeader";
import MoodFlow from "../../components/MoodFlow";
import MoodBar from "../../components/MoodBar";
import { supabase } from "../../supabaseClient";
import { calendarOutline } from "ionicons/icons";
import {
  DiaryRecord,
  THAI_MONTHS,
  mapRecordsToMoodFlowPoints,
  mapRecordsToMoodFlowPointsAnnual,
  mapRecordsToMoodBarItems,
} from "../../utils/moodUtils";
import "./Report.css";

type ViewMode = "monthly" | "annual";

const Report: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<DiaryRecord[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("monthly");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [tempMonth, setTempMonth] = useState(new Date().getMonth());
  const [tempYear, setTempYear] = useState(new Date().getFullYear());

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("diary")
        .select("diary_date, happiness")
        .order("diary_date", { ascending: true });
      if (error) console.error("Fetch error:", error.message);
      setRecords(data ?? []);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const y = selectedDate.getFullYear(),
      m = selectedDate.getMonth();
    return records.filter((r) => {
      const d = new Date(r.diary_date);
      return (
        d.getFullYear() === y && (viewMode === "annual" || d.getMonth() === m)
      );
    });
  }, [records, selectedDate, viewMode]);

  const flowPoints = useMemo(
    () =>
      viewMode === "monthly"
        ? mapRecordsToMoodFlowPoints(
            records,
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
          )
        : mapRecordsToMoodFlowPointsAnnual(records, selectedDate.getFullYear()),
    [viewMode, records, selectedDate],
  );
  const barItems = useMemo(
    () => mapRecordsToMoodBarItems(filtered),
    [filtered],
  );

  const displayDate = useMemo(() => {
    const y = selectedDate.getFullYear() + 543;
    return viewMode === "monthly"
      ? `${THAI_MONTHS[selectedDate.getMonth()]} ${y}`
      : `ปี ${y}`;
  }, [selectedDate, viewMode]);

  const navigate = useCallback(
    (delta: number) => {
      setSelectedDate((prev) => {
        const d = new Date(prev);
        if (viewMode === "monthly") {
          d.setMonth(d.getMonth() + delta);
        } else {
          d.setFullYear(d.getFullYear() + delta);
        }
        return d;
      });
    },
    [viewMode],
  );

  const openPicker = useCallback(() => {
    setTempMonth(selectedDate.getMonth());
    setTempYear(selectedDate.getFullYear());
    setShowPicker(true);
  }, [selectedDate]);

  const applySelection = useCallback(() => {
    const d = new Date(selectedDate);
    d.setMonth(tempMonth);
    d.setFullYear(tempYear);
    setSelectedDate(d);
    setShowPicker(false);
  }, [tempMonth, tempYear, selectedDate]);

  return (
    <IonPage>
      <DiaryHeader />
      <IonContent className="report-content">
        <h1 className="report-title">📊 รายงานอารมณ์</h1>

        <div className="report-mode-tabs">
          {(["monthly", "annual"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              className={viewMode === mode ? "active" : ""}
              onClick={() => setViewMode(mode)}
            >
              {mode === "monthly" ? "รายเดือน" : "รายปี"}
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
            <span>{displayDate}</span>
          </div>
          <button
            className="period-nav-btn"
            onClick={() => navigate(1)}
            disabled={loading}
          >
            ›
          </button>
        </div>

        <IonModal
          isOpen={showPicker}
          onDidDismiss={() => setShowPicker(false)}
          className="date-picker-modal-wrapper"
        >
          <div className="date-picker-modal">
            <h3 className="picker-title">Select date</h3>
            <div className="picker-content">
              {viewMode === "monthly" && (
                <div className="picker-row">
                  <select
                    className="picker-select"
                    value={tempMonth}
                    onChange={(e) => setTempMonth(Number(e.target.value))}
                  >
                    {[
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
                    ].map((month, i) => (
                      <option key={i} value={i}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <div className="picker-underline"></div>
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
                <div className="picker-underline"></div>
              </div>
            </div>
            <div className="picker-actions">
              <button
                className="picker-btn picker-btn-cancel"
                onClick={() => setShowPicker(false)}
              >
                Cancel
              </button>
              <button
                className="picker-btn picker-btn-ok"
                onClick={applySelection}
              >
                OK
              </button>
            </div>
          </div>
        </IonModal>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>กำลังโหลดข้อมูล...</p>
          </div>
        ) : !filtered.length ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <h3>ยังไม่มีข้อมูลในช่วงเวลานี้</h3>
            <p>เริ่มบันทึกไดอารี่ของคุณเพื่อดูรายงานอารมณ์</p>
          </div>
        ) : (
          <>
            <div className="data-summary">
              <div className="summary-item">
                <span className="summary-label">จำนวนบันทึก</span>
                <span className="summary-value">{filtered.length}</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-item">
                <span className="summary-label">ระยะเวลา</span>
                <span className="summary-value">
                  {viewMode === "monthly" ? "30 วัน" : "365 วัน"}
                </span>
              </div>
            </div>

            <MoodFlow points={flowPoints} />
            <div className="report-section-divider" />
            <MoodBar items={barItems} />
          </>
        )}
      </IonContent>
      <DiaryNavBar />
    </IonPage>
  );
};

export default Report;

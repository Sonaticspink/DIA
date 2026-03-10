import React, { useEffect, useState } from "react";
import { IonPage, IonContent } from "@ionic/react";
import { supabase } from "../../supabaseClient";
import "./History.css";
import HistoryCard, { DiaryEntry } from "../../components/HistoryCard";
import DiaryNavBar from "../../components/DiaryNavBar";
import DiaryHeader from "../../components/DiaryHeader";

const History: React.FC = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const fetchHistory = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("diary")
      .select("*")
      .order("diary_date", { ascending: false });

    if (error) {
      console.error("Error fetching diary history:", error.message);
      return;
    }

    setDiaryEntries(data);

    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [diaryEntries]);

  const totalPages = Math.ceil(diaryEntries.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const currentEntries = diaryEntries.slice(startIndex, endIndex);

  return (
    <IonPage>
      {/* ===== Header ===== */}
      <DiaryHeader />

      <IonContent
        className="history-content ion-padding"
        fullscreen
        style={{ paddingBottom: 90 }}
      >
        <div className="history-header-section">
          <h1 className="history-title">ประวัติการบันทึก</h1>
        </div>

        <div className="history-list">
          {loading ? (
            <p className="loading-text">กำลังโหลดข้อมูล...</p>
          ) : diaryEntries.length === 0 ? (
            <p className="no-entries-text">ไม่มีบันทึกในขณะนี้</p>
          ) : (
            currentEntries.map((entry) => (
              <HistoryCard key={entry.id} entry={entry} />
            ))
          )}
        </div>
        {!loading && diaryEntries.length > ITEMS_PER_PAGE && (
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              ◀ ก่อนหน้า
            </button>

            <span>
              หน้า {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              ถัดไป ▶
            </button>
          </div>
        )}
      </IonContent>

      {/* ===== Bottom Navigation ===== */}
      <DiaryNavBar />
    </IonPage>
  );
};

export default History;

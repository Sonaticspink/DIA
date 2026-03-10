import React, { useEffect, useState } from "react";
import { IonPage, IonContent, IonSearchbar } from "@ionic/react";
import { supabase } from "../../supabaseClient";
import "./DRPatientHistory.css";
import DRHistoryCard, { DRDiaryEntry } from "../../components/DRHistoryCard";
import DiaryNavBar from "../../components/DiaryNavBar";
import DiaryHeader from "../../components/DiaryHeader";

const DRPatientHistory: React.FC = () => {
  const [diaryEntries, setDiaryEntries] = useState<any[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");

  const ITEMS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const fetchHistory = async () => {
    setLoading(true);

    // 1️⃣ ดึง diary ก่อน
    const { data: diaryData, error: diaryError } = await supabase
      .from("diary")
      .select("*")
      .order("diary_date", { ascending: false });

    if (diaryError) {
      console.error("Error fetching diary:", diaryError.message);
      setLoading(false);
      return;
    }

    if (!diaryData || diaryData.length === 0) {
      setDiaryEntries([]);
      setFilteredEntries([]);
      setLoading(false);
      return;
    }

    // 2️⃣ เอา user_id ไป query profiles
    const userIds = diaryData.map((d) => d.user_id);

    const { data: profilesData, error: profileError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name")
      .in("id", userIds);

    if (profileError) {
      console.error("Error fetching profiles:", profileError.message);
      setLoading(false);
      return;
    }

    // 3️⃣ merge ข้อมูลเอง
    const mergedData = diaryData.map((diary) => {
      const profile = profilesData?.find((p) => p.id === diary.user_id);

      return {
        ...diary,
        profiles: profile || null,
      };
    });

    setDiaryEntries(mergedData);
    setFilteredEntries(mergedData);
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // search filter
  useEffect(() => {
    const filtered = diaryEntries.filter((entry) =>
      `${entry.profiles?.first_name || ""} ${entry.profiles?.last_name || ""}`
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );

    setFilteredEntries(filtered);
    setCurrentPage(1);
  }, [searchText, diaryEntries]);

  const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const currentEntries = filteredEntries.slice(startIndex, endIndex);

  return (
    <IonPage>
      <DiaryHeader />

      <IonContent
        className="history-content ion-padding"
        fullscreen
        style={{ paddingBottom: 90 }}
      >
        <div className="history-header-section">
          <h1 className="history-title">ประวัติการบันทึกคนไข้</h1>
        </div>

        <IonSearchbar
          placeholder="ค้นหาชื่อคนไข้..."
          value={searchText}
          onIonInput={(e) => setSearchText(e.detail.value!)}
        />

        <div className="history-list">
          {loading ? (
            <p className="loading-text">กำลังโหลดข้อมูล...</p>
          ) : filteredEntries.length === 0 ? (
            <p className="no-entries-text">ไม่พบข้อมูล</p>
          ) : (
            currentEntries.map((entry) => (
              <DRHistoryCard key={entry.id} entry={entry} />
            ))
          )}
        </div>

        {!loading && filteredEntries.length > ITEMS_PER_PAGE && (
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

      <DiaryNavBar />
    </IonPage>
  );
};

export default DRPatientHistory;
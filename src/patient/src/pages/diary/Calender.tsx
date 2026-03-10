import React, { useState } from "react";
import { IonPage, IonContent } from "@ionic/react";

import { useHistory } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "./Calender.css";
import DiaryNavBar from "../../components/DiaryNavBar";
import DiaryHeader from "../../components/DiaryHeader";
import DiaryCalender from "../../components/DiaryCalender";

const Calender: React.FC = () => {
  const history = useHistory();
  const [value, setValue] = useState<Date>(new Date());

  // 🔒 FIX: format วันที่จาก Local Time (ไม่ใช้ toISOString)
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // กดวันที่บน Calendar
  const onDateClick = (date: Date) => {
    setValue(date);
    history.push(`/diary/`);
  };

  // กดปุ่ม Diary ใต้ปฏิทิน
  const goToDiary = () => {
    history.push(`/diary/`);
  };

  return (
    <IonPage>
      {/* ===== Header ===== */}
      <DiaryHeader />

      {/* ===== Main Content ===== */}
      <IonContent
        fullscreen
        className="ion-padding"
        style={{ paddingBottom: 110 }} // กัน bottom nav บัง
      >
        {/* Welcome */}
        <h2 className="welcome-text large-title">สวัสดีวันจันทร์</h2>

        {/* Calendar Card */}
        <DiaryCalender />
      </IonContent>

      {/* ===== Bottom Navigation ===== */}
      <DiaryNavBar />
    </IonPage>
  );
};

export default Calender;

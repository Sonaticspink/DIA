import React, { useEffect, useState } from "react";
import "./DiaryCalender.css";
import { IonPage, IonContent } from "@ionic/react";
import { supabase } from "../supabaseClient";

const DiaryCalender: React.FC = () => {
  const [moods, setMoods] = useState<any>({});

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  // ⭐ แปลงเลข happiness → emoji
  const getEmojiFromHappiness = (score: number) => {
    switch (score) {
      case 1:
        return "😀";
      case 2:
        return "🙂";
      case 3:
        return "😐";
      case 4:
        return "🙁";
      case 5:
        return "😞";
      default:
        return "";
    }
  };

  const loadDiary = async () => {
    const { data, error } = await supabase
      .from("diary")
      .select("diary_date, happiness");

    if (error) {
      console.log("โหลด diary error:", error);
      return;
    }

    if (!data) return;

    const moodMap: any = {};
    data.forEach((item: any) => {
      moodMap[item.diary_date] = getEmojiFromHappiness(item.happiness);
    });

    setMoods(moodMap);
  };

  useEffect(() => {
    loadDiary();
  }, []);

  const renderDays = () => {
    const days = [];

    // ช่องว่างก่อนวันแรกของเดือน
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={"empty-" + i}></div>);
    }

    // วนวันในเดือน
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      const emoji = moods[dateStr];

      days.push(
        <div key={day} className="day-wrapper">
          <div className="circle">
            {emoji && (
              <span
                style={{
                  fontSize: "30px", // เดิมประมาณ 18px
                  lineHeight: "1",
                }}
              >
                {emoji}
              </span>
            )}
          </div>
          <div className="day-number">{day}</div>
        </div>,
      );
    }

    return days;
  };

  return (
    <IonPage>
      <IonContent fullscreen className="calendar-content">
        <div className="calendar-container">
          <h2 className="month-title">
            {today.toLocaleString("default", { month: "long" })} {year}
          </h2>

          <div className="week-header">
            <span>อา.</span>
            <span>จ.</span>
            <span>อ.</span>
            <span>พ.</span>
            <span>พฤ.</span>
            <span>ศ.</span>
            <span>ส.</span>
          </div>

          <div className="calendar-grid">{renderDays()}</div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DiaryCalender;

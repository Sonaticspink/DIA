import React from "react";
import { IonButton, IonButtons, IonFooter, IonIcon, IonLabel, IonToolbar } from "@ionic/react";
import { calendar, timer, book, statsChart, call } from "ionicons/icons";
import { useLocation } from "react-router-dom";
import "./DiaryNavBar.css";

const DiaryNavBar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
  <IonFooter>
    <IonToolbar className="bottom-nav">
      <IonButtons slot="primary" className="bottom-nav-group">
        <IonButton
          fill="clear"
          routerLink="/calender"
          className={isActive("/calender") ? "active" : ""}
        >
          <IonIcon icon={calendar} />
          <IonLabel>ปฏิทิน</IonLabel>
        </IonButton>

        <IonButton
          fill="clear"
          routerLink="/history"
          className={isActive("/history") ? "active" : ""}
        >
          <IonIcon icon={timer} />
          <IonLabel>ประวัติ</IonLabel>
        </IonButton>

        <IonButton
          fill="clear"
          routerLink="/diary"
          className={isActive("/diary") ? "active" : ""}
        >
          <IonIcon icon={book} />
          <IonLabel>บันทึก</IonLabel>
        </IonButton>

        <IonButton
          fill="clear"
          routerLink="/report"
          className={isActive("/report") ? "active" : ""}
        >
          <IonIcon icon={statsChart} />
          <IonLabel>สรุป</IonLabel>
        </IonButton>

        <IonButton
          fill="clear"
          routerLink="/contact"
          className={isActive("/contact") ? "active" : ""}
        >
          <IonIcon icon={call} />
          <IonLabel>แพทย์</IonLabel>
        </IonButton>
      </IonButtons>
    </IonToolbar>
  </IonFooter>
  );
};

export default DiaryNavBar;

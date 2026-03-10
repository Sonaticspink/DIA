import { IonContent, IonPage } from "@ionic/react";
import React from "react";
import DoctorCard, { Doctor } from "../../components/DoctorCard";
import DiaryNavBar from "../../components/DiaryNavBar";
import DiaryHeader from "../../components/DiaryHeader";
import "./Contact.css";

const doctors: Doctor[] = [
  {
    id: 1,
    name: "หมอเดียร์",
    specialty: "Applied Thai Traditional Medicine",
    phone: "082-152-9499",
    email: "-",
    lineId: "-",
    avatar: "assets/Diary/doctor/doctordeer.jpg",
  },
];

const Contact: React.FC = () => {
  return (
    <IonPage>
      {/* ===== Header ===== */}
      <DiaryHeader />

      <IonContent
        fullscreen
        className="cd-content ion-padding"
        style={{ paddingBottom: 110 }}
      >
        <div className="cd-wrap">
          <h1 className="cd-title large-title">ติดต่อแพทย์</h1>
          <div className="cd-grid">
            {doctors.map((d) => (
              <DoctorCard key={d.id} doctor={d} />
            ))}
          </div>
        </div>
      </IonContent>

      {/* ===== Bottom Navigation ===== */}
      <DiaryNavBar />
    </IonPage>
  );
};

export default Contact;

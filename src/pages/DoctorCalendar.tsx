import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonBackButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './DoctorCalendar.css'; // New dedicated CSS

const DoctorCalendar: React.FC = () => {
  const [value, setValue] = useState(new Date());
  const history = useHistory();

  const handleDateClick = (val: any) => {
    const d = val instanceof Date ? val : val[0];
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    history.push(`/doctor/slot-manager/${dateStr}`);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="doc-calendar-header">
          <IonButtons slot="start"><IonBackButton defaultHref="/doctor-dashboard" /></IonButtons>
          <IonTitle>เลือกวันที่จัดการเวลา</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding doc-calendar-bg">
        <div className="doc-calendar-container">
          <Calendar onChange={handleDateClick} value={value} locale="th-TH" />
        </div>
        <div className="doc-hint-text">คลิกวันที่เพื่อ ล็อค/ปลดล็อค ช่วงเวลา</div>
      </IonContent>
    </IonPage>
  );
};

export default DoctorCalendar;
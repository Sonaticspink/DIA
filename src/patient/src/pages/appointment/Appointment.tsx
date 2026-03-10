import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonButtons, IonBackButton 
} from '@ionic/react';
import { listOutline } from 'ionicons/icons';
import { IonIcon, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom'; // Add this
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Appointment.css'
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const Appointment: React.FC = () => {
  const [value, setValue] = useState(new Date());
  const history = useHistory();

const handleDateClick = (value: Value) => {
  if (value instanceof Date) {
    setValue(value);

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    
    const dateStr = `${year}-${month}-${day}`;
    history.push(`/appointment-detail/${dateStr}`);
  }
};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/dashboard" className="custom-back-btn"  />
          </IonButtons>
          <IonTitle className="custom-title" >การนัดหมาย</IonTitle>
          <IonButtons slot="end">
      <IonButton routerLink="/appointment-list">
        <IonIcon icon={listOutline} slot="icon-only" />
      </IonButton>
    </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding gray-bg">
        <div className="calendar-container">
          <Calendar 
            onChange={handleDateClick} // Triggers navigation on click
            value={value} 
            locale="th-TH" 
          />
        </div>
        <div className="hint-text">กรุณาเลือกวันที่เพื่อดูรายละเอียด</div>
      </IonContent>
    </IonPage>
  );
};

export default Appointment;
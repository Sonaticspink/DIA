import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonButtons, IonBackButton 
} from '@ionic/react';
import { useHistory } from 'react-router-dom'; // Add this
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Appointment.css'

const Appointment: React.FC = () => {
  const [value, setValue] = useState(new Date());
  const history = useHistory();

const handleDateClick = (selectedDate: Date) => {
  setValue(selectedDate);

  // FIX: Extract local date components manually to avoid UTC deduction
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(selectedDate.getDate()).padStart(2, '0');
  
  const dateStr = `${year}-${month}-${day}`; // Format: YYYY-MM-DD
  
  history.push(`/appointment-detail/${dateStr}`);
};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/dashboard" />
          </IonButtons>
          <IonTitle>การนัดหมาย</IonTitle>
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
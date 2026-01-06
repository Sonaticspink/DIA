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
    // Convert date to string (YYYY-MM-DD) to pass in URL
    const dateStr = selectedDate.toISOString().split('T')[0];
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
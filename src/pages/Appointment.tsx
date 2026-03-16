import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonButtons, IonBackButton, IonIcon, IonButton 
} from '@ionic/react';
import { listOutline, calendarOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Appointment.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

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
      <IonHeader className="ion-no-border">
        <IonToolbar className="dashboard-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/dashboard" className="custom-back-btn" />
          </IonButtons>
          <IonTitle className="Appointment-title">การนัดหมาย</IonTitle>
          {/* ลบ IonButtons slot="end" ออกจากตรงนี้แล้ว */}
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding Appointment-content">
        <div className="action-container">
            <IonButton 
              expand="block" 
              className="view-list-btn" 
              onClick={() => history.push('/appointment-list')}
            >
              <IonIcon icon={listOutline} slot="start" />
              ดูรายการนัดหมายทั้งหมด
            </IonButton>
          </div>
        <div className="main-container">
          <div className="calendar-container">
            <Calendar 
              onChange={handleDateClick}
              value={value} 
              locale="th-TH" 
              minDate={tomorrow} 
              showNeighboringMonth={false}
            />
          </div>
          <div className="hint-text">
            กรุณาเลือกวันที่ต้องการนัดหมาย<br/>และทำการนัดหมายล่วงหน้าอย่างน้อย 1 วัน
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Appointment;
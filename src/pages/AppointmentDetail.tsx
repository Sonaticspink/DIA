import React from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonButton
} from '@ionic/react';
import { listOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { useParams } from 'react-router-dom';
import './AppointmentDetail.css'
import { useHistory } from 'react-router-dom';

const AppointmentDetail: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  
  // Format the date into Thai (e.g., วันศุกร์ที่ 27 ตุลาคม 2566)
  const dateObj = new Date(date);
  const thaiFullDate = dateObj.toLocaleDateString('th-TH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Mock slots: 'available', 'booked', or 'closed'
  const timeSlots = [
    { time: '09:00', status: 'available' },
    { time: '09:30', status: 'booked' },
    { time: '10:00', status: 'available' },
    { time: '10:30', status: 'available' },
    { time: '11:00', status: 'booked' },
    { time: '11:30', status: 'available' },
  ];
    const history = useHistory();

    const handleBooking = (time: string) => {
    // Navigate to reservation page with date and time
    history.push(`/reservation/${date}/${time}`);
    };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/appointment" />
          </IonButtons>
          <IonTitle>เลือกเวลาจอง</IonTitle>
          <IonButtons slot="end">
      <IonButton routerLink="/appointment-list">
        <IonIcon icon={listOutline} slot="icon-only" />
      </IonButton>
    </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding gray-bg">
        <div className="detail-header-card">
          <p className="thai-label">วันนัดหมายของคุณ</p>
          <h1 className="thai-date-display">{thaiFullDate}</h1>
        </div>

        <h3 className="section-title">ช่วงเวลาที่เปิดรับจอง</h3>
        
        <IonGrid>
          <IonRow>
            {timeSlots.map((slot, index) => (
              <IonCol size="6" key={index}>
                <IonButton
                  expand="block"
                  className={`slot-button ${slot.status}`}
                  disabled={slot.status === 'booked'}
                  onClick={() => handleBooking(slot.time)}
                  fill={slot.status === 'available' ? 'outline' : 'solid'}
                >
                  {slot.time}
                  {slot.status === 'booked' && " (เต็ม)"}
                </IonButton>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <div className="legend">
          <span className="dot available"></span> ว่าง 
          <span className="dot booked"></span> เต็ม/ไม่ว่าง
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AppointmentDetail;
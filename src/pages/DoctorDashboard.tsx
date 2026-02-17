import React from 'react';
import { 
  IonContent, IonPage, IonHeader, IonToolbar, 
  IonTitle, IonButton, IonIcon, IonAvatar, IonButtons 
} from '@ionic/react';
import { book, calendar, medical, logOutOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './DoctorDashboard.css';

const DoctorDashboard: React.FC = () => {
  const history = useHistory();

  // ดึงชื่อวันปัจจุบันภาษาไทย
  const currentDay = new Intl.DateTimeFormat('th-TH', { weekday: 'long' }).format(new Date());

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      history.push('/home'); // กลับไปหน้าล็อกอิน
    } else {
      alert("Error logging out: " + error.message);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="doctor-header">
          {/* อัปเดต Title ให้แสดงวันปัจจุบัน */}
          <IonTitle className="doctor-title">สวัสดี{currentDay}</IonTitle>
          
          <IonButtons slot="end">
            <IonButton onClick={handleLogout} color="danger">
              <IonIcon slot="icon-only" icon={logOutOutline} />
            </IonButton>
            <IonAvatar className="doctor-avatar-circle" style={{ marginInline: '10px' }}>
              <img src="https://ionicframework.com/docs/img/demos/avatar.svg" alt="doctor" />
            </IonAvatar>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding doctor-bg">
        <div className="button-container-doctor">
          
          <IonButton expand="block" className="doctor-main-btn" onClick={() => history.push('/doctor/appointments')}>
            <IonIcon slot="start" icon={book} />
            ข้อมูลการนัด
          </IonButton>

          <IonButton expand="block" className="doctor-main-btn" onClick={() => history.push('/doctor/manage-slots')}>
            <IonIcon slot="start" icon={calendar} />
            เลือกเวลาไม่ว่าง
          </IonButton>

          <IonButton expand="block" className="doctor-main-btn" onClick={() => history.push('/doctor/manage-drugs')}>
            <IonIcon slot="start" icon={medical} />
            จัดการยา
          </IonButton>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default DoctorDashboard;
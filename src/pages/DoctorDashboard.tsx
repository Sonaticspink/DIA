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

  // Integrated Logout Logic from your sample
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      history.push('/home'); // Redirect to login page after logout
    } else {
      alert("Error logging out: " + error.message);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        {/* Pink Toolbar matching your doctor design */}
        <IonToolbar className="doctor-header">
          <IonTitle className="doctor-title">สวัสดีวันจันทร์</IonTitle>
          
          {/* Integrated Logout Button and Avatar Group style */}
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
          
          {/* ข้อมูลการนัด */}
          <IonButton expand="block" className="doctor-main-btn" onClick={() => history.push('/doctor/appointments')}>
            <IonIcon slot="start" icon={book} />
            ข้อมูลการนัด
          </IonButton>

          {/* เลือกเวลาไม่ว่าง */}
          <IonButton expand="block" className="doctor-main-btn" onClick={() => history.push('/doctor/manage-slots')}>
            <IonIcon slot="start" icon={calendar} />
            เลือกเวลาไม่ว่าง
          </IonButton>

          {/* จัดการยา */}
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
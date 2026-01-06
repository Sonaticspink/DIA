import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonButtons, IonBackButton, IonItem, IonLabel, IonList, IonButton,IonImg,
  IonIcon, IonInput, IonTextarea, IonListHeader
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { calendarOutline, timeOutline, personCircleOutline, callOutline, documentTextOutline } from 'ionicons/icons';
import './ReservationPage.css'
import { supabase } from '../supabaseClient';

const ReservationPage: React.FC = () => {
  const { date, time } = useParams<{ date: string, time: string }>();
  const history = useHistory();

  // State for user information
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    note: ''
  });

  const thaiDate = new Date(date).toLocaleDateString('th-TH', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

const handleConfirm = async () => {
  const { data, error } = await supabase
    .from('appointments') // Your table name
    .insert([
      { 
        appointment_date: date, 
        appointment_time: time, 
        patient_name: formData.name, 
        patient_phone: formData.phone, 
        note: formData.note 
      }
    ])
    .select();

  if (error) {
    alert("เกิดข้อผิดพลาด: " + error.message);
  } else {
    history.push(`/success/${date}/${time}`);
  }
};

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>กรอกข้อมูลการจอง</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding Reservation-background">

         {/* Logo Section */}
          <div className="logo-section">
            <IonImg src="/assets/logo.png" className="app-logo" />
          </div>

        {/* Summary Card */}
        <div className="reservation-card">
          <div className="status-badge">รายละเอียดวันและเวลาที่ทำการจอง</div>
          <p className="summary-text">
            <IonIcon icon={calendarOutline} /> {thaiDate} <br/>
            <IonIcon icon={timeOutline} /> เวลา {time} น.
          </p>
        </div>

        {/* Information Input Box */}
        <div className="input-box-container">
          <h3 className="input-header">ข้อมูลผู้ติดต่อ</h3>
          
          <div className="input-item">
            <IonLabel position="stacked">ชื่อ-นามสกุล</IonLabel>
            <IonItem lines="none" className="custom-input">
              <IonIcon icon={personCircleOutline} slot="start" />
              <IonInput 
                placeholder="กรอกชื่อของคุณ" 
                value={formData.name}
                onIonChange={e => setFormData({...formData, name: e.detail.value!})}
              />
            </IonItem>
          </div>

          <div className="input-item">
            <IonLabel position="stacked">เบอร์โทรศัพท์</IonLabel>
            <IonItem lines="none" className="custom-input">
              <IonIcon icon={callOutline} slot="start" />
              <IonInput 
                type="tel" 
                placeholder="08X-XXX-XXXX" 
                value={formData.phone}
                onIonChange={e => setFormData({...formData, phone: e.detail.value!})}
              />
            </IonItem>
          </div>

          <div className="input-item">
            <IonLabel position="stacked">อาการป่วยเบื้องต้น</IonLabel>
            <IonItem lines="none" className="custom-input">
              <IonIcon icon={documentTextOutline} slot="start" />
              <IonTextarea 
                placeholder="ระบุรายละเอียดเพิ่มเติม..." 
                rows={3}
                value={formData.note}
                onIonChange={e => setFormData({...formData, note: e.detail.value!})}
              />
            </IonItem>
          </div>
        </div>

        <div className="action-buttons">
          <IonButton 
            expand="block" 
            shape="round" 
            className="confirm-btn"
            disabled={!formData.name || !formData.phone}
            onClick={handleConfirm}
          >
            ยืนยันการจอง
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ReservationPage;
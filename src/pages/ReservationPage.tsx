import React, { useState, useEffect } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonButtons, IonBackButton, IonItem, IonLabel, IonButton, 
  IonIcon, IonInput, IonTextarea, IonLoading
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { calendarOutline, timeOutline, personCircleOutline, callOutline, documentTextOutline } from 'ionicons/icons';
import './ReservationPage.css'
import { supabase } from '../supabaseClient';

const ReservationPage: React.FC = () => {
  const { date, time } = useParams<{ date: string, time: string }>();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', phone: '', note: '' });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('first_name, last_name, phone').eq('id', user.id).single();
        if (profile) {
          setFormData({ ...formData, name: `${profile.first_name} ${profile.last_name}`, phone: profile.phone });
        }
      }
      setLoading(false);
    };
    fetchUserProfile();
  }, []);

const handleConfirm = async () => {
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Save the appointment details
  const { error: apptError } = await supabase
    .from('appointments')
    .insert([{ 
        appointment_date: date, 
        appointment_time: time, 
        patient_name: formData.name, 
        patient_phone: formData.phone, 
        note: formData.note, 
        user_id: user?.id 
    }]);

  if (apptError) {
    alert("Error: " + apptError.message);
    return;
  }

  // 2. Insert a 'booked' record into the time_slot table to lock it
  const { error: slotError } = await supabase
    .from('time_slot')
    .insert([
      { 
        date: date, 
        time: time, 
        status: 'booked' 
      }
    ]);

  if (slotError) {
    // If it fails because the row already exists, we try to UPDATE instead
    await supabase
      .from('time_slot')
      .update({ status: 'booked' })
      .eq('date', date)
      .eq('time', time);
  }

  history.push(`/success/${date}/${time}`);
};

  const thaiDate = new Date(date.replace(/-/g, '/')).toLocaleDateString('th-TH', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <IonPage>
      <IonHeader><IonToolbar color="primary" className="custom-toolbar" ><IonButtons slot="start"><IonBackButton className="custom-back-btn" /></IonButtons><IonTitle className="custom-title" >กรอกข้อมูลการจอง</IonTitle></IonToolbar></IonHeader>
      <IonContent className="ion-padding gray-bg">
        <IonLoading isOpen={loading} message="กำลังโหลด..." />
        <div className="reservation-card">
          <div className="status-badge">สรุปรายละเอียด</div>
          <p className="summary-text"><IonIcon icon={calendarOutline} /> {thaiDate} <br/><IonIcon icon={timeOutline} /> เวลา {time} น.</p>
        </div>
        <div className="input-box-container">
          <div className="input-item">
            <IonLabel position="stacked">ชื่อ-นามสกุล</IonLabel>
            <IonItem lines="none" className="custom-input">
              <IonIcon icon={personCircleOutline} slot="start" />
              <IonInput value={formData.name} onIonInput={e => setFormData({...formData, name: e.detail.value!})} />
            </IonItem>
          </div>
          <div className="input-item">
            <IonLabel position="stacked">เบอร์โทรศัพท์</IonLabel>
            <IonItem lines="none" className="custom-input">
              <IonIcon icon={callOutline} slot="start" />
              <IonInput type="tel" value={formData.phone} onIonInput={e => setFormData({...formData, phone: e.detail.value!})} />
            </IonItem>
          </div>
          <div className="input-item">
            <IonLabel position="stacked">หมายเหตุ</IonLabel>
            <IonItem lines="none" className="custom-input">
              <IonIcon icon={documentTextOutline} slot="start" />
              <IonTextarea rows={3} value={formData.note} onIonInput={e => setFormData({...formData, note: e.detail.value!})} />
            </IonItem>
          </div>
        </div>
        <IonButton expand="block" shape="round" className="confirm-btn" disabled={!formData.name || !formData.phone} onClick={handleConfirm}>ยืนยันการจอง</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ReservationPage;
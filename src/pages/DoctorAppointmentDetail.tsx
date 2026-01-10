import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonToolbar, IonButtons, 
  IonBackButton, IonTitle, IonButton, useIonViewWillEnter, IonSpinner, IonToast
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './DoctorAppointmentList.css';

const DoctorAppointmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [appt, setAppt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useIonViewWillEnter(() => {
    fetchDetail();
  });

  const fetchDetail = async () => {
    setLoading(true);
    // Fetching the specific appointment
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      setAppt(data);
    }
    setLoading(false);
  };

  const updateStatus = async (newStatus: string) => {
    // Updates the 'status' column in your appointments table
    const { error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setShowToast(true);
      setTimeout(() => history.goBack(), 1000); // Return to list after update
    }
  };

  if (loading) return <IonPage><IonContent><div className="center-spinner"><IonSpinner /></div></IonContent></IonPage>;
  if (!appt) return <IonPage><IonContent>ไม่พบข้อมูลนัดหมาย</IonContent></IonPage>;

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="doctor-list-header">
          <IonButtons slot="start">
            <IonBackButton text="ย้อนกลับ" defaultHref="/doctor/appointments" />
          </IonButtons>
          <IonTitle className="header-badge-container">
             <div className="header-pink-badge">ข้อมูลการนัด</div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding doctor-bg">
        <IonToast isOpen={showToast} message="อัปเดตสถานะเรียบร้อยแล้ว" duration={1000} color="success" />

        <div className="detail-top-info">
          <span className="info-label-box">รายละเอียดนัด</span>
          <span className="info-date-time">
            {new Date(appt.appointment_date).toLocaleDateString('th-TH')}<br/>
            {appt.appointment_time.substring(0, 5)} {parseInt(appt.appointment_time) >= 12 ? 'PM' : 'AM'}
          </span>
        </div>

        <div className="patient-detail-card">
          <h2 className="patient-name-title">{appt.patient_name}</h2>
          <p className="patient-symptom">อาการ : {appt.note || 'ไม่ได้ระบุ'}</p>
          <div className="patient-phone-bottom">เบอร์โทร : {appt.patient_phone}</div>
        </div>

        {/* Displays the status from the database */}
        <div className="status-display-box">
          สถานะ : {appt.status || 'รอการยืนยัน'}
        </div>

        <div className="action-button-group">
          <IonButton expand="block" className="btn-approve" onClick={() => updateStatus('ยืนยันการนัดหมาย')}>
            ยืนยันการนัดหมาย
          </IonButton>
          <IonButton expand="block" className="btn-decline" onClick={() => updateStatus('ยกเลิกการนัดหมาย')}>
            ยกเลิกการนัดหมาย
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DoctorAppointmentDetail;
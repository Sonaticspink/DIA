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

     <IonContent className="ion-padding doctor-detail-bg">
  <IonToast
    isOpen={showToast}
    message="อัปเดตสถานะเรียบร้อยแล้ว"
    duration={1000}
    color="success"
  />

  {/* Summary Card */}
  <div className="reservation-card">
    <div className="status-badge">สรุปรายละเอียด</div>
    <p className="summary-text">
      📅 {new Date(appt.appointment_date).toLocaleDateString('th-TH')} <br />
      ⏰ {appt.appointment_time.substring(0, 5)} น.
    </p>
  </div>

  {/* Patient Info */}
  <div className="input-box-container">
    <h2 className="patient-name-title">{appt.patient_name}</h2>

    <div className="info-row">
      <span className="info-label">อาการ</span>
      <span className="info-value">{appt.note || 'ไม่ได้ระบุ'}</span>
    </div>

    <div className="info-row">
      <span className="info-label">เบอร์โทร</span>
      <span className="info-value">{appt.patient_phone}</span>
    </div>

    <div className="status-display-box">
      สถานะปัจจุบัน : <strong>{appt.status || 'รอการยืนยัน'}</strong>
    </div>
  </div>

  {/* Action Buttons */}
  <IonButton
    expand="block"
    shape="round"
    className="confirm-btn approve-btn"
    onClick={() => updateStatus('ยืนยันการนัดหมาย')}
  >
    ยืนยันการนัดหมาย
  </IonButton>

  <IonButton
    expand="block"
    shape="round"
    fill="outline"
    className="confirm-btn decline-btn"
    onClick={() => updateStatus('ยกเลิกการนัดหมาย')}
  >
    ยกเลิกการนัดหมาย
  </IonButton>
</IonContent>

    </IonPage>
  );
};

export default DoctorAppointmentDetail;

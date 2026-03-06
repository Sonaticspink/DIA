import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonToolbar, IonButtons, 
  IonBackButton, IonTitle, IonIcon, useIonViewWillEnter, IonSpinner
} from '@ionic/react';
import { arrowForwardOutline, timeOutline, calendarOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './DoctorAppointmentList.css';

const DoctorAppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useIonViewWillEnter(() => {
    fetchAllAppointments();
  });

  const fetchAllAppointments = async () => {
    setLoading(true);
    // ดึงข้อมูลและเรียงลำดับวันที่ล่าสุดขึ้นก่อน
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: false }); 
    
    if (!error && data) {
      setAppointments(data);
    }
    setLoading(false);
  };

  // ฟังก์ชันช่วยแสดงผลแต่ละ Section พร้อมกำหนดสี Card
  const renderSection = (title: string, statusKey: string, badgeClass: string, cardClass: string) => {
    const filtered = appointments.filter(appt => appt.status === statusKey);
    if (filtered.length === 0) return null;

    return (
      <div className="section-container">
        {/* ส่วนหัวของ Section */}
        <div className={`status-section-label ${badgeClass}`}>{title} ({filtered.length})</div>
        <div className="list-container">
          {filtered.map((appt) => (
            /* ใส่ cardClass เพื่อเปลี่ยนสีพื้นหลังตามสถานะ */
            <div key={appt.id} className={`appt-row-card ${cardClass}`} onClick={() => history.push(`/doctor/appointment-detail/${appt.id}`)}>
              <div className="patient-info-mini">
                <strong>{appt.patient_name}</strong>
              </div>
              <div className="row-details">
                <div className="date-col">
                  <IonIcon icon={calendarOutline} /> {new Date(appt.appointment_date).toLocaleDateString('th-TH')}
                </div>
                <div className="vertical-divider"></div>
                <div className="time-col">
                  <IonIcon icon={timeOutline} /> {appt.appointment_time.substring(0, 5)}
                </div>
              </div>
              <IonIcon icon={arrowForwardOutline} className="list-arrow" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="doctor-list-header">
          <IonButtons slot="start">
            <IonBackButton text="ย้อนกลับ" defaultHref="/doctor_dashboard" />
          </IonButtons>
          <IonTitle className="header-badge-container">
             <div className="header-pink-badge">จัดการรายการนัดหมาย</div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding doctor-bg">
        {loading ? (
          <div className="center-spinner"><IonSpinner name="crescent" /></div>
        ) : appointments.length === 0 ? (
          <div className="no-data-text">ไม่มีรายการนัดหมายในขณะนี้</div>
        ) : (
          <>
            {/* เรียกใช้ Section พร้อมส่ง Class สีที่ต้องการ */}
            {renderSection("🟡 รอการยืนยัน", "รอการยืนยัน", "pending-label", "card-pending")}
            {renderSection("🟢 ยืนยันการรับนัด", "ยืนยันการนัดหมาย", "success-label", "card-success")}
            {renderSection("🔴 ยกเลิกการนัดหมาย", "ยกเลิกการนัดหมาย", "danger-label", "card-danger")}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default DoctorAppointmentList;
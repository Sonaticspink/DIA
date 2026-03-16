import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonToolbar, IonButtons, 
  IonBackButton, IonTitle, IonIcon, useIonViewWillEnter, IonSpinner,
  IonGrid, IonRow, IonCol, IonButton
} from '@ionic/react';

import { 
  arrowForwardOutline, 
  timeOutline, 
  calendarOutline,
  filterOutline
} from 'ionicons/icons';

import { useHistory } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './DoctorAppointmentList.css';

const DoctorAppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // เพิ่ม State สำหรับเก็บสถานะที่เลือก (Default เป็น 'รอการยืนยัน')
  const [filterStatus, setFilterStatus] = useState<string>('รอการยืนยัน');

  const history = useHistory();

  useIonViewWillEnter(() => {
    fetchAllAppointments();
  });

  const fetchAllAppointments = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: false });

    if (data) setAppointments(data);
    setLoading(false);
  };

  // ฟังก์ชันสำหรับกรองข้อมูลตาม Filter ที่เลือก
  const getFilteredAppointments = () => {
    return appointments.filter(appt => appt.status === filterStatus);
  };

  const renderList = () => {
    const filteredData = getFilteredAppointments();

    if (filteredData.length === 0) {
      return <div className="no-data">ไม่มีรายการนัดหมายในหมวดนี้</div>;
    }

    return (
      <div className="section-container">
        {filteredData.map((appt) => (
          <div 
            key={appt.id} 
            className={`appt-card ${filterStatus === 'รอการยืนยัน' ? 'card-pending' : filterStatus === 'ยืนยันการนัดหมาย' ? 'card-success' : 'card-danger'}`}
            onClick={() => history.push(`/doctor/appointment-detail/${appt.id}`)}
          >
            <div className="appt-card-row">
              <div className="date-badge">
                {new Date(appt.appointment_date).toLocaleDateString('th-TH', {
                  day: '2-digit', month: '2-digit'
                })}
              </div>
              <div className="card-info">
                <div className="patient-name">{appt.patient_name}</div>
                <div className="card-meta">
                  <span className="meta-item">
                    <IonIcon icon={calendarOutline}/>
                    {new Date(appt.appointment_date).getFullYear() + 543}
                  </span>
                  <span className="meta-item">
                    <IonIcon icon={timeOutline}/>
                    {appt.appointment_time.substring(0, 5)} น.
                  </span>
                </div>
              </div>
              <IonIcon icon={arrowForwardOutline} className="card-arrow"/>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="doctor-header">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/doctor_dashboard"/>
          </IonButtons>
          <IonTitle>จัดการนัดหมาย</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="doctor-bg ion-padding">
        {/* ส่วนของปุ่ม Filter 3 สี */}
        <IonGrid className="filter-grid">
          <IonRow>
            <IonCol size="4">
              <IonButton 
                expand="block" 
                className={`filter-btn btn-yellow ${filterStatus === 'รอการยืนยัน' ? 'active' : ''}`}
                onClick={() => setFilterStatus('รอการยืนยัน')}
              >
                รอการยืนยัน
              </IonButton>
            </IonCol>
              <IonCol size="4">
              <IonButton 
                expand="block" 
                className={`filter-btn btn-green ${filterStatus === 'ยืนยันการนัดหมาย' ? 'active' : ''}`}
                onClick={() => setFilterStatus('ยืนยันการนัดหมาย')}
              >
                ยืนยันแล้ว
              </IonButton>
            </IonCol>
            <IonCol size="4">
              <IonButton 
                expand="block" 
                className={`filter-btn btn-red ${filterStatus === 'ยกเลิกการนัดหมาย' ? 'active' : ''}`}
                onClick={() => setFilterStatus('ยกเลิกการนัดหมาย')}
              >
                ยกเลิก
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>

        {loading ? (
          <div className="center-spinner">
            <IonSpinner name="crescent"/>
          </div>
        ) : (
          renderList()
        )}
      </IonContent>
    </IonPage>
  );
};

export default DoctorAppointmentList;
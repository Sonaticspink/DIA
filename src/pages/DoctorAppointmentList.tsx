import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonToolbar, IonButtons, 
  IonBackButton, IonTitle, IonList, IonIcon, useIonViewWillEnter, IonSpinner
} from '@ionic/react';
import { arrowForwardOutline } from 'ionicons/icons';
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
    // Fetching from the appointments table
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true });
    
    if (!error && data) {
      setAppointments(data);
    } else if (error) {
      console.error("Error fetching:", error.message);
    }
    setLoading(false);
  };

  const handleItemClick = (id: string) => {
    // Navigate to detail using the ID from the database
    history.push(`/doctor/appointment-detail/${id}`);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="doctor-list-header">
          <IonButtons slot="start">
            <IonBackButton text="ย้อนกลับ" defaultHref="/doctor_dashboard" />
          </IonButtons>
          <IonTitle className="header-badge-container">
             <div className="header-pink-badge">ข้อมูลการนัด</div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding doctor-bg">
        <div className="status-section-label">นัดที่ใกล้ที่สุด</div>
        
        {loading ? (
          <div className="center-spinner" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <IonSpinner name="crescent" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="no-data-text" style={{ textAlign: 'center', marginTop: '20px' }}>ไม่มีรายการนัดหมายในขณะนี้</div>
        ) : (
          <div className="list-container">
            {appointments.map((appt) => (
              <div 
                key={appt.id} 
                className="appt-row-card" 
                onClick={() => handleItemClick(appt.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="date-col">
                  {new Date(appt.appointment_date).toLocaleDateString('th-TH', {
                    day: '2-digit', month: '2-digit', year: '2-digit'
                  })}
                </div>
                <div className="vertical-divider"></div>
                <div className="time-col">
                  {appt.appointment_time.substring(0, 5)}
                  {/* Logic for AM/PM based on screenshot */}
                  {parseInt(appt.appointment_time) >= 12 ? ' PM' : ' AM'}
                </div>
                <IonIcon icon={arrowForwardOutline} className="list-arrow" />
              </div>
            ))}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default DoctorAppointmentList;

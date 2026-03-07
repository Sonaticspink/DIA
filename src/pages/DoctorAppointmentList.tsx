import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonToolbar, IonButtons, 
  IonBackButton, IonTitle, IonIcon, useIonViewWillEnter, IonSpinner
} from '@ionic/react';

import { 
  arrowForwardOutline, 
  timeOutline, 
  calendarOutline 
} from 'ionicons/icons';

import { useHistory } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './DoctorAppointmentList.css';
import './DoctorAppointmentCommon.css';

const DoctorAppointmentList: React.FC = () => {

  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const renderSection = (
    title: string,
    statusKey: string,
    badgeClass: string,
    cardClass: string
  ) => {

    const filtered = appointments.filter(a => a.status === statusKey);

    if (filtered.length === 0) return null;

    return (

      <div className="section-container">

        <div className={`status-section-label ${badgeClass}`}>
          {title} ({filtered.length})
        </div>

        {filtered.map((appt) => {

          const date = new Date(appt.appointment_date);

          const day = date.getDate();
          const month = date.toLocaleDateString('th-TH', { month: 'short' });

          return (

            <div
              key={appt.id}
  className={`appt-card ${cardClass}`}
  onClick={() => history.push(`/doctor/appointment-detail/${appt.id}`)}
>
  <div className="appt-card-row">

    <div className="date-badge">
      {day} {month}
    </div>

    <div className="card-info">

      <div className="patient-name">
        {appt.patient_name}
      </div>

      <div className="card-meta">

        <span className="meta-item">
          <IonIcon icon={calendarOutline}/>
          {date.toLocaleDateString('th-TH')}
        </span>

        <span className="meta-item">
          <IonIcon icon={timeOutline}/>
          {appt.appointment_time.substring(0,5)}
        </span>

      </div>

    </div>

    <IonIcon icon={arrowForwardOutline} className="card-arrow"/>

  </div>
            </div>

          );
        })}

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

          <IonTitle>
            📅 รายการนัดหมาย
          </IonTitle>

        </IonToolbar>

      </IonHeader>

      <IonContent className="doctor-bg ion-padding">

        {loading ? (

          <div className="center-spinner">
            <IonSpinner name="crescent"/>
          </div>

        ) : appointments.length === 0 ? (

          <div className="no-data">
            ไม่มีรายการนัดหมาย
          </div>

        ) : (

          <>
            {renderSection("รอการยืนยัน", "รอการยืนยัน", "pending-label", "card-pending")}
            {renderSection("ยืนยันการนัดหมาย", "ยืนยันการนัดหมาย", "success-label", "card-success")}
            {renderSection("ยกเลิกการนัดหมาย", "ยกเลิกการนัดหมาย", "danger-label", "card-danger")}
          </>

        )}

      </IonContent>

    </IonPage>

  );

};

export default DoctorAppointmentList;
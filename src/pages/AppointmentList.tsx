import React, { useEffect, useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonButtons, IonBackButton, IonList, IonItem, IonLabel, IonBadge, IonSpinner 
} from '@ionic/react';
import { supabase } from '../supabaseClient';
import './AppointmentList.css';

const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

const fetchAppointments = async () => {
  setLoading(true);
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // Only fetch appointments that match the current user/guest ID
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', user.id) // Key security filter
      .order('appointment_date', { ascending: false });

    if (!error) setAppointments(data || []);
  }
  setLoading(false);
};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>รายการนัดหมายของคุณ</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding gray-bg">
        {loading ? (
          <div className="center"><IonSpinner /></div>
        ) : (
          <IonList lines="none">
            {appointments.map((item) => (
              <IonItem key={item.id} className="list-card">
                <IonLabel>
                  <h2 className="patient-name">{item.patient_name}</h2>
                  <p className="appt-info">📅 {new Date(item.appointment_date).toLocaleDateString('th-TH')}</p>
                  <p className="appt-info">⏰ เวลา {item.appointment_time} น.</p>
                  {item.note && <p className="appt-note">📝 {item.note}</p>}
                </IonLabel>
                <IonBadge color="success" slot="end">ยืนยันแล้ว</IonBadge>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AppointmentList;
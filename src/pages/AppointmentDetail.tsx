import React, { useState } from 'react'; // Removed useEffect from here
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonButton, 
  IonIcon, IonSpinner, useIonViewWillEnter // Added this Ionic hook
} from '@ionic/react';
import { listOutline } from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './AppointmentDetail.css'

const AppointmentDetail: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const history = useHistory();
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const hardcodedSlots = ['09:00:00', '09:30:00', '10:00:00', '10:30:00', '11:00:00', '11:30:00'];

  // This hook runs every time you enter the page, fixing the "second time" update bug
  useIonViewWillEnter(() => {
    fetchBookedStatus();
  });

  const fetchBookedStatus = async () => {
    setLoading(true);
    // Fetch slots from your table where status is booked
    const { data, error } = await supabase
      .from('time_slot')
      .select('time')
      .eq('date', date)
      .eq('status', 'booked');

    if (!error && data) {
      setBookedSlots(data.map(s => s.time));
    }
    setLoading(false);
  };

  const handleBooking = (time: string) => {
    history.push(`/reservation/${date}/${time}`);
  };

  const thaiFullDate = new Date(date).toLocaleDateString('th-TH', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start"><IonBackButton defaultHref="/appointment" /></IonButtons>
          <IonTitle>เลือกเวลาจอง</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink="/appointment-list"><IonIcon icon={listOutline} slot="icon-only" /></IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding gray-bg">
        <div className="detail-header-card">
          <p className="thai-label">วันนัดหมายของคุณ</p>
          <h1 className="thai-date-display">{thaiFullDate}</h1>
        </div>

        <h3 className="section-title">ช่วงเวลาที่เปิดรับจอง</h3>
        
        {loading ? <div className="center-spinner"><IonSpinner /></div> : (
          <IonGrid>
            <IonRow>
              {hardcodedSlots.map((fullTime, index) => {
                const isBooked = bookedSlots.includes(fullTime);
                
                return (
                  <IonCol size="6" key={index}>
                    <IonButton
                      expand="block"
                      disabled={isBooked} 
                      className={`slot-button ${isBooked ? 'booked' : 'available'}`}
                      onClick={() => !isBooked && handleBooking(fullTime)}
                      fill={isBooked ? 'solid' : 'outline'}
                    >
                      {fullTime.substring(0, 5)} 
                      {isBooked && " (เต็ม)"}
                    </IonButton>
                  </IonCol>
                );
              })}
            </IonRow>
          </IonGrid>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AppointmentDetail;
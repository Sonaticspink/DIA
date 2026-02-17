import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonButton, 
  IonSpinner, useIonViewWillEnter, IonToast 
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './DoctorSlotManager.css'; // New dedicated CSS

const DoctorSlotManager: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const hardcodedSlots = ['09:00:00', '09:30:00', '10:00:00', '10:30:00', '11:00:00', '11:30:00'];

  useIonViewWillEnter(() => { fetchBookedStatus(); });

  const fetchBookedStatus = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('time_slot')
      .select('time')
      .eq('date', date)
      .eq('status', 'booked');
    
    if (data) setBookedSlots(data.map(s => s.time));
    setLoading(false);
  };

const toggleSlot = async (time: string, currentlyBooked: boolean) => {
  if (currentlyBooked) {
    // ต้องลบโดยใช้ค่า 'time' เต็มๆ (เช่น '09:00:00') ไม่ใช่ตัดเหลือ 5 ตัว
    const { error } = await supabase
      .from('time_slot')
      .delete()
      .eq('date', date)
      .eq('time', time); // ใช้ค่า time จาก hardcodedSlots โดยตรง
    
    if (!error) setToastMsg(`ปลดล็อคเวลา ${time.substring(0, 5)} แล้ว`);
  } else {
    const { error } = await supabase
      .from('time_slot')
      .upsert({ date, time, status: 'booked' });
    if (!error) setToastMsg(`ล็อคเวลา ${time.substring(0, 5)} แล้ว`);
  }
  setShowToast(true);
  fetchBookedStatus();
};

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="doc-slot-header">
          <IonButtons slot="start"><IonBackButton /></IonButtons>
          <IonTitle>จัดการเวลา: {date}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding doc-slot-bg">
        <IonToast isOpen={showToast} message={toastMsg} duration={1500} onDidDismiss={() => setShowToast(false)} color="dark" />
        
        <div className="doc-slot-instruction">คลิกเพื่อ ล็อค หรือ ปลดล็อค</div>

        {loading ? <div className="doc-spinner"><IonSpinner name="crescent" /></div> : (
          <IonGrid>
            <IonRow>
              {hardcodedSlots.map((time, idx) => {
                const isBooked = bookedSlots.includes(time);
                return (
                  <IonCol size="6" key={idx}>
                    <IonButton 
                      expand="block" 
                      className={`toggle-btn ${isBooked ? 'is-locked' : 'is-available'}`}
                      onClick={() => toggleSlot(time, isBooked)}
                    >
                      {time.substring(0, 5)} {isBooked ? "🔒 ล็อค" : "🔓 ว่าง"}
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

export default DoctorSlotManager;
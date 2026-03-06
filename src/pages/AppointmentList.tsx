import React, { useEffect, useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonButtons, IonBackButton, IonList, IonItem, IonLabel, IonBadge, IonSpinner, IonButton, IonIcon, IonAlert 
} from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import { LocalNotifications } from '@capacitor/local-notifications'; // สำหรับแจ้งเตือนบนเครื่อง
import { supabase } from '../supabaseClient';
import './AppointmentList.css';

const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
    const subscription = setupRealtimeSubscription(); // เริ่มติดตามข้อมูล Realtime

    // Cleanup function เมื่อออกจากหน้า
    return () => {
      subscription.then(sub => {
        if (sub) supabase.removeChannel(sub);
      });
    };
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: false });

      if (!error) setAppointments(data || []);
    }
    setLoading(false);
  };

  // ฟังก์ชันตั้งค่า Realtime เพื่อฟังการอัปเดตสถานะ
  const setupRealtimeSubscription = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const channel = supabase.channel('status-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE', // สนใจเฉพาะการแก้ไขข้อมูล
          schema: 'public',
          table: 'appointments',
          filter: `user_id=eq.${user.id}`, // ฟังเฉพาะนัดหมายของตัวเอง
        },
        (payload) => {
          const newStatus = payload.new.status;
          const oldStatus = payload.old.status;

          // ถ้าสถานะเปลี่ยนไปจากเดิม ให้แจ้งเตือน
          if (newStatus !== oldStatus) {
            triggerNotification(newStatus);
            fetchAppointments(); // โหลดข้อมูลใหม่ในหน้าจอทันที
          }
        }
      )
      .subscribe();

    return channel;
  };

  // ฟังก์ชันสั่งให้เครื่องแจ้งเตือน
  const triggerNotification = async (status: string) => {
    await LocalNotifications.requestPermissions();
    await LocalNotifications.schedule({
      notifications: [
        {
          title: "อัปเดตสถานะการนัดหมาย",
          body: `นัดหมายของคุณเปลี่ยนเป็น: ${status}`,
          id: Math.floor(Math.random() * 10000),
          sound: 'beep.wav',
        }
      ]
    });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) {
      alert("ไม่สามารถลบรายการได้: " + error.message);
    } else {
      setAppointments(appointments.filter(app => app.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ยืนยันการรับนัด': 
      case 'ยืนยันการนัดหมาย': return 'success'; // สีเขียว
      case 'รอการยืนยัน': return 'warning'; // สีเหลือง
      case 'ยกเลิกการนัดหมาย': return 'danger'; // สีแดง
      default: return 'medium';
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/dashboard" />
          </IonButtons>
          <IonTitle>รายการนัดหมายของคุณ</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding gray-bg">
        
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'ยืนยันการลบ'}
          message={'คุณแน่ใจหรือไม่ว่าต้องการลบรายการนัดหมายนี้?'}
          buttons={[
            { text: 'ยกเลิก', role: 'cancel' },
            { text: 'ลบ', handler: () => { if (selectedId) handleDelete(selectedId); } }
          ]}
        />

        {loading ? (
          <div className="center"><IonSpinner /></div>
        ) : (
          <IonList lines="none">
            {appointments.length === 0 ? (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>ไม่มีรายการนัดหมาย</div>
            ) : (
              appointments.map((item) => (
                <IonItem key={item.id} className="list-card">
                  <IonLabel>
                    <h2 className="patient-name">{item.patient_name}</h2>
                    <p className="appt-info">📅 {new Date(item.appointment_date).toLocaleDateString('th-TH')}</p>
                    <p className="appt-info">⏰ เวลา {item.appointment_time} น.</p>
                    {item.note && <p className="appt-note">📝 {item.note}</p>}
                    <IonBadge color={getStatusColor(item.status)} style={{ marginTop: '5px' }}>
                      {item.status || 'รอการยืนยัน'}
                    </IonBadge>
                  </IonLabel>
                  
                  <IonButton 
                    fill="clear" 
                    color="danger" 
                    slot="end" 
                    onClick={() => {
                      setSelectedId(item.id);
                      setShowAlert(true);
                    }}
                  >
                    <IonIcon icon={trashOutline} slot="icon-only" />
                  </IonButton>
                </IonItem>
              ))
            )}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AppointmentList;
import React, { useEffect, useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonButtons, IonBackButton, IonList, IonItem, IonLabel, IonBadge, IonSpinner, IonButton, IonIcon, IonAlert 
} from '@ionic/react';
import { trashOutline, calendarOutline, timeOutline } from 'ionicons/icons';
import { LocalNotifications } from '@capacitor/local-notifications';
import { supabase } from '../supabaseClient';
import './AppointmentList.css';

const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const requestNotificationPermission = async () => {
    const permission = await LocalNotifications.requestPermissions();
      if (permission.display !== 'granted') {
        console.warn("User denied notifications");
      }
    };
    
    requestNotificationPermission();
    fetchAppointments();
    const subscription = setupRealtimeSubscription();

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
      // ดึงข้อมูลและเรียงจากวันที่ล่าสุดไปช้าสุด
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: false });

      if (!error) setAppointments(data || []);
    }
    setLoading(false);
  };

  const setupRealtimeSubscription = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const channel = supabase.channel('status-updates')
      .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'appointments',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.new.status !== payload.old.status) {
            triggerNotification(payload.new.status);
            fetchAppointments(); 
          }
        }
      )
      .subscribe();

    return channel;
  };

  const triggerNotification = async (status: string) => {
    await LocalNotifications.requestPermissions();
    await LocalNotifications.schedule({
      notifications: [{
        title: "อัปเดตสถานะการนัดหมาย",
        body: `นัดหมายของคุณเปลี่ยนเป็น: ${status}`,
        id: Date.now(),
        sound: 'beep.wav',
      }]
    });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (!error) setAppointments(appointments.filter(app => app.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ยืนยันการรับนัด': 
      case 'ยืนยันการนัดหมาย': return 'success';
      case 'รอการยืนยัน': return 'warning';
      case 'ยกเลิกการนัดหมาย': return 'danger';
      default: return 'medium';
    }
  };

  // ฟังก์ชันช่วย Render แต่ละ Section
  const renderSection = (title: string, statusKeys: string[]) => {
    const filtered = appointments.filter(appt => statusKeys.includes(appt.status));
    if (filtered.length === 0) return null;

    return (
      <div className="appt-section-container">
        <div className="section-status-label">{title} ({filtered.length})</div>
        <IonList lines="none">
          {filtered.map((item) => (
            <IonItem key={item.id} className={`list-card card-border-${getStatusColor(item.status)}`}>
              <IonLabel>
                <h2 className="patient-name">{item.patient_name}</h2>
                <div className="appt-row-details">
                  <span><IonIcon icon={calendarOutline} /> {new Date(item.appointment_date).toLocaleDateString('th-TH')}</span>
                  <span style={{ marginLeft: '15px' }}><IonIcon icon={timeOutline} /> {item.appointment_time.substring(0, 5)} น.</span>
                </div>
                <IonBadge className="status-pill" color={getStatusColor(item.status)} style={{ marginTop: '8px' }}>
                  {item.status || 'รอการยืนยัน'}
                </IonBadge>
              </IonLabel>
              <IonButton fill="clear" color="danger" slot="end" onClick={() => { setSelectedId(item.id); setShowAlert(true); }}>
                <IonIcon icon={trashOutline} slot="icon-only" />
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      </div>
    );
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="AppointmentList-toolbar">
          <IonButtons slot="start"><IonBackButton defaultHref="/dashboard" /></IonButtons>
          <IonTitle className="AppointmentList-title">รายการนัดหมายของคุณ</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding bg-gray">
        <IonAlert isOpen={showAlert} onDidDismiss={() => setShowAlert(false)} header={'ยืนยันการลบ'} message={'คุณแน่ใจหรือไม่ว่าต้องการลบรายการนัดหมายนี้?'} buttons={[{ text: 'ยกเลิก', role: 'cancel' }, { text: 'ลบ', handler: () => { if (selectedId) handleDelete(selectedId); } }]} />

        {loading ? (
          <div className="center"><IonSpinner /></div>
        ) : appointments.length === 0 ? (
          <div className="center-text">ไม่มีรายการนัดหมาย</div>
        ) : (
          <>
            {/* แยกกลุ่มสถานะเรียงลำดับจากบนลงล่าง: รอ -> ยืนยัน -> ยกเลิก */}
            {renderSection("🟡 รอการยืนยัน", ["รอการยืนยัน"])}
            {renderSection("🟢 ยืนยันแล้ว", ["ยืนยันการรับนัด", "ยืนยันการนัดหมาย"])}
            {renderSection("🔴 ยกเลิกการนัดหมาย", ["ยกเลิกการนัดหมาย"])}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AppointmentList;
import React, { useState, useEffect } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, 
  IonBackButton, IonButton, IonItem, IonLabel, IonList, 
  IonSelect, IonSelectOption, IonToast, IonCard, IonCardContent, IonIcon,
  IonLoading
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import Calendar from 'react-calendar';
import { settingsOutline, calendarOutline, arrowForwardOutline } from 'ionicons/icons';
import { supabase } from '../supabaseClient';
import 'react-calendar/dist/Calendar.css';
import './DoctorCalendar.css';

const DoctorCalendar: React.FC = () => {
  const history = useHistory();
  const [value, setValue] = useState(new Date());

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [startTime, setStartTime] = useState('09:00:00'); 
  const [endTime, setEndTime] = useState('19:30:00');   
  const [action, setAction] = useState('lock'); 
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [dateOptions, setDateOptions] = useState<string[]>([]);
  const [showLoading, setShowLoading] = useState(false); // State สำหรับ Spinner

  const hardcodedSlots = [
    '09:00:00', '09:30:00', '10:00:00', '10:30:00', '11:00:00', '11:30:00',
    '13:00:00', '13:30:00', '14:00:00', '14:30:00', '15:00:00', '15:30:00',
    '16:00:00', '16:30:00', '17:00:00', '17:30:00', '18:00:00', '18:30:00', 
    '19:00:00', '19:30:00'
  ];

  useEffect(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i <= 60; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      dates.push(dateStr);
    }
    setDateOptions(dates);
  }, []);

  const handleApplyPreset = async () => {
    if (!startDate || !endDate) {
      setToastMsg('กรุณาเลือกช่วงวันที่');
      setShowToast(true);
      return;
    }

    setShowLoading(true); // เปิด Spinner

    let daysToProcess: string[] = [];
    let current = new Date(startDate + "T12:00:00");
    const last = new Date(endDate + "T12:00:00");

    while (current <= last) {
      const y = current.getFullYear();
      const m = String(current.getMonth() + 1).padStart(2, '0');
      const d = String(current.getDate()).padStart(2, '0');
      daysToProcess.push(`${y}-${m}-${d}`);
      current.setDate(current.getDate() + 1);
    }

    try {
      for (const dateStr of daysToProcess) {
        const targetSlots = hardcodedSlots.filter(slot => slot >= startTime && slot <= endTime);

        if (action === 'lock') {
          for (const slot of targetSlots) {
            await supabase.from('time_slot').delete().match({ date: dateStr, time: slot });
          }
          const { error } = await supabase.from('time_slot').insert(
            targetSlots.map(slot => ({ date: dateStr, time: slot, status: 'booked' }))
          );
          if (error) throw error;
        } else {
          for (const slot of targetSlots) {
            await supabase.from('time_slot').delete().match({ date: dateStr, time: slot });
          }
        }
      }
      setToastMsg('ดำเนินการสำเร็จแล้ว');
    } catch (err: any) {
      console.error('Error:', err.message);
      setToastMsg('เกิดข้อผิดพลาด: ' + err.message);
    } finally {
      setShowLoading(false); // ปิด Spinner
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonLoading
        isOpen={showLoading}
        message={'กำลังบันทึกข้อมูล Preset...'}
        spinner="circles"
      />

      <IonHeader className="ion-no-border">
        <IonToolbar className="doc-calendar-header">
          <IonButtons slot="start"><IonBackButton defaultHref="/doctor-dashboard" /></IonButtons>
          <IonTitle>จัดการเวลาทำงาน</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding doc-calendar-bg">
        <div className="main-center-container"> {/* Container สำหรับจัดกึ่งกลาง */}
          <IonToast isOpen={showToast} message={toastMsg} duration={2000} onDidDismiss={() => setShowToast(false)} />

          <div className="section-title center-text">
            <IonIcon icon={calendarOutline} /> <strong>จัดการรายวัน</strong>
          </div>
          
          <div className="calendar-wrapper">
            <Calendar 
              onChange={(val: any) => history.push(`/doctor/slot-manager/${val.toISOString().split('T')[0]}`)} 
              value={value} 
              locale="th-TH" 
            />
          </div>

          <div className="divider-line"></div>

          <IonCard className="preset-card center-card">
            <IonCardContent>
              <div className="preset-header center-justify">
                <IonIcon icon={settingsOutline} /> <strong>Preset (ล็อคช่วงเวลา)</strong>
              </div>
              
              <div className="date-select-row">
                <IonItem className="date-item" lines="none">
                  <IonLabel position="stacked">จากวันที่</IonLabel>
                  <IonSelect 
                    value={startDate} 
                    placeholder="เลือกวัน" 
                    onIonChange={(e) => setStartDate(e.detail.value)}
                  >
                    {dateOptions.map(d => {
                      const displayDate = new Date(d + "T12:00:00");
                      displayDate.setDate(displayDate.getDate() + 1);
                      const y = displayDate.getFullYear();
                      const m = String(displayDate.getMonth() + 1).padStart(2, '0');
                      const day = String(displayDate.getDate()).padStart(2, '0');
                      return <IonSelectOption key={d} value={d}>{`${day}/${m}/${y}`}</IonSelectOption>;
                    })}
                  </IonSelect>
                </IonItem>

                <div className="date-arrow"><IonIcon icon={arrowForwardOutline} /></div>

                <IonItem className="date-item" lines="none">
                  <IonLabel position="stacked">ถึงวันที่</IonLabel>
                  <IonSelect 
                    value={endDate} 
                    placeholder="เลือกวัน" 
                    onIonChange={(e) => setEndDate(e.detail.value)}
                  >
                    {dateOptions.map(d => {
                      const displayDate = new Date(d + "T12:00:00");
                      displayDate.setDate(displayDate.getDate() + 1);
                      const y = displayDate.getFullYear();
                      const m = String(displayDate.getMonth() + 1).padStart(2, '0');
                      const day = String(displayDate.getDate()).padStart(2, '0');
                      return <IonSelectOption key={d} value={d}>{`${day}/${m}/${y}`}</IonSelectOption>;
                    })}
                  </IonSelect>
                </IonItem>
              </div>

              <div className="time-row">
                <IonItem className="time-item" lines="none">
                  <IonLabel position="stacked">เริ่ม</IonLabel>
                  <IonSelect value={startTime} onIonChange={e => setStartTime(e.detail.value)}>
                    {hardcodedSlots.map(s => <IonSelectOption key={s} value={s}>{s.substring(0,5)}</IonSelectOption>)}
                  </IonSelect>
                </IonItem>
                <IonItem className="time-item" lines="none">
                  <IonLabel position="stacked">ถึง</IonLabel>
                  <IonSelect value={endTime} onIonChange={e => setEndTime(e.detail.value)}>
                    {hardcodedSlots.map(s => <IonSelectOption key={s} value={s}>{s.substring(0,5)}</IonSelectOption>)}
                  </IonSelect>
                </IonItem>
              </div>

              <IonItem className="action-item" lines="none">
                <IonLabel position="stacked">การดำเนินการ</IonLabel>
                <IonSelect value={action} onIonChange={e => setAction(e.detail.value)}>
                  <IonSelectOption value="lock">🔒 ล็อคเวลา</IonSelectOption>
                  <IonSelectOption value="unlock">🔓 เปิดว่าง</IonSelectOption>
                </IonSelect>
              </IonItem>
              
              <IonButton expand="block" className="apply-preset-btn" onClick={handleApplyPreset}>
                บันทึก PRESET
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DoctorCalendar;
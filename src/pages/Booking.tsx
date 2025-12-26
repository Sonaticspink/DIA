import React, { useState } from 'react';
import { 
  IonContent, IonPage, IonHeader, IonToolbar, 
  IonTitle, IonGrid, IonRow, IonCol, 
  IonButton, IonInput, IonTextarea, IonAlert,
  IonModal, IonDatetime, IonItem, IonLabel
} from '@ionic/react';
import { format, parseISO } from 'date-fns'; // Useful for formatting dates

const Booking: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('2025-12-31T10:00:00');
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '13:00', '13:30', '14:00', '14:30'];

  // Formats the date to look nice in the input field (e.g., 31 Dec 2025)
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'dd MMM yyyy');
  };

  const handleConfirm = () => {
    if (!selectedTime) {
      alert("กรุณาเลือกช่วงเวลา");
      return;
    }
    setShowAlert(true);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle color="primary" className="ion-text-center">จองคิว</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h5 className="section-title">📅 จองวันและเวลาพบแพทย์</h5>
        
        <label>1. เลือกวันที่ต้องการ:</label>
        {/* Clickable input that opens the modal */}
        <div onClick={() => setShowModal(true)}>
          <IonInput 
            value={formatDate(selectedDate)} 
            className="custom-input" 
            readonly 
          />
        </div>

        {/* Calendar Pop-up Modal */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} initialBreakpoint={0.5} breakpoints={[0, 0.5, 0.8]}>
          <IonContent className="ion-padding">
            <IonDatetime
              presentation="date"
              value={selectedDate}
              onIonChange={e => {
                setSelectedDate(e.detail.value as string);
                setShowModal(false); // Close modal after selection
              }}
              highlightedDates={[
                { date: '2025-12-31', textColor: '#ffffff', backgroundColor: '#ff829d' }
              ]}
            />
          </IonContent>
        </IonModal>

        <label style={{ marginTop: '20px', display: 'block' }}>2. เลือกช่วงเวลาที่ว่าง:</label>
        <IonGrid>
          <IonRow>
            {timeSlots.map(time => (
              <IonCol size="4" key={time}>
                <IonButton 
                  expand="block" 
                  fill={selectedTime === time ? 'solid' : 'outline'} 
                  color={selectedTime === time ? 'primary' : 'medium'}
                  className="time-slot"
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </IonButton>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <label>3. ข้อมูลผู้ป่วย:</label>
        <IonInput placeholder="ชื่อ-นามสกุล" className="custom-input" />
        <IonTextarea placeholder="อาการเบื้องต้น" rows={4} className="custom-input" />

        <IonButton expand="block" className="confirm-btn" onClick={handleConfirm}>
          ยืนยันการนัดหมาย
        </IonButton>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'จองคิวสำเร็จ'}
          message={`วันที่: ${formatDate(selectedDate)} เวลา: ${selectedTime} น.`}
          buttons={['ตกลง']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Booking;
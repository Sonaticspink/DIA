import React from 'react';
import { 
  IonContent, IonPage, IonButton, IonIcon, IonText 
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import { checkmarkCircle } from 'ionicons/icons';
import './SuccessPage.css'

const SuccessPage: React.FC = () => {
  const history = useHistory();
  const { date, time } = useParams<{ date: string, time: string }>();

  const thaiDate = new Date(date).toLocaleDateString('th-TH', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <IonPage>
      <IonContent className="ion-padding success-bg">
        <div className="success-container">
          {/* Big Success Icon */}
          <div className="icon-box">
            <IonIcon icon={checkmarkCircle} color="success" className="big-check" />
          </div>

          <h1 className="success-title">จองนัดหมายสำเร็จ!</h1>
          <p className="success-subtitle">กรุณารอการติดต่อกลับจากเจ้าหน้าที่</p>

          {/* Minimal Receipt Box */}
          <div className="receipt-summary">
            <div className="receipt-row">
              <span>วันที่:</span>
              <strong>{thaiDate}</strong>
            </div>
            <div className="receipt-row">
              <span>เวลา:</span>
              <strong>{time} น.</strong>
            </div>
          </div>

          <div className="success-footer">
            <IonButton 
              expand="block" 
              shape="round" 
              color="primary" 
              className="ok-btn"
              onClick={() => history.push('/dashboard')}
            >
              ตกลง
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SuccessPage;
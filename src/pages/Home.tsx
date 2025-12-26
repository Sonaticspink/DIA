/* Page: Home.tsx */
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonCard, IonCardContent, IonText } from '@ionic/react';
import '../Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle color="primary" className="ion-text-center">คลินิกมงคลคีรี</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h3>สวัสดีครับ 👋</h3>

        {/* Current Queue Card */}
        <div className="queue-card">
          <div className="queue-info">
            <p>คิวปัจจุบันของคุณ</p>
            <h1>A-05</h1>
          </div>
          <div className="wait-time">
            <p>รออีกประมาณ</p>
            <h2>15 นาที</h2>
          </div>
        </div>

        {/* Next Appointment Card */}
        <IonCard className="appointment-card">
          <IonCardContent>
            <IonText color="medium">นัดหมายถัดไปของคุณ</IonText>
            <h4 style={{ color: '#ff829d' }}>24 ธ.ค. 2568 | 10:30 น.</h4>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Home;
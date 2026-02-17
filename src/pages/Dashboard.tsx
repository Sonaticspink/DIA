import { 
  IonContent, IonPage, IonHeader, IonToolbar, 
  IonTitle, IonButton, IonIcon, IonAvatar, IonButtons 
} from '@ionic/react';
import { book, calendar, medical, logOutOutline } from 'ionicons/icons';
import './Dashboard.css';
import { useHistory } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Dashboard: React.FC = () => {
    const history = useHistory();

    // ดึงชื่อวันปัจจุบันภาษาไทย (เช่น วันจันทร์, วันอังคาร)
    const currentDay = new Intl.DateTimeFormat('th-TH', { weekday: 'long' }).format(new Date());

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            history.push('/home'); // กลับไปหน้าล็อกอิน
        } else {
            alert("Error logging out: " + error.message);
        }
    };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="dashboard-toolbar">
          {/* แสดงผลชื่อวันแบบไดนามิก */}
          <IonTitle className="dashboard-title">สวัสดี{currentDay}</IonTitle>
          
          <IonButtons slot="end">
            <IonButton onClick={handleLogout} color="danger">
              <IonIcon slot="icon-only" icon={logOutOutline} />
            </IonButton>
            <IonAvatar className="user-avatar" style={{ marginInline: '10px' }}>
              <img src="https://ionicframework.com/docs/img/demos/avatar.svg" alt="user" />
            </IonAvatar>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding dashboard-content">
        <div className="button-list">
          <IonButton expand="block" className="dash-button">
            <IonIcon slot="start" icon={book} />
            บันทึก
          </IonButton>

          <IonButton routerLink="/appointment" expand="block" className="dash-button">
            <IonIcon slot="start" icon={calendar} />
            การนัดหมาย
          </IonButton>

          <IonButton expand="block" className="dash-button" onClick={() => history.push('/inventory')}>
             <IonIcon slot="start" icon={medical} />
             ยารักษา
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
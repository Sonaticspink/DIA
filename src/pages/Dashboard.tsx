import { 
  IonContent, IonPage, IonHeader, IonToolbar, 
  IonTitle, IonButton, IonIcon, IonAvatar 
} from '@ionic/react';
import { book, calendar, medical } from 'ionicons/icons';
import './Dashboard.css';
import { useHistory } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const history = useHistory();
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="dashboard-toolbar">
          <IonTitle className="dashboard-title">สวัสดีปกป้อง</IonTitle>
          <IonAvatar slot="end" className="user-avatar">
            <img src="https://ionicframework.com/docs/img/demos/avatar.svg" alt="user" />
          </IonAvatar>
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
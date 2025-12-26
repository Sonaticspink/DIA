import { 
  IonContent, IonPage, IonInput, IonButton, 
  IonImg, IonRouterLink, IonGrid, IonRow, IonCol 
} from '@ionic/react';
import './Signup.css';

const Signup: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding signup-background">
        <div className="signup-container">
          <div className="logo-section">
            <IonImg src="assets/logo.png" />
          </div>

          <h2 className="signup-title">ลงทะเบียน</h2>

          <div className="input-group">
            <IonInput placeholder="เบอร์โทร" className="custom-input" />
            
            {/* Side-by-side Name and Surname */}
            <IonGrid className="ion-no-padding">
              <IonRow>
                <IonCol size="6" style={{ paddingRight: '5px' }}>
                  <IonInput placeholder="ชื่อ" className="custom-input" />
                </IonCol>
                <IonCol size="6" style={{ paddingLeft: '5px' }}>
                  <IonInput placeholder="นามสกุล" className="custom-input" />
                </IonCol>
              </IonRow>
            </IonGrid>

            <IonInput placeholder="รหัสผ่าน" type="password" className="custom-input" />
            <IonInput placeholder="รหัสผ่านอีกครั้ง" type="password" className="custom-input" />
          </div>

          <div className="button-group">
            <IonButton expand="block" className="main-button">สร้างบัญชี</IonButton>
          </div>

          <div className="footer-text">
            <span>มีบัญชีแล้ว? </span>
            <IonRouterLink routerLink="/home" className="link-text">
              ลงชื่อเข้าใช้งาน
            </IonRouterLink>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Signup;
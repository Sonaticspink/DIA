import { 
  IonContent, 
  IonPage, 
  IonInput, 
  IonButton, 
  IonText, 
  IonImg ,
  IonRouterLink
} from '@ionic/react';
import './Home.css';
import { useHistory } from 'react-router-dom';

const Home: React.FC = () => {
  const history = useHistory();

  const handleLogin = () => {
    // Here you would normally validate the user
    history.push('/dashboard');
  };
  return (
    <IonPage>
      <IonContent className="ion-padding login-background">
        <div className="login-container">
          
          {/* Logo Section */}
          <div className="logo-section">
            <IonImg src="assets/logo.png" className="app-logo" />
          </div>

          <h2 className="login-title">ลงชื่อเข้าใช้งาน</h2>

          {/* Input Fields */}
          <div className="input-group">
            <IonInput 
              placeholder="เบอร์โทร" 
              className="custom-input" 
              type="tel"
            />
            <IonInput 
              placeholder="รหัสผ่าน" 
              className="custom-input" 
              type="password"
            />
            <p className="forgot-password">ลืมรหัสผ่าน?</p>
          </div>

          {/* Action Buttons */}
          <div className="button-group">
            <IonButton expand="block" className="main-button" onClick={handleLogin}>
              เข้าสู่ระบบ
            </IonButton>
            <IonButton expand="block" className="main-button secondary">
              ไม่ใช้บัญชี
            </IonButton>
          </div>

          {/* Footer */}
            <div className="footer-text">
              <span>ยังไม่มีบัญชี </span>
              <IonRouterLink routerLink="/signup" className="register-link">
                ลงทะเบียน
              </IonRouterLink>
            </div>
          
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
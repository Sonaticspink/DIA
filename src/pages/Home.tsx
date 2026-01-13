import React, { useState } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonInput, 
  IonButton, 
  IonImg,
  IonRouterLink,
  IonLoading,
  IonToast
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Home.css';

const Home: React.FC = () => {
  const history = useHistory();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGuestLogin = async () => {
  setLoading(true);
  const { error } = await supabase.auth.signInAnonymously(); // Creates unique Guest ID
  setLoading(false);

  if (error) {
    setErrorMsg("เกิดข้อผิดพลาด: " + error.message);
  } else {
    history.push('/dashboard');
  }
};

const handleLogin = async () => {
  if (!phone || !password) {
    setErrorMsg("กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }

  setLoading(true);

  // 1. SPECIFIC DOCTOR CHECK
  // You can set these to whatever you prefer
  const adminUsername = "doctor_admin"; 
  const adminPassword = "password1234";

  if (phone === adminUsername && password === adminPassword) {
    setLoading(false);
    history.push('/doctor-dashboard'); // Go to the pink doctor dashboard
    return;
  }

  // 2. REGULAR USER LOGIN (Old Logic)
  const email = `${phone}@myapp.com`;
  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  setLoading(false);

  if (error) {
    setErrorMsg("เบอร์โทรหรือรหัสผ่านไม่ถูกต้อง");
  } else {
    history.push('/dashboard');
  }
};

  return (
    <IonPage>
      <IonLoading isOpen={loading} message={"กำลังเข้าสู่ระบบ..."} />
      <IonToast 
        isOpen={!!errorMsg} 
        message={errorMsg} 
        duration={2000} 
        onDidDismiss={() => setErrorMsg('')} 
        color="danger"
      />
      
      <IonContent className="ion-padding login-background">
        <div className="login-container">
          <div className="logo-section">
            <IonImg src="/logo.png" className="app-logo" />
          </div>

          <h2 className="login-title">ลงชื่อเข้าใช้งาน</h2>

          <div className="input-group">
            <IonInput 
              placeholder="เบอร์โทร" 
              className="custom-input" 
              type="tel"
              value={phone}
              onIonInput={(e: any) => setPhone(e.target.value)}
            />
            <IonInput 
              placeholder="รหัสผ่าน" 
              className="custom-input" 
              type="password"
              value={password}
              onIonInput={(e: any) => setPassword(e.target.value)}
            />
            <p className="forgot-password">ลืมรหัสผ่าน?</p>
          </div>

          <div className="button-group">
            <IonButton expand="block" className="main-button" onClick={handleLogin}>
              เข้าสู่ระบบ
            </IonButton>
              <IonButton expand="block" className="main-button secondary" onClick={handleGuestLogin}>
                ไม่ใช้บัญชี
              </IonButton>
          </div>

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
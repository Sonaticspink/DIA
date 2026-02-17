import React, { useState, useEffect } from 'react';
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
import { useHistory, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Home.css';

const Home: React.FC = () => {
  const history = useHistory();
  const location = useLocation<{ registeredPhone?: string }>();
  
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // ดึงเบอร์โทรอัตโนมัติหากเพิ่งสมัครสมาชิกเสร็จ
  useEffect(() => {
    if (location.state && location.state.registeredPhone) {
      setPhone(location.state.registeredPhone);
    }
  }, [location]);

  const handleLogin = async () => {
    if (!phone || !password) {
      setErrorMsg("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (phone.length !== 10) {
      setErrorMsg("กรุณากรอกเบอร์โทรให้ครบ 10 หลัก");
      return;
    }

    setLoading(true);

    // กำหนดเบอร์โทรของคุณหมอเพื่อใช้แยกหน้า Dashboard
    const adminUsername = "0821529499"; 

    // ล็อกอินผ่าน Supabase Auth เพื่อให้ได้สิทธิ์ Authenticated ไปจัดการตารางเวลา
    const { error } = await supabase.auth.signInWithPassword({
      email: `${phone}@myapp.com`,
      password: password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg("เบอร์โทรหรือรหัสผ่านไม่ถูกต้อง");
    } else {
      // ถ้าล็อกอินสำเร็จ ตรวจสอบว่าเป็นหมอหรือคนไข้
      if (phone === adminUsername) {
        history.push('/doctor-dashboard');
      } else {
        history.push('/dashboard');
      }
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInAnonymously();
    setLoading(false);
    if (error) {
      setErrorMsg("เกิดข้อผิดพลาด: " + error.message);
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
              maxlength={10}
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
              ใช้งานแบบไม่ใช้บัญชี
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
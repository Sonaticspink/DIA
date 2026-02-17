import { useState } from 'react';
import { 
  IonContent, IonPage, IonInput, IonButton, 
  IonImg, IonRouterLink, IonGrid, IonRow, IonCol, IonLoading, IonToast 
} from '@ionic/react';
import { supabase } from '../supabaseClient';
import { useHistory } from 'react-router-dom';
import './Signup.css';

const Signup: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const history = useHistory();

  const handleSignup = async () => {
    // 1. ตรวจสอบเบอร์โทรต้องมี 10 หลัก
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setErrorMsg("กรุณากรอกเบอร์โทรเป็นตัวเลข 10 หลัก");
      return;
    }

    // 2. ตรวจสอบชื่อ-นามสกุล
    if (!firstName || !lastName) {
      setErrorMsg("กรุณากรอกชื่อและนามสกุลให้ครบถ้วน");
      return;
    }

    // 3. ตรวจสอบรหัสผ่านขั้นต่ำ 6 ตัว
    if (password.length < 6) {
      setErrorMsg("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setLoading(true);
    const email = `${phone}@myapp.com`;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setErrorMsg(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: authData.user.id, 
            first_name: firstName, 
            last_name: lastName, 
            phone: phone 
          }
        ]);

      if (profileError) {
        setErrorMsg("Profile Error: " + profileError.message);
      } else {
        // ส่งเบอร์โทรไปยังหน้าล็อกอินผ่าน state
        history.push('/home', { registeredPhone: phone }); 
      }
    }
    setLoading(false);
  };

  return (
    <IonPage>
      <IonLoading isOpen={loading} message="กำลังสร้างบัญชี..." />
      <IonToast 
        isOpen={!!errorMsg} 
        message={errorMsg} 
        duration={2000} 
        onDidDismiss={() => setErrorMsg('')} 
        color="danger"
      />
      <IonContent className="ion-padding signup-background">
        <div className="signup-container">
          <div className="logo-section">
            <IonImg src="/logo.png" className="app-logo" />
          </div>

          <h2 className="signup-title">ลงทะเบียน</h2>
          <div className="input-group">
            <IonInput 
              placeholder="เบอร์โทร" 
              type="tel"
              maxlength={10} 
              className="custom-input" 
              onIonInput={(e:any) => setPhone(e.target.value)} 
            />
            <IonGrid className="ion-no-padding">
              <IonRow>
                <IonCol size="6" style={{ paddingRight: '5px' }}>
                  <IonInput placeholder="ชื่อ" className="custom-input" onIonInput={(e:any) => setFirstName(e.target.value)} />
                </IonCol>
                <IonCol size="6" style={{ paddingLeft: '5px' }}>
                  <IonInput placeholder="นามสกุล" className="custom-input" onIonInput={(e:any) => setLastName(e.target.value)} />
                </IonCol>
              </IonRow>
            </IonGrid>
            <IonInput 
              placeholder="รหัสผ่าน (6 ตัวขึ้นไป)" 
              type="password" 
              className="custom-input" 
              onIonInput={(e:any) => setPassword(e.target.value)} 
            />
          </div>
          <div className="button-group">
            <IonButton expand="block" className="main-button" onClick={handleSignup}>สร้างบัญชี</IonButton>
          </div>
          <div className="footer-text">
            <span>มีบัญชีอยู่แล้ว? </span>
            <IonRouterLink routerLink="/home" className="register-link">เข้าสู่ระบบ</IonRouterLink>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Signup;
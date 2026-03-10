import { useState } from 'react';
import { 
  IonContent, IonPage, IonInput, IonButton, 
  IonImg, IonRouterLink, IonGrid, IonRow, IonCol, IonLoading 
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
  const history = useHistory();

  const handleSignup = async () => {
    setLoading(true);
    // Supabase requires email. We create one from the phone number.
    const email = `${phone}@myapp.com`;

    // 1. Create Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      alert(authError.message);
      setLoading(false);
      return;
    }

    // 2. Insert into Profiles Table
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
        alert("Profile Error: " + profileError.message);
      } else {
        alert("ลงทะเบียนสำเร็จ!");
        history.push('/home');
      }
    }
    setLoading(false);
  };

  return (
    <IonPage>
      <IonLoading isOpen={loading} />
      <IonContent className="ion-padding signup-background">
        <div className="signup-container">
          {/* Logo Section กูอยู่ตรงนี้*/} 
                <div className="logo-section">
                     <IonImg src="assets/logo.png" className="app-logo" />
                              
          </div>

          <h2 className="signup-title">ลงทะเบียน</h2>
          <div className="input-group">
            <IonInput placeholder="เบอร์โทร" className="custom-input" onIonInput={(e:any) => setPhone(e.target.value)} />
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
            <IonInput placeholder="รหัสผ่าน" type="password" className="custom-input" onIonInput={(e:any) => setPassword(e.target.value)} />
          </div>
          <div className="button-group">
            <IonButton expand="block" className="main-button" onClick={handleSignup}>สร้างบัญชี</IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Signup;
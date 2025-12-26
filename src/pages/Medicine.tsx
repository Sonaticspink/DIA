import React, { useState, useEffect } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonCard, 
  IonCardContent, 
  IonImg, 
  IonSpinner, 
  IonBadge, 
  IonText 
} from '@ionic/react';
import { supabase } from '../supabaseClient';
import '../Home.css';

const Medicine: React.FC = () => {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicines();
  }, []);

  async function fetchMedicines() {
    setLoading(true);
    // Note: Ensure your table name in Supabase is 'drugs' to match your schema
    const { data, error } = await supabase
      .from('medicines')
      .select('*');
    
    if (error) {
      console.error('Error fetching drugs:', error.message);
    } else {
      setMedicines(data || []);
    }
    setLoading(false);
  }

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle color="primary" className="ion-text-center">ข้อมูลยา</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <IonSpinner name="crescent" color="primary" />
          </div>
        ) : (
          medicines.map((med) => (
            <IonCard key={med.id} className="medicine-card">
              {/* image_url field */}
              <IonImg src={med.image_url} className="med-image" />
              
              <IonCardContent>
                {/* name field */}
                <h2 style={{ color: '#ff829d', fontWeight: 'bold', fontSize: '1.4rem' }}>
                  {med.name}
                </h2>

                {/* usage field */}
                <p style={{ marginTop: '8px' }}>
                  <strong>สรรพคุณ:</strong> {med.usage}
                </p>

                {/* detail field */}
                <p>
                  <strong>รายละเอียด:</strong> {med.detail}
                </p>

                {/* warning field - styled in red for visibility */}
                {med.warning && (
                  <div style={{ marginTop: '10px', padding: '8px', background: '#fff5f5', borderRadius: '8px' }}>
                    <IonText color="danger">
                      <strong>⚠️ คำเตือน:</strong> {med.warning}
                    </IonText>
                  </div>
                )}
              </IonCardContent>
            </IonCard>
          ))
        )}

        {!loading && medicines.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <IonText color="medium">ไม่พบข้อมูลยาในระบบ</IonText>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Medicine;
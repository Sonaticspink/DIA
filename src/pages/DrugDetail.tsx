import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonBackButton, IonButtons, IonImg, IonText, IonIcon
} from '@ionic/react';
import { warningOutline, medkitOutline, documentTextOutline, alertCircleOutline } from 'ionicons/icons';
import { supabase } from '../supabaseClient';
import './DrugDetail.css';

const DrugDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [drug, setDrug] = useState<any>(null);

  useEffect(() => {
    const fetchDrugData = async () => {
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .eq('id', id)
        .single();
      if (data) setDrug(data);
    };
    fetchDrugData();
  }, [id]);

  if (!drug) return <IonPage><IonContent>กำลังโหลด...</IonContent></IonPage>;

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/inventory" text="" />
          </IonButtons>
          <IonTitle>รายละเอียดตัวยา</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="drug-detail-content">
        <div className="image-container">
          <IonImg src={drug.image_url} alt={drug.name} />
        </div>

        <div className="detail-card">
          <div className="header-section">
            <h1 className="drug-name">{drug.name}</h1>
            <div className="badge">ประเภทยาแผนปัจจุบัน</div>
          </div>

          <div className="info-section">
            <div className="info-item">
              <div className="icon-wrapper usage">
                <IonIcon icon={medkitOutline} />
              </div>
              <div className="info-text">
                <h3>สรรพคุณ/วิธีใช้</h3>
                <p>{drug.usage}</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-wrapper detail">
                <IonIcon icon={documentTextOutline} />
              </div>
              <div className="info-text">
                <h3>รายละเอียดเพิ่มเติม</h3>
                <p>{drug.detail}</p>
              </div>
            </div>

            {drug.warning && (
              <div className="info-item warning">
                <div className="icon-wrapper warning">
                  <IonIcon icon={alertCircleOutline} />
                </div>
                <div className="info-text">
                  <h3 className="warning-title">คำเตือน</h3>
                  <p>{drug.warning}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DrugDetail;
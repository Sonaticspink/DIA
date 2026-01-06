import { 
  IonContent, IonPage, IonHeader, IonToolbar, IonButtons, 
  IonBackButton, IonTitle, IonSearchbar, IonGrid, IonRow, IonCol, IonCard, IonImg, IonText 
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './DrugInventory.css';

const DrugInventory: React.FC = () => {
  const [drugs, setDrugs] = useState<any[]>([]);

  useEffect(() => {
    fetchDrugs();
  }, []);

  const fetchDrugs = async () => {
    const { data, error } = await supabase.from('medicines').select('*');
    if (!error && data) setDrugs(data);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="inventory-header">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/dashboard" text="ย้อนกลับ" />
          </IonButtons>
        </IonToolbar>
        <div className="search-container">
          <IonSearchbar placeholder="ค้นหายา" className="custom-search" />
        </div>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            {drugs.map((drug) => (
              <IonCol size="6" key={drug.id}>
                <IonCard className="drug-card">
                  <div className="image-wrapper">
                    <IonImg src={drug.image_url} />
                  </div>
                  <div className="drug-name-label">
                    <IonText>{drug.name}</IonText>
                  </div>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
        
        {/* Pagination placeholder */}
        <div className="pagination">
          <span className="active">1</span> <span>2</span> <span>3</span> ... <span>68</span>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DrugInventory;
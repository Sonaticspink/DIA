import { 
  IonContent, IonPage, IonHeader, IonToolbar, IonButtons, 
  IonBackButton, IonSearchbar, IonGrid, IonRow, IonCol, IonCard, IonImg, IonText 
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './DrugInventory.css';

const DrugInventory: React.FC = () => {
  const [drugs, setDrugs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(''); // State สำหรับเก็บคำค้นหา
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 6; 

  // เรียกข้อมูลใหม่เมื่อเปลี่ยนหน้า หรือ เมื่อพิมพ์ค้นหา
  useEffect(() => {
    fetchDrugs();
  }, [currentPage, searchTerm]);

  const fetchDrugs = async () => {
    const from = (currentPage - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    // สร้าง Query พื้นฐาน
    let query = supabase
      .from('medicines')
      .select('*', { count: 'exact' });

    // ถ้ามีการพิมพ์ค้นหา ให้เพิ่มเงื่อนไข ilike (ค้นหาแบบไม่สนตัวพิมพ์เล็ก-ใหญ่)
    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`);
    }

    // กำหนดช่วงหน้าที่จะดึงข้อมูล
    const { data, error, count } = await query.range(from, to);
    
    if (!error && data) {
      setDrugs(data);
      if (count !== null) setTotalItems(count);
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const renderPagination = () => {
    const pages = [];
    if (totalPages <= 1) return null; // ไม่แสดงถ้ามีแค่หน้าเดียว

    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
      pages.push(
        <span 
          key={i} 
          className={currentPage === i ? "active" : ""} 
          onClick={() => setCurrentPage(i)}
          style={{ cursor: 'pointer', margin: '0 5px' }}
        >
          {i}
        </span>
      );
    }
    return pages;
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="inventory-header">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/dashboard" text="ย้อนกลับ" className="custom-back-btn"/>
          </IonButtons>
        </IonToolbar>
        <div className="search-container">
          {/* อัปเดตคำค้นหาเมื่อผู้ใช้พิมพ์ และรีเซ็ตหน้าไปที่หน้า 1 เสมอเมื่อค้นหาใหม่ */}
          <IonSearchbar 
            value={searchTerm}
            onIonInput={(e: any) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); 
            }}
            placeholder="ค้นหายา" 
            className="custom-search" 
          />
        </div>
      </IonHeader>

      <IonContent className="ion-padding">
        {drugs.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <IonText color="medium">ไม่พบรายการยาที่ค้นหา</IonText>
          </div>
        ) : (
          <IonGrid>
            <IonRow>
              {drugs.map((drug) => (
                <IonCol size="6" key={drug.id}>
                  <IonCard button className="drug-card" routerLink={`/drug-detail/${drug.id}`}>
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
        )}
        
        <div className="pagination">
          {renderPagination()}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DrugInventory;
import React, { useEffect, useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonButton, IonIcon, IonModal, IonInput, IonTextarea, IonImg, IonFab, IonFabButton
} from '@ionic/react';
import { trash, create, add } from 'ionicons/icons';
import { supabase } from '../supabaseClient';
import './ManageDrugs.css'; // New dedicated CSS

const ManageDrugs: React.FC = () => {
  const [drugs, setDrugs] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDrug, setEditingDrug] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', image_url: '', usage: '', detail: '', warning: '' });

  useEffect(() => { fetchDrugs(); }, []);

  const fetchDrugs = async () => {
    // Fetching medicine data from your Supabase table
    const { data } = await supabase.from('medicines').select('*').order('id', { ascending: true });
    if (data) setDrugs(data);
  };

  const handleSave = async () => {
    if (editingDrug) {
      await supabase.from('medicines').update(formData).eq('id', editingDrug.id);
    } else {
      await supabase.from('medicines').insert([formData]);
    }
    closeModal();
    fetchDrugs();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDrug(null);
    setFormData({ name: '', image_url: '', usage: '', detail: '', warning: '' });
  };

  const deleteDrug = async (id: number) => {
    const confirm = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบยานี้?");
    if (confirm) {
      await supabase.from('medicines').delete().eq('id', id);
      fetchDrugs();
    }
  };

  const openEdit = (drug: any) => {
    setEditingDrug(drug);
    setFormData({ name: drug.name, image_url: drug.image_url, usage: drug.usage, detail: drug.detail, warning: drug.warning });
    setShowModal(true);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="manage-drugs-header">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/doctor-dashboard" />
          </IonButtons>
          <IonTitle>จัดการข้อมูลยา</IonTitle>
            {/* ➕ Add Button on Navbar Right */}
  <IonButtons slot="end">
    <IonButton fill="clear" onClick={() => setShowModal(true)} className="nav-add-btn-green">
      <IonIcon icon={add} slot="icon-only" />
    </IonButton>
  </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="manage-drugs-bg">
        <IonList className="drug-management-list" lines="full">
          {drugs.map((drug) => (
            <IonItem key={drug.id} className="drug-item-card">
              <div className="drug-thumb-container">
                 <IonImg src={drug.image_url} className="drug-list-img" />
              </div>
              <IonLabel className="drug-info-label">
                <h2 className="drug-name-text">{drug.name}</h2>
                <p className="drug-usage-preview">{drug.usage}</p>
              </IonLabel>
              <div className="action-icons">
                <IonButton fill="clear" onClick={() => openEdit(drug)} color="primary">
                  <IonIcon icon={create} slot="icon-only" />
                </IonButton>
                <IonButton fill="clear" onClick={() => deleteDrug(drug.id)} color="danger">
                  <IonIcon icon={trash} slot="icon-only" />
                </IonButton>
              </div>
            </IonItem>
          ))}
        </IonList>

        {/* Floating Action Button for Adding New Medicine */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowModal(true)} className="pink-fab">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonModal isOpen={showModal} onDidDismiss={closeModal} className="drug-modal">
          <IonHeader>
            <IonToolbar className="modal-header-pink">
              <IonTitle>{editingDrug ? 'แก้ไขข้อมูลยา' : 'เพิ่มยาใหม่'}</IonTitle>
              <IonButtons slot="end">
    <IonButton
      fill="clear"
      onClick={closeModal}
      className="modal-close-btn-red"
    >
      ปิด
    </IonButton>
  </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding modal-content">
            <div className="input-group-pink">
              <IonInput label="ชื่อยา" labelPlacement="stacked" fill="outline" value={formData.name} onIonInput={e => setFormData({...formData, name: e.detail.value!})} />
              <IonInput label="URL รูปภาพ" labelPlacement="stacked" fill="outline" value={formData.image_url} onIonInput={e => setFormData({...formData, image_url: e.detail.value!})} />
              <IonTextarea label="สรรพคุณ/วิธีใช้" labelPlacement="stacked" fill="outline" rows={2} value={formData.usage} onIonInput={e => setFormData({...formData, usage: e.detail.value!})} />
              <IonTextarea label="รายละเอียด" labelPlacement="stacked" fill="outline" rows={3} value={formData.detail} onIonInput={e => setFormData({...formData, detail: e.detail.value!})} />
              <IonTextarea label="คำเตือน" labelPlacement="stacked" fill="outline" rows={2} value={formData.warning} onIonInput={e => setFormData({...formData, warning: e.detail.value!})} />
            </div>
            <IonButton expand="block" onClick={handleSave} className="pink-save-btn">บันทึกข้อมูล</IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ManageDrugs;
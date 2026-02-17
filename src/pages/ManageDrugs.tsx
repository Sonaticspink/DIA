import React, { useEffect, useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonButton, IonIcon, IonModal, IonInput, IonTextarea, IonImg, IonFab, IonFabButton, IonSpinner
} from '@ionic/react';
import { trash, create, add, cameraOutline } from 'ionicons/icons';
import { supabase } from '../supabaseClient';
import './ManageDrugs.css';

const ManageDrugs: React.FC = () => {
  const [drugs, setDrugs] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDrug, setEditingDrug] = useState<any>(null);
  const [uploading, setUploading] = useState(false); // State สำหรับสถานะการอัปโหลด
  const [formData, setFormData] = useState({ name: '', image_url: '', usage: '', detail: '', warning: '' });

  useEffect(() => { fetchDrugs(); }, []);

  const fetchDrugs = async () => {
    const { data } = await supabase.from('medicines').select('*').order('id', { ascending: true });
    if (data) setDrugs(data);
  };

  // ฟังก์ชันอัปโหลดรูปภาพไปยัง Supabase Storage
  const handleFileUpload = async (event: any) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // อัปโหลดเข้าสู่ Bucket 'medicine-images'
      const { error: uploadError } = await supabase.storage
        .from('medicine-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // ดึง URL สาธารณะมาเก็บไว้ใน formData
      const { data } = supabase.storage
        .from('medicine-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: data.publicUrl });
    } catch (error: any) {
      alert("อัปโหลดผิดพลาด: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.image_url) {
      alert("กรุณากรอกชื่อยาและอัปโหลดรูปภาพ");
      return;
    }

    try {
      if (editingDrug) {
        const { error } = await supabase
          .from('medicines')
          .update(formData)
          .eq('id', editingDrug.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('medicines')
          .insert([formData]);
        if (error) throw error;
      }

      alert("บันทึกข้อมูลสำเร็จ");
      closeModal();
      fetchDrugs();
    } catch (error: any) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    }
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
                <IonButton onClick={closeModal}>ปิด</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding modal-content">
            <div className="input-group-pink">
              <IonInput label="ชื่อยา" labelPlacement="stacked" fill="outline" value={formData.name} onIonInput={e => setFormData({...formData, name: e.detail.value!})} />
              
              {/* ส่วน Upload รูปภาพแทน URL เดิม */}
              <div className="upload-container" style={{ margin: '15px 0' }}>
                <IonLabel style={{ display: 'block', marginBottom: '10px' }}>รูปภาพยา</IonLabel>
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} id="file-upload" />
                <label htmlFor="file-upload">
                  <IonButton expand="block" fill="outline" color="medium" onClick={() => document.getElementById('file-upload')?.click()}>
                    <IonIcon icon={cameraOutline} slot="start" />
                    {uploading ? 'กำลังอัปโหลด...' : 'เลือกรูปภาพยา'}
                  </IonButton>
                </label>
                {uploading && <div style={{ textAlign: 'center', marginTop: '10px' }}><IonSpinner name="crescent" /></div>}
                {formData.image_url && !uploading && (
                  <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <IonImg src={formData.image_url} style={{ width: '120px', height: '120px', margin: '0 auto', borderRadius: '10px' }} />
                  </div>
                )}
              </div>

              <IonTextarea label="สรรพคุณ/วิธีใช้" labelPlacement="stacked" fill="outline" rows={2} value={formData.usage} onIonInput={e => setFormData({...formData, usage: e.detail.value!})} />
              <IonTextarea label="รายละเอียด" labelPlacement="stacked" fill="outline" rows={3} value={formData.detail} onIonInput={e => setFormData({...formData, detail: e.detail.value!})} />
              <IonTextarea label="คำเตือน" labelPlacement="stacked" fill="outline" rows={2} value={formData.warning} onIonInput={e => setFormData({...formData, warning: e.detail.value!})} />
            </div>
            <IonButton expand="block" onClick={handleSave} className="pink-save-btn" disabled={uploading}>
              บันทึกข้อมูล
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ManageDrugs;
import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonButton,
  IonInput,
  IonIcon,
  IonAlert,
} from "@ionic/react";
import "./Diary.css";
import { supabase } from "../../supabaseClient";
import DiaryHeader from "../../components/DiaryHeader";
import { cloudUpload } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import DiaryNavBar from "../../components/DiaryNavBar";

const foodOptions = [
  { id: 1, name: "ข้าวผัด", img: "/assets/Diary/foods/01.jpg" },
  { id: 2, name: "ข้าวราดแกง", img: "/assets/Diary/foods/02.jpg" },
  { id: 3, name: "ก๋วยเตี๋ยว", img: "/assets/Diary/foods/03.jpg" },
  { id: 4, name: "ข้าวไข่เจียว", img: "/assets/Diary/foods/04.jpg" },
  { id: 5, name: "ส้มตำ", img: "/assets/Diary/foods/05.jpg" },
  { id: 6, name: "ผัดไทย", img: "/assets/Diary/foods/06.jpg" },
  { id: 7, name: "ผัดกะเพรา", img: "/assets/Diary/foods/07.jpg" },
  { id: 8, name: "ข้าวมันไก่", img: "/assets/Diary/foods/08.jpg" },
  { id: 9, name: "ข้าวซอย", img: "/assets/Diary/foods/09.jpg" },
];
const hobbyOptions = [
  { id: "ออกกำลังกาย", label: "ออกกำลังกาย", icon: "🏋️" },
  { id: "ดูทีวี", label: "ดูทีวี", icon: "📺" },
  { id: "ดูหนัง", label: "ดูหนัง", icon: "🎬" },
  { id: "เล่นเกม", label: "เล่นเกม", icon: "🎮" },
  { id: "อ่านหนังสือ", label: "อ่านหนังสือ", icon: "📖" },
  { id: "เดินเล่น", label: "เดินเล่น", icon: "👟" },
  { id: "ฟังเพลง", label: "ฟังเพลง", icon: "🎧" },
  { id: "วาดรูป", label: "วาดรูป", icon: "🎨" },
];
const symptomOptions = [
  { id: "ปวด", label: "ปวด", icon: "🤕" },
  { id: "บวม", label: "บวม", icon: "🩹" },
  { id: "เลือดออก", label: "เลือดออก", icon: "🩸" },
  { id: "มีไข้", label: "มีไข้", icon: "🤒" },
  { id: "แผล", label: "แผล", icon: "🩹" },
  { id: "ชา", label: "ชา", icon: "😖" },
  { id: "คัน", label: "คัน", icon: "😣" },
  { id: "อื่น ๆ", label: "อื่น ๆ", icon: "❓" },
];
const painOptions = [
  { value: 0, label: "ไม่เจ็บ", emoji: "😄", color: "success" },
  { value: 1, label: "เจ็บน้อย", emoji: "🙂" },
  { value: 2, label: "ปานกลาง", emoji: "😐" },
  { value: 3, label: "เจ็บมาก", emoji: "😣" },
  { value: 4, label: "เจ็บมากที่สุด", emoji: "😫", color: "danger" },
];

const fullDate = new Date().toLocaleDateString("th-TH", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const getToday = () => {
  const d = new Date();
  return d.toISOString().split("T")[0];
};

const Diary: React.FC = () => {
  const [happiness, setHappiness] = useState<number | null>(null);
  const [painscore, setPainScore] = useState<number | null>(null);
  const [selectedFood, setSelectedFood] = useState<number | null>(null);
  const [extraFood, setExtraFood] = useState("");
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [extraSymptom, setExtraSymptom] = useState("");
  const history = useHistory();
  const [showSuccess, setShowSuccess] = useState(false);
  const [diary, setDiary] = useState({
    hobby: "",
    symptoms: "",
    food: "",
    painscore: "",
    happiness: "",
    image_url: "",
  });
  const today = fullDate;

  const foodResult = extraFood
    ? `${selectedFood ?? ""} ${extraFood}`
    : selectedFood;

  const symptomText =
    selectedSymptoms.filter((s) => s !== "other").join(", ") +
    (extraSymptom ? `, ${extraSymptom}` : "");

  const handleSave = async (e: any) => {
    e.preventDefault();

    const { error } = await supabase.from("diary").insert([
      {
        diary_date: getToday(),
        hobby: selectedHobbies.join(", "),
        symptoms: symptomText,
        food: foodResult,
        painscore: painscore,
        happiness: happiness,
        image_url: diary.image_url,
      },
    ]);

    if (error) {
      alert("Error adding diary " + error.message);
      return;
    }

    setDiary({
      hobby: "",
      symptoms: "",
      food: "",
      painscore: "",
      happiness: "",
      image_url: "",
    });

    setShowSuccess(true);
  };

  return (
    <IonPage>
      {/* ===== Header ===== */}
      <DiaryHeader />

      <IonContent fullscreen>
        <div className="layout">
          <main className="content">
            <h1>บันทึก {today}</h1>

            <div className="card">
              {/* Happiness */}
              <h3>วันนี้เป็นยังไงบ้าง</h3>

              <div className="mood-row">
                {[
                  { emoji: "😀", value: 5 },
                  { emoji: "🙂", value: 4 },
                  { emoji: "😐", value: 3 },
                  { emoji: "🙁", value: 2 },
                  { emoji: "😞", value: 1 },
                ].map((mood) => (
                  <button
                    key={mood.value}
                    className={`mood-btn ${
                      happiness === mood.value ? "active" : ""
                    }`}
                    onClick={() => setHappiness(mood.value)}
                  >
                    {mood.emoji}
                  </button>
                ))}
              </div>

              {/* ===== Hobby ===== */}
              <h3>
                งานอดิเรก <span className="required">*</span>
              </h3>

              <div className="icon-grid">
                {hobbyOptions.map((item) => (
                  <button
                    key={item.id}
                    className={`icon-item ${
                      selectedHobbies.includes(item.id) ? "active" : ""
                    }`}
                    onClick={() =>
                      setSelectedHobbies((prev) =>
                        prev.includes(item.id)
                          ? prev.filter((h) => h !== item.id)
                          : [...prev, item.id],
                      )
                    }
                  >
                    <div className="icon">{item.icon}</div>
                    <div className="label">{item.label}</div>
                  </button>
                ))}
              </div>

              {/* ===== Symptom ===== */}
              <h3>
                ลักษณะอาการ <span className="required">*</span>
              </h3>

              <div className="icon-grid">
                {symptomOptions.map((item) => (
                  <button
                    key={item.id}
                    className={`icon-item ${
                      selectedSymptoms.includes(item.id) ? "active" : ""
                    }`}
                    onClick={() =>
                      setSelectedSymptoms((prev) =>
                        prev.includes(item.id)
                          ? prev.filter((s) => s !== item.id)
                          : [...prev, item.id],
                      )
                    }
                  >
                    <div className="icon">{item.icon}</div>
                    <div className="label">{item.label}</div>
                  </button>
                ))}
              </div>

              {selectedSymptoms.includes("other") && (
                <IonInput
                  placeholder="ระบุอาการเพิ่มเติม"
                  fill="outline"
                  value={extraSymptom}
                  onIonInput={(e) => setExtraSymptom(e.detail.value!)}
                />
              )}

              {/* ===== Food Image Select ===== */}
              <h3>
                อาหารที่รับประทาน <span className="required">*</span>
              </h3>
              <p className="field-desc">
                แตะที่รูปอาหารเพื่อเลือก (เลือกได้ 1 อย่าง)
              </p>

              <div className="food-grid">
                {foodOptions.map((food) => (
                  <IonButton
                    key={food.id}
                    type="button"
                    className={`food-card ${
                      selectedFood === food.id ? "active" : ""
                    }`}
                    onClick={() => {
                      setSelectedFood(food.id);
                    }}
                  >
                    <img src={food.img} alt={food.name} />
                    <div className="food-name">{food.name}</div>
                  </IonButton>
                ))}
              </div>
              <h3>อาหารเพิ่มเติม</h3>
              <IonInput
                labelPlacement="stacked"
                fill="outline"
                value={extraFood}
                onIonInput={(e) => setExtraFood(e.detail.value!)}
              />

              {/* ===== Pain Score ===== */}
              <h3>
                ระดับความเจ็บปวด <span className="required">*</span>
              </h3>

              <div className="pain-row">
                {painOptions.map((item) => (
                  <button
                    key={item.value}
                    className={`pain-btn ${item.color ?? ""} ${
                      painscore === item.value ? "active" : ""
                    }`}
                    onClick={() => setPainScore(item.value)}
                  >
                    <div className="emoji">{item.emoji}</div>
                    <div className="label">{item.label}</div>
                  </button>
                ))}
              </div>

              {/* ===== Upload ===== */}
              <h3>แนบรูปภาพอาการ (ถ้ามี)</h3>
              <p className="field-desc">อัปโหลดรูป</p>

              <div className="upload-box">
                <IonIcon icon={cloudUpload}></IonIcon>
                <p className="upload-text">คลิกเพื่อเลือกไฟล์</p>
                <p className="upload-hint">รองรับ JPG, PNG</p>
                <button className="upload-btn">เลือกรูปภาพ</button>
              </div>

              {/* ===== Buttons ===== */}
              <div className="action-buttons">
                {/* <IonButton expand="block" className="pink-btn">
                  ล้างข้อมูล
                </IonButton> */}
                <IonButton
                  expand="block"
                  className="pink-save-btn padding-auto"
                  onClick={handleSave}
                >
                  บันทึก
                </IonButton>
              </div>
            </div>
          </main>
        </div>
      
      {/* ===== Bottom Navigation ===== */}
      <DiaryNavBar />
      </IonContent>

      <IonAlert
        isOpen={showSuccess}
        header="บันทึกสำเร็จ 🎉"
        message="ข้อมูลประจำวันของคุณถูกบันทึกเรียบร้อยแล้ว"
        buttons={[
          {
            text: "ตกลง",
            handler: () => {
              setShowSuccess(false);
              history.push("/calender");
            },
          },
        ]}
        cssClass="success-alert"
      />
    </IonPage>
  );
};

export default Diary;

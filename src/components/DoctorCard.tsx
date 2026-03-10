import {
    IonButton,
    IonIcon,
    IonText,
    useIonToast
} from "@ionic/react";
import { callOutline, callSharp, copyOutline, mailOutline } from "ionicons/icons";
import React from "react";
import "./DoctorCard.css";

export type Doctor = {
  id: number;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  lineId: string;
  avatar: string;
};

function fakeQrUrl(text: string) {
  // ใช้บริการ qr ฟรี (ถ้าห้ามใช้อินเทอร์เน็ต ให้เปลี่ยนเป็นรูป asset ในโปรเจกต์)
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    text
  )}`;
}

const DoctorCard: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
  const [present] = useIonToast();

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      present({ message: "Copied", duration: 900, position: "top" });
    } catch {
      present({ message: "Copy failed", duration: 900, position: "top" });
    }
  };

  return (
    <div className="docCard">
      <div className="docHead">
        <img className="docAvatar" src={doctor.avatar} alt={doctor.name} />
        <div className="docMeta">
          <div className="docName">{doctor.name}</div>
          <div className="docSpec">
            <IonIcon icon={callSharp} /> {doctor.specialty}
          </div>
        </div>
      </div>

      <div className="docBody">
        <div className="row">
          <div className="rowLeft">
            <IonIcon className="rowIcon pink" icon={callOutline} />
            <div>
              <div className="rowTitle">Phone Contact</div>
              <div className="rowValue">{doctor.phone}</div>
            </div>
          </div>

          <div className="rowRight">
            <IonButton fill="outline" size="small" className="btnLight" onClick={() => copy(doctor.phone)}>
              <IonIcon slot="start" icon={copyOutline} />
              Copy
            </IonButton>

            <IonButton
              size="small"
              className="btnPink"
              href={`tel:${doctor.phone.replace(/\s/g, "")}`}
            >
              <IonIcon slot="start" icon={callOutline} />
              Call
            </IonButton>
          </div>
        </div>

        <div className="divider" />

        <div className="row">
          <div className="rowLeft">
            <IonIcon className="rowIcon pink" icon={mailOutline} />
            <div>
              <div className="rowTitle">Email</div>
              <div className="rowValue">{doctor.email}</div>
            </div>
          </div>
        </div>

        <div className="divider" />

        <div className="row rowLine">
          <div className="rowLeft">
            <img
              className="lineIcon"
              src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg"
              alt="LINE"
            />
            <div>
              <div className="rowTitle">LINE Contact</div>
              <div className="lineIdRow">
                <IonText className="rowValue">LINE ID: {doctor.lineId}</IonText>
                <IonButton
                  fill="clear"
                  size="small"
                  className="iconBtn"
                  onClick={() => copy(doctor.lineId)}
                >
                  <IonIcon icon={copyOutline} />
                </IonButton>
              </div>
            </div>
          </div>

          <div className="qrBox">
            <img className="qrImg" src={fakeQrUrl(doctor.lineId)} alt="qr" />
            <div className="qrHint">Scan to add on LINE</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
import React from "react";
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import "./DiaryHeader.css";
import { arrowBack, home } from "ionicons/icons";

interface AppHeaderProps {
  backTo?: string; // path ที่จะย้อนกลับ (default = /dashboard)
  title?: string; // เผื่ออยากใส่ title ทีหลัง
}

const DiaryHeader: React.FC<AppHeaderProps> = ({
  backTo = "/dashboard",
  title,
}) => {
  const history = useHistory();

  return (
    <IonHeader className="ion-no-border">
      <IonToolbar className="history-header">
        <IonButtons slot="start">
          <IonButton
            fill="clear"
            onClick={() => history.push(backTo)}
            className="custom-back-btn"
          >
            <IonIcon icon={home} slot="start" />
            <IonLabel>หน้าหลัก</IonLabel>
          </IonButton>
        </IonButtons>

        {title && <div className="header-title">{title}</div>}
      </IonToolbar>
    </IonHeader>
  );
};

export default DiaryHeader;

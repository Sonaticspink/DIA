import { IonCard, IonCardContent } from "@ionic/react";
import "./DRHistoryCard.css";

export interface DRDiaryEntry {
  id: string;
  diary_date: string;
  hobby: string;
  symptoms: string;
  food: string;
  happiness: number;
  painscore: number;

  profiles?: {
    first_name: string;
    last_name: string;
  } | null;
}

const happinessEmoji: Record<number, string> = {
  1: "😞",
  2: "😕",
  3: "😐",
  4: "🙂",
  5: "😁",
};

const painEmoji: Record<number, string> = {
  0: "😊",
  1: "🙂",
  2: "😐",
  3: "😣",
  4: "😭",
};

const DRHistoryCard: React.FC<{ entry: DRDiaryEntry }> = ({ entry }) => {

  const formattedDate = new Date(entry.diary_date).toLocaleDateString("th-TH", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const riskLevel =
    entry.painscore >= 3 || entry.happiness <= 2
      ? "high"
      : entry.painscore === 2
      ? "medium"
      : "low";

  return (
    <IonCard className={`dr-card ${riskLevel}`}>
      <IonCardContent>

        <div className="dr-header">

          <div className="dr-patient">
            👤 {entry.profiles
              ? `${entry.profiles.first_name} ${entry.profiles.last_name}`
              : "ไม่ทราบชื่อ"}
          </div>

          <div className="dr-date">
            📅 {formattedDate}
          </div>

        </div>

        <div className="dr-emotion">

          <div className="emotion-box">
            <span>ความสุข</span>
            <div className="emoji">
              {entry.happiness ? happinessEmoji[entry.happiness] : "-"}
            </div>
          </div>

          <div className="emotion-box">
            <span>ความปวด</span>
            <div className="emoji">
              {entry.painscore !== null ? painEmoji[entry.painscore] : "-"}
            </div>
          </div>

        </div>

        <div className="dr-grid">

          <div className="dr-item">
            <strong>🎯 กิจกรรม</strong>
            <p>{entry.hobby || "-"}</p>
          </div>

          <div className="dr-item">
            <strong>🤕 อาการ</strong>
            <p>{entry.symptoms || "-"}</p>
          </div>

          <div className="dr-item">
            <strong>🍽️ อาหาร</strong>
            <p>{entry.food || "-"}</p>
          </div>

        </div>

      </IonCardContent>
    </IonCard>
  );
};

export default DRHistoryCard;
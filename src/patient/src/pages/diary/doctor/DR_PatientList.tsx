import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar
} from '@ionic/react';

import { arrowBack, personCircle, swapVerticalOutline, textOutline } from 'ionicons/icons';

import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { supabase } from '../../../supabaseClient';

const PatientList: React.FC = () => {

  const history = useHistory();

  const [patients, setPatients] = useState<any[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [sortType, setSortType] = useState("az");

  const goDetail = (id: string) => {
    history.push(`/patient/${id}`);
  };

  const goDashboard = () => {
    history.push("/dashboard");
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {

    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      console.log(error);
      return;
    }

    const formatted = data.map((p:any) => ({
      _id: p.id,
      name: `${p.first_name} ${p.last_name}`,
      phone: p.phone,
      image: null
    }));

    setPatients(formatted);
    setFilteredPatients(formatted);
  };

  const handleSearch = (text: string) => {

    setSearchText(text);

    let result = patients.filter(p =>
      p.name.toLowerCase().includes(text.toLowerCase())
    );

    sortPatients(result, sortType);
  };

  const sortPatients = (list: any[], type: string) => {

    let sorted = [...list];

    if (type === "az") {
      sorted.sort((a, b) => a.name.localeCompare(b.name, "th"));
    }

    if (type === "za") {
      sorted.sort((a, b) => b.name.localeCompare(a.name, "th"));
    }

    setFilteredPatients(sorted);
  };

  const changeSort = (type: string) => {

    setSortType(type);

    sortPatients(filteredPatients, type);
  };

  return (
    <IonPage>

      <IonHeader>

        <IonToolbar color="primary">

          <IonButtons slot="start">
            <IonButton onClick={goDashboard}>
              <IonIcon icon={arrowBack}/>
            </IonButton>
          </IonButtons>

          <IonTitle>รายชื่อคนไข้</IonTitle>

        </IonToolbar>

      </IonHeader>

      <IonContent>

        <IonSearchbar
          value={searchText}
          placeholder="ค้นหาชื่อคนไข้"
          onIonInput={(e: any) => handleSearch(e.target.value)}
        />

        <IonSegment
          value={sortType}
          onIonChange={(e) => changeSort(e.detail.value!)}
        >

          <IonSegmentButton value="az">
            <IonIcon icon={textOutline} />
            <IonLabel>ก-ฮ</IonLabel>
          </IonSegmentButton>

          <IonSegmentButton value="za">
            <IonIcon icon={swapVerticalOutline} />
            <IonLabel>ฮ-ก</IonLabel>
          </IonSegmentButton>

        </IonSegment>

        <IonList>

          {filteredPatients.map((patient) => (

            <IonItem key={patient._id}>

              <IonAvatar slot="start">
                {patient.image ? (
                  <img src={patient.image} alt="patient" />
                ) : (
                  <IonIcon icon={personCircle} style={{ fontSize: "50px" }} />
                )}
              </IonAvatar>

              <IonLabel>
                <h2>{patient.name}</h2>
                <p>{patient.phone}</p>
              </IonLabel>

              <IonButton
                slot="end"
                fill="outline"
                onClick={() => goDetail(patient._id)}
              >
                รายละเอียด
              </IonButton>

            </IonItem>

          ))}

        </IonList>

      </IonContent>

    </IonPage>
  );
};

export default PatientList;
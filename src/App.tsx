import { Redirect, Route } from 'react-router-dom';
import {
  IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { homeOutline, calendarOutline, medicalOutline } from 'ionicons/icons';

/* Import your pages */
import Home from './pages/Home';
import Booking from './pages/Booking';
import Medicine from './pages/Medicine';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Your Custom Theme */
import './theme/variables.css';
import './Home.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/home"><Home /></Route>
          <Route exact path="/booking"><Booking /></Route>
          <Route exact path="/medicine"><Medicine /></Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/home">
            <IonIcon icon={homeOutline} />
            <IonLabel>หน้าหลัก</IonLabel>
          </IonTabButton>

          <IonTabButton tab="booking" href="/booking">
            <IonIcon icon={calendarOutline} />
            <IonLabel>จองคิว</IonLabel>
          </IonTabButton>

          <IonTabButton tab="medicine" href="/medicine">
            <IonIcon icon={medicalOutline} /> {/* Change medicationOutline to medicalOutline here */}
              <IonLabel>ยาของฉัน</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
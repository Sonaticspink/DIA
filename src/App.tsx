import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import DrugInventory from './pages/DrugInventory';
import DrugDetail from './pages/DrugDetail';
import Appointment from './pages/Appointment';
import AppointmentDetail from './pages/AppointmentDetail';
import ReservationPage from './pages/ReservationPage';
import SuccessPage from './pages/SuccessPage';
import AppointmentList from './pages/AppointmentList';
import DoctorDashboard from './pages/DoctorDashboard';
import ManageDrugs from './pages/ManageDrugs';
import DoctorCalendar from './pages/DoctorCalendar';
import DoctorSlotManager from './pages/DoctorSlotManager';
import DoctorAppointmentList from './pages/DoctorAppointmentList';
import DoctorAppointmentDetail from './pages/DoctorAppointmentDetail';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/signup">
          <Signup />
        </Route>
        <Route exact path="/appointment">
          <Appointment />
        </Route>
        <Route exact path="/dashboard">
          <Dashboard />
        </Route>
        <Route exact path="/appointment-detail/:date">
          <AppointmentDetail />
        </Route>
        <Route exact path="/reservation/:date/:time">
          <ReservationPage />
        </Route>
        <Route exact path="/success/:date/:time">
          <SuccessPage />
        </Route>
        <Route exact path="/inventory">
          <DrugInventory />
        </Route>
        <Route exact path="/drug-detail/:id">
          <DrugDetail /> 
        </Route>
        <Route exact path="/appointment-list">
          <AppointmentList />
        </Route>
        <Route exact path="/doctor-dashboard">
          <DoctorDashboard />
        </Route>
        <Route exact path="/doctor/manage-drugs">
          <ManageDrugs />
        </Route>
        <Route exact path="/doctor/manage-slots">
          <DoctorCalendar />
        </Route>
        <Route exact path="/doctor/slot-manager/:date">
          <DoctorSlotManager />
        </Route>
        <Route exact path="/doctor/appointments">
          <DoctorAppointmentList />
        </Route>
        <Route exact path="/doctor/appointment-detail/:id">
          <DoctorAppointmentDetail />
        </Route>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
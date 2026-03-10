import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DrugInventory from "./pages/drug/DrugInventory";
import DrugDetail from "./pages/drug/DrugDetail";
import Appointment from "./pages/appointment/Appointment";
import AppointmentDetail from "./pages/appointment/AppointmentDetail";
import ReservationPage from "./pages/appointment/ReservationPage";
import SuccessPage from "./pages/appointment/SuccessPage";
import AppointmentList from "./pages/appointment/AppointmentList";
import DoctorDashboard from "./pages/DoctorDashboard";
import ManageDrugs from "./pages/drug/ManageDrugs";
import DoctorCalendar from "./pages/appointment/DoctorCalendar";
import DoctorSlotManager from "./pages/appointment/DoctorSlotManager";
import DoctorAppointmentList from "./pages/appointment/DoctorAppointmentList";
import DoctorAppointmentDetail from "./pages/appointment/DoctorAppointmentDetail";
import DRPatientDetail from "./pages/diary/doctor/DR_PatientDetail";
import DRDashboard from "./pages/diary/doctor/DR_dashboard";
import Calender from "./pages/diary/Calender";
import Diary from "./pages/diary/Diary";
import History from "./pages/diary/History";
import Report from "./pages/diary/Report";
import DRPatientHistory from './pages/diary/DRPatientHistory';
import DR_PatientList from './pages/diary/doctor/DR_PatientList';

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "./theme/variables.css";
import Contact from "./pages/diary/Contact";

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
        <Route exact path="/calender">
          <Calender />
        </Route>
        <Route exact path="/diary">
          <Diary />
        </Route>
        <Route exact path="/history">
          <History />
        </Route>
        <Route exact path="/contact">
          <Contact />
        </Route>
        <Route exact path="/DR_PatientList">
          <DR_PatientList />
        </Route>
        <Route exact path="/report">
          <Report />
        </Route>
        <Route exact path="/DRPatientHistory">
          <DRPatientHistory />
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
        <Route exact path="/doctor/patient-detail">
          <DRPatientDetail />
        </Route>
        <Route exact path="/doctor/patient-detail/:patientId">
          <DRPatientDetail />
        </Route>
        <Route exact path="/doctor/pain-chart">
          <DRDashboard />
        </Route>
        <Route exact path="/doctor/pain-chart/:patientId">
          <DRDashboard />
        </Route>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;

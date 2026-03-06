import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ==========================================
// 1. AUTH KOMPONENTLARI (GURUHLANGAN)
// ==========================================
import Welcome from './auth/Welcome.jsx';
import Register from './auth/Register.jsx';
import VerifyEmail from './auth/VerifyEmail.jsx';
import Login from './auth/Login.jsx';
import PasswordResetRequest from './auth/PasswordResetRequest.jsx';
import PasswordResetConfirm from './auth/PasswordResetConfirm.jsx';
import UpdatifyPassword from './auth/UpdatifyPassword.jsx';
import NotFound from './auth/NotFound.jsx';

// ==========================================
// 2. DOCTOR KOMPONENTLARI
// ==========================================
import DoctorLayout from '../src/doctor/DoctorLayout.jsx';
import DoctorProfile from '../src/doctor/DoctorProfile.jsx';
import DoctorDashboard from '../src/doctor/DoctorDashboard.jsx';

// ==========================================
// 3. PATIENT KOMPONENTLARI
// ==========================================
import PatientLayout from '../src/patient/PatientLayout.jsx';
import PatientProfile from '../src/patient/PatientProfile.jsx';
import FindDoctor from '../src/patient/FindDoctor.jsx';
import DoctorDetail from '../src/patient/DoctorDetail.jsx';
import MyAppointments from '../src/patient/MyAppointments.jsx';

// ==========================================
// 3. HIMOYALANGAN YO'NALISH (GUARD)
// ==========================================
const PrivateRoute = ({ children }) => {
    // LocalStorage'da access token borligini tekshiramiz
    const isAuthenticated = localStorage.getItem('access');
    // Agar login qilmagan bo'lsa, /login sahifasiga haydaymiz
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            {/* Toast bildirishnomalari sozlamasi */}
            <ToastContainer 
                position="top-center" 
                autoClose={10000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            
            <Routes>
                {/* Ommaviy sahifalar */}
                <Route path="/" element={<Welcome />} />
                <Route path="/register" element={<Register />} />
                <Route path="/activate/:uid/:token" element={<VerifyEmail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/pasword-reset" element={<PasswordResetRequest />} />
                <Route path="/password-reset-confirm/:uid/:token" element={<PasswordResetConfirm />} />
                <Route path="/password-update-success" element={<UpdatifyPassword />} />


                {/* Patient PATH */}
                <Route path="/patient/*" element={<PrivateRoute><PatientLayout /></PrivateRoute>} >
                    <Route path="patient-profile" element={<PatientProfile />} />
                    <Route path="find-doctor" element={<FindDoctor />} />
                    <Route path="doctor-detail/:id" element={<DoctorDetail />} />
                    <Route path="my-appointments" element={<MyAppointments />} />
                </Route>

                {/* DOCTORS PATH */}
                <Route path="/doctor/*" element={<PrivateRoute><DoctorLayout /></PrivateRoute>} >
                    <Route path="doctor-profile" element={<DoctorProfile />} />
                    <Route path="appointments" element={<DoctorDashboard />} />
                </Route>

                {/* Hech qaysi yo'nalish mos kelmasa 404 sahifasi */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;

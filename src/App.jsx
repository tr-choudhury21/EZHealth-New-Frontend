import axios from 'axios';
import { AuthContext } from './auth.jsx';
import { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationPage from './pages/RegistrationPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import PatientDashboard from './pages/PatientDashboard.jsx';
import DoctorDashboard from './pages/DoctorDashboard.jsx';
import BookAppointmentForm from './pages/BookAppointmentForm.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DoctorsList from './components/DoctorList.jsx';
import ServicesPage from './components/Service.jsx';
import AboutUsPage from './pages/About.jsx';
import PaymentPage from './pages/PaymentPage.jsx';

function App() {
  const { isAuthenticated, setIsAuthenticated, user, setUser, setUserRole } =
    useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      //   try {
      //     let res;

      //     // first try doctor endpoint
      //     res = await axios.get('http://localhost:5000/api/v1/doctor/me', {
      //       withCredentials: true,
      //     });

      //     if (res.data.user?.role === 'Doctor') {
      //       setIsAuthenticated(true);
      //       setUser(res.data.user);
      //       setUserRole('Doctor');
      //       return;
      //     }
      //   } catch (error) {
      //     console.error(error);
      //     setIsAuthenticated(false);
      //     setUser(null);
      //     setUserRole(null);
      //   }

      //   // try patient
      //   try {
      //     const res = await axios.get(
      //       'http://localhost:5000/api/v1/user/patient/profile',
      //       { withCredentials: true }
      //     );
      //     setIsAuthenticated(true);
      //     setUser(res.data.user);
      //     setUserRole('Patient');
      //   } catch (error) {
      //     setIsAuthenticated(false);
      //     setUser(null);
      //     setUserRole(null);
      //   }
      // };

      try {
        const res = await axios.get(
          'https://ez-health-server.vercel.app/api/v1/user/me',
          {
            withCredentials: true,
          }
        );

        setIsAuthenticated(true);
        setUser(res.data.user);
        setUserRole(res.data.user.role);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/doctors" element={<DoctorsList />} />
          <Route
            path="/patient/dashboard"
            element={
              // <ProtectedRoute role="Patient">
              <PatientDashboard />
              // </ProtectedRoute>
            }
          />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route
            path="/appointment"
            element={
              <ProtectedRoute role="Patient">
                <BookAppointmentForm />
              </ProtectedRoute>
            }
          />
          <Route path="/service" element={<ServicesPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/appointment/success" element={<PaymentPage />} />
        </Routes>
        <Footer />
        <ToastContainer position="top-center" />
      </Router>
    </>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Home from './pages/Home.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import MakePayment from './pages/MakePayment.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';
import PaymentFailure from './pages/PaymentFailure.jsx';
import Statement from './pages/Statement.jsx';
import FeeDashboard from './pages/FeeDashboard.jsx';
import Profile from './pages/Profile.jsx';
import Contact from './pages/Contact.jsx';  
import VerifyEmail from './pages/VerifyEmail.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} /> {/* 👈 Homepage on root */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

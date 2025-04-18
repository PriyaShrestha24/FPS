import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Home from './pages/Home.jsx';
import MakePayment from './pages/MakePayment.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';
import PaymentFailure from './pages/PaymentFailure.jsx';
import Statement from './pages/Statement.jsx';
import FeeDashboard from './pages/FeeDashboard.jsx';
import Profile from './pages/Profile.jsx';
import Contact from './pages/Contact.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} /> {/* 👈 Homepage on root */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute element={<AdminDashboard />} allowedRoles={['admin']} />
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute element={<UserDashboard />} allowedRoles={['student']} />
          }
        />
        <Route path="/about" element={<AboutUs />} />
        <Route
          path="/make-payment"
          element={
            <ProtectedRoute element={<MakePayment />} allowedRoles={['student']} />
          }
        />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />
        <Route
          path="/statement"
          element={
            <ProtectedRoute element={<Statement />} allowedRoles={['student']} />
          }
        />
<Route
          path="/dashboard"
          element={
            <ProtectedRoute element={<FeeDashboard />} allowedRoles={['student']} />
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute element={<Profile />} allowedRoles={['admin', 'student']} />
          }
        />
        <Route path="/contact" element={<Contact />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

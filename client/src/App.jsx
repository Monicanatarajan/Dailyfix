import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import SearchProviders from './pages/SearchProviders';
import ProviderProfile from './pages/ProviderProfile';
import ProviderDashboard from './pages/ProviderDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import CustomerBookings from './pages/CustomerBookings';
import ManageProfile from './pages/ManageProfile';
import Favorites from './pages/Favorites';
import ProviderPayments from './pages/ProviderPayments';
import About from './pages/About';
import Services from './pages/Services';
import HowItWorks from './pages/HowItWorks';
import Careers from './pages/Careers';
import Help from './pages/Help';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
function App() {
    return (
        <AuthProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Navigation />
                <main className="py-4">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/role-selection" element={<Landing />} />
                        <Route path="/customer/login" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/search" element={<SearchProviders />} />
                        <Route path="/providers/:id" element={<ProviderProfile />} />
                        <Route path="/bookings" element={<CustomerBookings />} />
                        <Route path="/profile" element={<ManageProfile />} />
                        <Route path="/favorites" element={<Favorites />} />
                        <Route path="/provider/dashboard" element={<ProviderDashboard />} />
                        <Route path="/provider/payments" element={<ProviderPayments />} />
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/how-it-works" element={<HowItWorks />} />
                        <Route path="/careers" element={<Careers />} />
                        <Route path="/help" element={<Help />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />
                    </Routes>
                </main>
            </Router>
        </AuthProvider>
    );
}

export default App;

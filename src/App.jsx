import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import BusinessNavbar from "./components/Navbar/BusinessNavbar";
import Hero from "./components/Hero/Hero";
import Brands from "./components/Brands/Brands";
import Services from "./components/Services/Services";
import Banner from "./components/Banner/Banner";
import Banner2 from "./components/Banner/Banner2";
import Testimonial from "./components/Testimonial/Testimonial";
import Newsletter from "./components/Newsletter/Newsletter";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import EmailVerification from "./pages/EmailVerification";
import ForBusiness from "./pages/ForBusiness";
import BusinessLogin from "./pages/business/BusinessLogin";
import BusinessSignup from "./pages/business/BusinessSignup";
import BusinessForgotPassword from "./pages/business/BusinessForgotPassword";
import BusinessDashboard from "./pages/business/BusinessDashboard";
import About from "./pages/About";
import { LoadingProvider } from './contexts/LoadingContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/authContext';
import { BusinessAuthProvider } from './contexts/businessAuthContext';

const Home = () => {
  return (
    <>
      <Hero />
      <Brands />
      <div id="services">
        <Services />
      </div>
      <Banner />
      <Banner2 />
      <Testimonial />
      <div id="newsletter">
        <Newsletter />
      </div>
    </>
  );
};

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-black">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
  </div>
);

// Component to conditionally render the appropriate navbar
const NavbarWrapper = () => {
  const location = useLocation();
  const isBusinessRoute = location.pathname.startsWith('/business') || location.pathname === '/for-business';
  
  return isBusinessRoute ? <BusinessNavbar /> : <Navbar />;
};

// Main content wrapper
const MainContent = () => {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden">
      <NavbarWrapper />
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        
        {/* Business Routes */}
        <Route path="/for-business" element={<ForBusiness />} />
        <Route path="/business/login" element={<BusinessLogin />} />
        <Route path="/business/signup" element={<BusinessSignup />} />
        <Route path="/business/forgot-password" element={<BusinessForgotPassword />} />
        <Route path="/business/dashboard" element={<BusinessDashboard />} />
      </Routes>
      <Footer />
    </main>
  );
};

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <BusinessAuthProvider>
            <LoadingProvider>
              <Suspense fallback={<LoadingScreen />}>
                <MainContent />
              </Suspense>
            </LoadingProvider>
          </BusinessAuthProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;

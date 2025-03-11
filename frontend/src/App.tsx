import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import VerifyOTP from "./pages/VerifyOTP";
import Login from "./components/Login";
import AdminLogin from "./components/AdminLogin";
// import Dashboard from "./components/Dashboard";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
// import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
// import CustomerDashboard from "./components/admin/dashboard/CustomerDashboard";
import AdminCustomers from "./pages/AdminCustomers";
// import Plans from './components/admin/plans/Plans'
// import AddPlansPage from "./components/admin/plans/AddPlan";
import AdminPlans from "./pages/AdminPlans";
import AdminAddPlan from "./pages/AdminAddPlans";
import AdminEditPlan from "./pages/AdminEditPlan";
// import Header from "./components/User/Header/Header";
import HomePage from "./components/User/Header/HomePage";
function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* <Route path="/header" element={<HomePage/>} /> */}

        {/* <Route path="/addplans" element={<AddPlansPage/>} /> */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/" element={<HomePage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/plans" element={<AdminPlans />} />
          <Route path="/users" element={<AdminCustomers />} />
          <Route path="/plans/edit/:id" element={<AdminEditPlan />} />
          <Route path="/plans/add" element={<AdminAddPlan />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

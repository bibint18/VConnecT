import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import VerifyOTP from "./pages/VerifyOTP";
import Login from "./components/Login";
import AdminLogin from "./components/AdminLogin";
// import Dashboard from "./components/Dashboard";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
// import CustomerDashboard from "./components/admin/dashboard/CustomerDashboard";
import AdminCustomers from "./pages/AdminCustomers";
// import Plans from './components/admin/plans/Plans'
// import AddPlansPage from "./components/admin/plans/AddPlan";
import AdminPlans from "./pages/AdminPlans";
function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/plans" element={<AdminPlans/>} />
        {/* <Route path="/addplans" element={<AddPlansPage/>} /> */}
        <Route path="/" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/users" element={<AdminCustomers />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/adminLogin" element={<AdminLogin/>} />
        <Route path="/home" element={<Home/>} />
        {/* <Route path="/dashboard" element={<Dashboard/>} /> */}

        <Route element={<ProtectedRoute/>}>
            <Route path="/dashboard" element={<AdminDashboard/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

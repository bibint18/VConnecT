import { BrowserRouter as Router} from "react-router-dom";
// import Signup from "./pages/Signup";
// import VerifyOTP from "./pages/VerifyOTP";
// import Login from "./components/Login";
// import AdminLogin from "./components/AdminLogin";
// import Dashboard from "./components/Dashboard";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
// import Home from "./components/Home";
// import ProtectedRoute from "./components/ProtectedRoute";
// import AdminDashboard from "./pages/AdminDashboard";
// import CustomerDashboard from "./components/admin/dashboard/CustomerDashboard";
// import AdminCustomers from "./pages/AdminCustomers";
// import Plans from './components/admin/plans/Plans'
// import AddPlansPage from "./components/admin/plans/AddPlan";
// import AdminPlans from "./pages/AdminPlans";
// import AdminAddPlan from "./pages/AdminAddPlans";
// import AdminEditPlan from "./pages/AdminEditPlan";
// import Header from "./components/User/Header/Header";
// import HomePage from "./components/User/Header/HomePage";
// import LandingPage from './pages/LandingPage'
// import ProfilePage from "./components/User/Profile/Page";
// import ListRoom from "./components/User/Room/ListRoom";
// import RoomPage from "./components/User/Room/RoomPage";
// import AddRoom from "./components/User/Room/AddRoom";
// import AddRoomPage from "./components/User/Room/AddRoomPage";
import {Toaster} from 'react-hot-toast'
// import RoomCall from "./components/User/Room/Calls/RoomCall";
import AppRoute from "./components/Routes/AppRoute";
function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <ToastContainer />  
      <AppRoute/> 
      {/* <Routes>
        
        <Route path="/room/:roomId/call" element={<RoomCall/>} />
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="/addRoom" element={<AddRoomPage/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/landing" element={<LandingPage/>} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/rooms" element={<RoomPage/>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/plans" element={<AdminPlans />} />
          <Route path="/users" element={<AdminCustomers />} />
          <Route path="/plans/edit/:id" element={<AdminEditPlan />} />
          <Route path="/plans/add" element={<AdminAddPlan />} />
        </Route>
      </Routes> */}
    </Router>
  );
}

export default App;

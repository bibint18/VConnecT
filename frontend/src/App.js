import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router } from "react-router-dom";
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
import { Toaster } from 'react-hot-toast';
// import RoomCall from "./components/User/Room/Calls/RoomCall";
import AppRoute from "./components/Routes/AppRoute";
function App() {
    return (_jsxs(Router, { children: [_jsx(Toaster, { position: "top-right" }), _jsx(ToastContainer, {}), _jsx(AppRoute, {})] }));
}
export default App;

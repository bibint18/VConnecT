import {Routes, Route } from "react-router-dom";
import Signup from "../../pages/Signup";
import VerifyOTP from "../../pages/VerifyOTP";
import Login from "../Login";
import AdminLogin from "../AdminLogin";
// import Dashboard from "./components/Dashboard";
import "react-toastify/dist/ReactToastify.css";

// import Home from "./components/Home";
import ProtectedRoute from "../ProtectedRoute";
import AdminDashboard from "../../pages/AdminDashboard";
// import CustomerDashboard from "./components/admin/dashboard/CustomerDashboard";
import AdminCustomers from "../../pages/AdminCustomers";
// import Plans from './components/admin/plans/Plans'
// import AddPlansPage from "./components/admin/plans/AddPlan";
import AdminPlans from "../../pages/AdminPlans";
import AdminAddPlan from "../../pages/AdminAddPlans";
import AdminEditPlan from "../../pages/AdminEditPlan";
// import Header from "./components/User/Header/Header";
import HomePage from "../User/Header/HomePage";
import LandingPage from '../../pages/LandingPage'
import ProfilePage from "../User/Profile/Page";
// import ListRoom from "./components/User/Room/ListRoom";
// import RoomPage from "../User/Room/AddRoomPage";
// import AddRoom from "./components/User/Room/AddRoom";
import AddRoomPage from "../User/Room/AddRoomPage";
import RoomPage from "../User/Room/RoomPage";
import RoomCall from "../User/Room/Calls/RoomCall";
import FriendRequests from "../User/Friends/FriendRequest";
import AdminRoom from "@/pages/AdminRoom";
import RoomDetails from "../admin/Room/RoomDetails";
import AdminTriviaForm from "../admin/Trivia/AdminTriviaForm";
import ListTrivia from "../admin/Trivia/ListTrivia";
import AdminTriviaEdit from "../admin/Trivia/EditTrivia";

function AppRoute() {
  return (

    <Routes>
        {/* <Route path="/header" element={<HomePage/>} /> */}

        {/* <Route path="/addplans" element={<AddPlansPage/>} /> */}
        <Route path="/friends/request" element={<FriendRequests/>} />
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
        <Route path="/admin/room-details/:id" element={<RoomDetails />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/plans" element={<AdminPlans />} />
          <Route path="/users" element={<AdminCustomers />} />
          <Route path="/plans/edit/:id" element={<AdminEditPlan />} />
          <Route path="/plans/add" element={<AdminAddPlan />} />
          <Route path="/admin/rooms" element={<AdminRoom />} />
          <Route path="/trivia/add" element={<AdminTriviaForm/>} />
          <Route path="/trivia" element={<ListTrivia/>} />
          <Route path="/admin/trivia/edit/:id" element={<AdminTriviaEdit />} />
        </Route>
      </Routes>
  )
}

export default AppRoute

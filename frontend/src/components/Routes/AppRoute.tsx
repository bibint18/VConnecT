import { Routes, Route } from "react-router-dom";
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
import LandingPage from "../../pages/LandingPage";
import ProfilePage from "../User/Profile/Page";
// import ListRoom from "./components/User/Room/ListRoom";
// import RoomPage from "../User/Room/AddRoomPage";
// import AddRoom from "./components/User/Room/AddRoom";
import AddRoomPage from "../User/Room/AddRoomPage";
import RoomPage from "../User/Room/RoomPage";
import RoomCall from "../User/Room/Calls/RoomCall";
import FriendRequests from "../User/Friends/FriendRequest";
import AdminRoom from "@/pages/AdminRoom";
// import UserTrivia from "../User/Trivia/UserTrivia";
import TriviaPage from "../User/Trivia/TriviaPage";
import AdminTriviaPage from "@/pages/AdminTririvaPage";
import AdminTriviaAddPage from "@/pages/AdminTriviaAdd";
import AdminEditTriviaPage from "@/pages/AdminTriviaEdit";
import ChatDashboard from "../User/Chat/ChatDashboard";
import AdminRewardPage from "../admin/Reward/RewardPage";
import AddRewardPage from "../admin/Reward/AddRewardPage";
import RoomDetailsPage from "../admin/Room/RoomDetailsPage";

import RewardPage from "../User/Reward/RewardPage";
import PlansPage from "../User/Plans/PlansPage";
import PricingSuccess from "../User/Plans/PricingSuccess";
import UserProtectedRoute from "../User/UserProtectedRoute";

function AppRoute() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/login" element={<Login />} />
      <Route path="/adminLogin" element={<AdminLogin />} />
      <Route path="/" element={<HomePage />} />


      {/* User Protected Routes */}
  <Route element={<UserProtectedRoute/>}>
      <Route path="/friends/request" element={<FriendRequests />} />
      <Route path="/room/:roomId/call" element={<RoomCall />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/addRoom" element={<AddRoomPage />} />
      
      <Route path="/rooms" element={<RoomPage />} />
      <Route path="/dailyTrivia" element={<TriviaPage />} />
      <Route path="/friends" element={<ChatDashboard />} />
      <Route path="/rewards" element={<RewardPage />} />
      <Route path="/user/plans" element={<PlansPage />} />
      <Route path="/pricing/success" element={<PricingSuccess />} />
  </Route>

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/plans" element={<AdminPlans />} />
        <Route path="/users" element={<AdminCustomers />} />
        <Route path="/plans/edit/:id" element={<AdminEditPlan />} />
        <Route path="/plans/add" element={<AdminAddPlan />} />
        <Route path="/admin/rooms" element={<AdminRoom />} />
        <Route path="/trivia/add" element={<AdminTriviaAddPage />} />
        <Route path="/trivia" element={<AdminTriviaPage />} />
        <Route
          path="/admin/trivia/edit/:id"
          element={<AdminEditTriviaPage />}
        />
        <Route path="/admin/room-details/:id" element={<RoomDetailsPage />} />
        <Route path="/admin/rewards" element={<AdminRewardPage />} />
        <Route path="/admin/rewards/add" element={<AddRewardPage />} />
        <Route
          path="/admin/rewards/edit/:rewardId"
          element={<AddRewardPage />}
        />
      </Route>
    </Routes>
  );
}

export default AppRoute;

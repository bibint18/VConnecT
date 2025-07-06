import { Routes, Route} from "react-router-dom";
import { lazy, Suspense } from "react";
import Spinner from "../Spinner"; 
import "react-toastify/dist/ReactToastify.css";

const Signup = lazy(() => import("../../pages/Signup"));
const Login = lazy(() => import("../Login"));
const AdminLogin = lazy(() => import("../AdminLogin"));
const ProtectedRoute = lazy(() => import("../ProtectedRoute"));
const AdminDashboard = lazy(() => import("../../pages/AdminDashboard"));
const AdminCustomers = lazy(() => import("../../pages/AdminCustomers"));
const AdminPlans = lazy(() => import("../../pages/AdminPlans"));
const AdminAddPlan = lazy(() => import("../../pages/AdminAddPlans"));
const AdminEditPlan = lazy(() => import("../../pages/AdminEditPlan"));
const HomePage = lazy(() => import("../User/Header/HomePage"));
const LandingPage = lazy(() => import("../../pages/LandingPage"));
const ProfilePage = lazy(() => import("../User/Profile/Page"));
const AddRoomPage = lazy(() => import("../User/Room/AddRoomPage"));
const RoomPage = lazy(() => import("../User/Room/RoomPage"));
const RoomCall = lazy(() => import("../User/Room/Calls/RoomCall"));
const AdminRoom = lazy(() => import("@/pages/AdminRoom"));
const TriviaPage = lazy(() => import("../User/Trivia/TriviaPage"));
const AdminTriviaPage = lazy(() => import("@/pages/AdminTririvaPage"));
const AdminTriviaAddPage = lazy(() => import("@/pages/AdminTriviaAdd"));
const AdminEditTriviaPage = lazy(() => import("@/pages/AdminTriviaEdit"));
const ChatDashboard = lazy(() => import("../User/Chat/ChatDashboard"));
const AdminRewardPage = lazy(() => import("../admin/Reward/RewardPage"));
const AddRewardPage = lazy(() => import("../admin/Reward/AddRewardPage"));
const RoomDetailsPage = lazy(() => import("../admin/Room/RoomDetailsPage"));
const RewardPage = lazy(() => import("../User/Reward/RewardPage"));
const PlansPage = lazy(() => import("../User/Plans/PlansPage"));
const PricingSuccess = lazy(() => import("../User/Plans/PricingSuccess"));
const UserProtectedRoute = lazy(() => import("../User/UserProtectedRoute"));
const DirectCallPage = lazy(() => import("../User/Chat/DirectCallPage"));
const DashboardPageAdmin = lazy(() => import("@/pages/DashboardPage"));
const MyPostPage = lazy(() => import("../User/Post/MyPostPage"));
const PostView = lazy(() => import("../User/Post/PostView"));
const FeedPage = lazy(() => import("../User/Post/FeedPage"));
const FriendRequestPage = lazy(() => import("../User/Friends/FriendRequestPage"));
const DetailsPage = lazy(() => import("../User/Room/DetailsPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function AppRoute() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/spinner" element={<Spinner/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/" element={<HomePage />} />

        {/* User Protected Routes */}
        <Route element={<UserProtectedRoute />}>
          <Route path="/friends/request" element={<FriendRequestPage />} />
          <Route path="/room/:roomId/call" element={<RoomCall />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/addRoom" element={<AddRoomPage />} />
          <Route path="/rooms" element={<RoomPage />} />
          <Route path="/dailyTrivia" element={<TriviaPage />} />
          <Route path="/friends" element={<ChatDashboard />} />
          <Route path="/rewards" element={<RewardPage />} />
          <Route path="/user/plans" element={<PlansPage />} />
          <Route path="/pricing/success" element={<PricingSuccess />} />
          <Route path="/call/:callId" element={<DirectCallPage />} />
          <Route path="/myPost" element={<MyPostPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/post/:postId" element={<PostView />} />
          <Route path="/roomDetails/:roomId" element={<DetailsPage />} />
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
          <Route path="/admin/trivia/edit/:id" element={<AdminEditTriviaPage />} />
          <Route path="/admin/room-details/:id" element={<RoomDetailsPage />} />
          <Route path="/admin/rewards" element={<AdminRewardPage />} />
          <Route path="/admin/rewards/add" element={<AddRewardPage />} />
          <Route path="/admin/rewards/edit/:rewardId" element={<AddRewardPage />} />
          <Route path="/dashboardPage" element={<DashboardPageAdmin />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoute;




















































































































































































































































































































































































// import { Routes, Route } from "react-router-dom";
// import Signup from "../../pages/Signup";
// import Login from "../Login";
// import AdminLogin from "../AdminLogin";
// import "react-toastify/dist/ReactToastify.css";
// import ProtectedRoute from "../ProtectedRoute";
// import AdminDashboard from "../../pages/AdminDashboard";
// import AdminCustomers from "../../pages/AdminCustomers";
// import AdminPlans from "../../pages/AdminPlans";
// import AdminAddPlan from "../../pages/AdminAddPlans";
// import AdminEditPlan from "../../pages/AdminEditPlan";
// import HomePage from "../User/Header/HomePage";
// import LandingPage from "../../pages/LandingPage";
// import ProfilePage from "../User/Profile/Page";
// import AddRoomPage from "../User/Room/AddRoomPage";
// import RoomPage from "../User/Room/RoomPage";
// import RoomCall from "../User/Room/Calls/RoomCall";
// import AdminRoom from "@/pages/AdminRoom";
// import TriviaPage from "../User/Trivia/TriviaPage";
// import AdminTriviaPage from "@/pages/AdminTririvaPage";
// import AdminTriviaAddPage from "@/pages/AdminTriviaAdd";
// import AdminEditTriviaPage from "@/pages/AdminTriviaEdit";
// import ChatDashboard from "../User/Chat/ChatDashboard";
// import AdminRewardPage from "../admin/Reward/RewardPage";
// import AddRewardPage from "../admin/Reward/AddRewardPage";
// import RoomDetailsPage from "../admin/Room/RoomDetailsPage";
// import RewardPage from "../User/Reward/RewardPage";
// import PlansPage from "../User/Plans/PlansPage";
// import PricingSuccess from "../User/Plans/PricingSuccess";
// import UserProtectedRoute from "../User/UserProtectedRoute";
// import DirectCallPage from "../User/Chat/DirectCallPage";
// import DashboardPageAdmin from "@/pages/DashboardPage";
// import MyPostPage from "../User/Post/MyPostPage";
// import PostView from "../User/Post/PostView";
// import FeedPage from "../User/Post/FeedPage";
// import FriendRequestPage from "../User/Friends/FriendRequestPage";
// import DetailsPage from "../User/Room/DetailsPage";
// import NotFound from "@/pages/NotFound";
// function AppRoute() {
//   return (
//     <Routes>
//       <Route path="/signup" element={<Signup />} />
//       <Route path="/landing" element={<LandingPage />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/adminLogin" element={<AdminLogin />} />
//       <Route path="/" element={<HomePage />} />


//       {/* User Protected Routes */}
//   <Route element={<UserProtectedRoute/>}>
//       <Route path="/friends/request" element={<FriendRequestPage />} />
//       <Route path="/room/:roomId/call" element={<RoomCall />} />
//       <Route path="/profile" element={<ProfilePage />} />
//       <Route path="/addRoom" element={<AddRoomPage />} />
//       <Route path="/rooms" element={<RoomPage />} />
//       <Route path="/dailyTrivia" element={<TriviaPage />} />
//       <Route path="/friends" element={<ChatDashboard />} />
//       <Route path="/rewards" element={<RewardPage />} />
//       <Route path="/user/plans" element={<PlansPage />} />
//       <Route path="/pricing/success" element={<PricingSuccess />} />
//       <Route path="/call/:callId" element={<DirectCallPage />} />
//       <Route path="/myPost" element={<MyPostPage />} />
//       <Route path="/feed" element={<FeedPage />} />
//       <Route path="/post/:postId" element={<PostView />} />
//       <Route path="/roomDetails/:roomId" element={<DetailsPage />} />

//   </Route>

//       {/* Admin Protected Routes */}
//       <Route element={<ProtectedRoute />}>
//         <Route path="/dashboard" element={<AdminDashboard />} />
//         <Route path="/plans" element={<AdminPlans />} />
//         <Route path="/users" element={<AdminCustomers />} />
//         <Route path="/plans/edit/:id" element={<AdminEditPlan />} />
//         <Route path="/plans/add" element={<AdminAddPlan />} />
//         <Route path="/admin/rooms" element={<AdminRoom />} />
//         <Route path="/trivia/add" element={<AdminTriviaAddPage />} />
//         <Route path="/trivia" element={<AdminTriviaPage />} />
//         <Route
//           path="/admin/trivia/edit/:id"
//           element={<AdminEditTriviaPage />}
//         />
//         <Route path="/admin/room-details/:id" element={<RoomDetailsPage />} />
//         <Route path="/admin/rewards" element={<AdminRewardPage />} />
//         <Route path="/admin/rewards/add" element={<AddRewardPage />} />
//         <Route
//           path="/admin/rewards/edit/:rewardId"
//           element={<AddRewardPage />}
//         />
//         <Route path="/dashboardPage" element={<DashboardPageAdmin />} />
//       </Route>
//       <Route path="*" element={<NotFound/>} />
//     </Routes>
//   );
// }

// export default AppRoute;




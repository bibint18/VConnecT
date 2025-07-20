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

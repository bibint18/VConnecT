import { Navigate,Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/store";


const ProtectedRoute = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to="/adminLogin" />
}

export default ProtectedRoute

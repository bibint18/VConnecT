import { Navigate,Outlet } from "react-router-dom";
import { useAppSelector } from "@/redux/store";
import React from "react";

const UserProtectedRoute : React.FC = () => {
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated)
  return isAuthenticated ? <Outlet/> : <Navigate to='/login' replace />
}

export default UserProtectedRoute
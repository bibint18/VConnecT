import React from 'react';
import logo from '../../../assets/logovct1.png'
import {useAppDispatch,useAppSelector} from '../../../redux/store.ts'
import { logoutTheUser } from '../../../redux/userSlice.ts';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInterceptor.ts';
const Header: React.FC = () => {
  const navigate = useNavigate()
  const {name,isAuthenticated,accessToken} = useAppSelector((state) => state.user)
  console.log("name",name,isAuthenticated,accessToken)
  const dispatch = useAppDispatch()
  const handleUserLogout = () => {
    dispatch(logoutTheUser())
  }
  const fetchAbout = async () => {
    const response = axiosInstance.get('http://localhost:3000/api/auth/user/about',{withCredentials:true})
    console.log((await response).data)
  }
  return (
    <header className="bg-white text-black p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <img className='w-36' src={logo} alt="" />
      </div>
      <nav className="hidden md:flex space-x-6">
        <a href="/" className="hover:text-purple-500">Home</a>
        <a href="#" className="hover:text-purple-500" onClick={fetchAbout}>About</a>
        <a href="/friends" className="hover:text-purple-500">Friends</a>
        <a href="/profile" className="hover:text-purple-500">Profile</a>
        <a href="/dailyTrivia" className="hover:text-purple-500">Daily Trivia</a>
        <a href="/feed" className="hover:text-purple-500">Community</a>
      </nav>

      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <span className="text-gray-700">{name}</span>
            <button
              onClick={handleUserLogout}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full hover:scale-105 transition"
            >
              LOGOUT
            </button>
          </>
        ) : (
          <button
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full hover:scale-105 transition" onClick={() => navigate('/login')}
          >
            LOGIN
          </button>
        )}
      </div>

      <div className="md:hidden">
        <button className="text-white">☰</button>
      </div>
    </header>
  );
};

export default Header;
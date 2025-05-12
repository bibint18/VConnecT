import React, { useEffect, useState } from 'react';
import './mainContent.css'
import image1 from '../../../assets/home1.png'
// import image2 from '../../../assets/home2.png'
import image3 from '../../../assets/meeting1.png'
import { useAppSelector } from '../../../redux/store';
import { useNavigate } from 'react-router-dom';
import { HomeData } from '@/services/HomeService';
const MainContent: React.FC = () => {
  const {isAuthenticated} = useAppSelector((state) => state.user)
  const [userCount,setUserCount] = useState(0);
  const [roomsCount,setRoomCount] = useState(0)
  const navigate = useNavigate()
  useEffect(() => {
    const fetchdata = async () => {
      const response = await HomeData();
      setUserCount(response.userCount)
    setRoomCount(response.roomCount)
    }
    
    fetchdata();
  })
  console.log("User and rooms",userCount,roomsCount)
  return (
    <main className="bg-black text-white">

      <section className="flex flex-col items-center justify-center h-screen text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          CONNECT THE PEOPLE THROUGH <br />
          V<span className="text-purple-500">CONNECT</span>
        </h1>
        {!isAuthenticated && (
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm md:text-base hover:scale-105 transition-transform w-24" onClick={() => navigate('/signup')}>
            REGISTER
          </button>
        )}
      </section>

      <section className="flex flex-col md:flex-row items-center justify-center py-16 px-4">
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <div className="bg-gray-500 h-64 md:h-96 rounded-lg flex items-center justify-center">
            <img src={image1} alt="" />
          </div>
        </div>
        <div className="w-full md:w-1/2 md:pl-8 text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Make Memorable Moments</h2>
          <p className="text-gray-400 mb-6">
          Host meetings, hang out with friends, or collaborate with your team — all in real-time, no downloads needed.
          Start your room. Share the code, Talk. It's that simple.
          </p>
          <div className="flex justify-center md:justify-start space-x-4">
            <div className="bg-purple-600 p-4 rounded-lg">
              <p className="text-2xl font-bold">{roomsCount}</p>
              <p className="text-sm">Total Rooms Hosted</p>
            </div>
            <div className="bg-purple-600 p-4 rounded-lg">
              <p className="text-2xl font-bold">{userCount}</p>
              <p className="text-sm">Total Users</p>
            </div>
          </div>
        </div>
      </section>

<section className="bg-black text-white py-16 px-4 flex flex-col md:flex-row items-center justify-center">
      <div className="w-full md:w-1/2 md:pr-8 text-left">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Create Your Professional Virtual Space
        </h2>
        <p className="text-gray-300 mb-8 max-w-lg">
        VConnect is a seamless solution for creating private virtual rooms and communicating in real time. Designed for professionals, teams, and communities, it allows you to connect effortlessly.
        </p>
        <button onClick={() => navigate('/addRoom')} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gradient-to-r hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105">
          Create Room
        </button>
      </div>
      <div className="w-full md:w-1/2 mt-8 md:mt-0">
        <div className="bg-gray-800 h-64 md:h-96 rounded-lg overflow-hidden shadow-lg border border-gray-700">
          <img
            src={image3}
            alt="Virtual Space Preview"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>
    </section>
    </main>
  );
};

export default MainContent;
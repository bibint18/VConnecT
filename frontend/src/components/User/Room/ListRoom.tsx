import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAllRooms, joinRoom } from '@/services/roomService';
import './ListRoom.css';
import toast from 'react-hot-toast';
import { IUser } from '@/components/admin/dashboard/CustomerDashboard';

interface Room {
  _id: string;
  title: string;
  description: string;
  limit: number;
  premium: boolean;
  type: 'PUBLIC' | 'PRIVATE';
  createdAt: string;
}

const ListRoom: React.FC = () => {
  const [secretCode, setSecretCode] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalSecretCode, setModalSecretCode] = useState(''); 
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"" | "PUBLIC" | "PRIVATE">('');
  const [search,setSearch] = useState('')
  const [totalRooms,setTotalRooms] = useState(0)
  const roomsPerPage = 10;
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user,setUser] = useState<IUser | null>(null)
 
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getAllRooms(currentPage, roomsPerPage, search, filter);
        setRooms(data.rooms);
        setUser(data.user)
        setTotalRooms(data.total)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load rooms');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [search,filter,currentPage]);

console.log("user details",user)
  const handleJoinRoom = async (roomId: string, roomType: string) => {
    if (roomType === 'PRIVATE') {
      setSelectedRoomId(roomId);
      setShowModal(true);
      return;
    }
    try {
      const response = await joinRoom(roomId);
      toast.success(`User joined "${response.room.title}"`, { duration: 3000 });
      navigate(`/room/${roomId}/call`)
      const data = await getAllRooms();
      setRooms(data.rooms);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to join room');
    }
  };

  const handleModalJoin = async () => {
    if (!selectedRoomId || !modalSecretCode) return;

    try {
      const response = await joinRoom(selectedRoomId, modalSecretCode);
      toast.success(`User joined "${response.room.title}"`, { duration: 3000 });
      // const data = await getAllRooms();
      // setRooms(data.rooms);
      setShowModal(false);
      setModalSecretCode('');
      setSelectedRoomId(null);
      navigate(`/room/${selectedRoomId}/call`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to join room');
    }
  };

  const handleCreateRoom = () => {
    navigate('/addRoom');
    console.log('Creating a new room');
  };

  const handleJoinWithCode = () => {
    console.log(`Joining with code: ${secretCode}`);
    setSecretCode('');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
    hover: { scale: 1.03, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hover: { scale: 1.1, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const sectionVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };


  if (loading) return <div className="text-center mt-10">Loading rooms...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  const totalPages = Math.ceil(totalRooms/roomsPerPage);
  return (
    <div className="list-room-container">
      <div className="list-room-inner">
       
        <motion.div
          className="top-section"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
         
          <motion.div
            className="featured-room-card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            custom={0}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="room-title">CodeCrafters Hub</h3>
              <div className="edit-delete-buttons">
                <button>
                  <FiEdit2 size={18} />
                </button>
                <button>
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
            <div className="description-label">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Description:
            </div>
            <p className="description">
              A space for developers to discuss programming languages, best practices, and code optimization techniques. Share your projects, get feedback, and collaborate on open-source contributions.
            </p>
            <div className="action-section">
              <motion.button
                className="enter-button"
                // onClick={() => handleJoinRoom('featured')}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Enter
              </motion.button>
              <div className="flex items-center">
                <span className="user-count">1020</span>
                <div className="avatars">
                  {[1, 2, 3, 4].map((user) => (
                    <img
                      key={user}
                      className="w-6 h-6 rounded-full border border-gray-800"
                      src={`https://randomuser.me/api/portraits/${user % 2 === 0 ? 'women' : 'men'}/${20 + user * 10}.jpg`}
                      alt="User avatar"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="create-join-section"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.button
              className="create-room-button"
              onClick={handleCreateRoom}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Create Room +
            </motion.button>

            <div className="join-code-section">
              <h2>YOUR AVAILABLE LIMIT TO CREATE ROOM:</h2>
              <div className="join-code-input-group">
                {/* <input
                  type="text"
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  placeholder="Enter your code here"
                  className="join-code-input"
                /> */}
                <motion.button
                  className="join-code-button"
                  onClick={handleJoinWithCode}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {user?.availableRoomLimit}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>

     
        <motion.div
          className="available-rooms-section"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="available-rooms-header">
            <h2>Available Rooms</h2>
            <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1); 
                }}
                placeholder="Search by title or description..."
                className="search-input !text-black  p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 !max-w-66"
              />
            <div className="filter-select-wrapper">
            <select
                  className="filter-select p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value as "" | "PUBLIC" | "PRIVATE");
                    setCurrentPage(1); 
                  }}
                >
                  <option value="" className='!text-black'>All Types</option>
                  <option value="PUBLIC" className='!text-black'>Public</option>
                  <option value="PRIVATE" className='!text-black'>Private</option>
                </select>
              <div className="filter-select-arrow">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="room-grid">
            {rooms.map((room, index) => (
              <motion.div
                key={room._id}
                className="room-card"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                custom={index}
              >
                {room.premium && (
                  <div className="featured-star">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                )}
                <div className="description-label">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Description:
                </div>
                <h3 className="room-title">{room.title}</h3>
                <p className="description">{room.description}</p>
                <div className="action-section">
                  <motion.button
                    className="join-button"
                    onClick={() => handleJoinRoom(room._id,room.type)}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Join
                  </motion.button>
                  <div className="flex items-center">
                    <span className="user-count ">{room.limit}</span>
                  
                    <div className="avatars">
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {totalPages > 1 && (
            <div className="pagination mt-6 flex justify-center items-center gap-2">
              <motion.button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                variants={buttonVariants}
                whileHover={currentPage !== 1 ? "hover" : undefined}
                whileTap={currentPage !== 1 ? "tap" : undefined}
              >
                Previous
              </motion.button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <motion.button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                variants={buttonVariants}
                whileHover={currentPage !== totalPages ? "hover" : undefined}
                whileTap={currentPage !== totalPages ? "tap" : undefined}
              >
                Next
              </motion.button>
            </div>
          )}
        

{showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Join Private Room</h3>
            <p className="text-gray-600 mb-4">
              Enter the secret code to join this private room:
            </p>
            <input
              type="text"
              value={modalSecretCode}
              onChange={(e) => setModalSecretCode(e.target.value)}
              placeholder="Enter secret code"
              className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="flex justify-between gap-4">
              <motion.button
                onClick={handleModalJoin}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Join
              </motion.button>
              <motion.button
                onClick={() => {
                  setShowModal(false);
                  setModalSecretCode('');
                  setSelectedRoomId(null);
                }}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ListRoom;



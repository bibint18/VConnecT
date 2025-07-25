
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAllRooms, joinRoom,deleteRoom} from '@/services/roomService';
import './ListRoom.css';
import toast from 'react-hot-toast';
import { Lock, Unlock, Search, Trash2 } from 'lucide-react';
import Pagination from '@/components/Pagination';
import Swal from 'sweetalert2';
interface Room {
  _id: string;
  title: string;
  description: string;
  limit: number;
  premium: boolean;
  type: 'PUBLIC' | 'PRIVATE';
  createdAt: string;
  createdBy: { name: string; email: string };
}

interface User {
  name: string;
  email: string;
  availableRoomLimit: number;
}

const ListRoom: React.FC = () => {
  const [secretCode, setSecretCode] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalSecretCode, setModalSecretCode] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"" | "PUBLIC" | "PRIVATE" | "MY">('');
  const [search, setSearch] = useState('');
  const [totalRooms, setTotalRooms] = useState(0);
  const roomsPerPage = 9;
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getAllRooms(currentPage, roomsPerPage, search, filter);
        setRooms(data.rooms);
        setUser(data.user);
        setTotalRooms(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load rooms');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [search, filter, currentPage]);

  const handleJoinRoom = async (roomId: string, roomType: string) => {
    if (roomType === 'PRIVATE') {
      setSelectedRoomId(roomId);
      setShowModal(true);
      return;
    }
    try {
      const response = await joinRoom(roomId);
      toast.success(`User joined "${response.room.title}"`, { duration: 3000 });
      navigate(`/room/${roomId}/call`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to join room');
    }
  };

  const handleModalJoin = async () => {
    if (!selectedRoomId || !modalSecretCode) return;

    try {
      const response = await joinRoom(selectedRoomId, modalSecretCode);
      toast.success(`User joined "${response.room.title}"`, { duration: 3000 });
      setShowModal(false);
      setModalSecretCode('');
      setSelectedRoomId(null);
      navigate(`/room/${selectedRoomId}/call`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to join room');
    }
  };



  const handleDeleteRoom = async (roomId: string, roomTitle: string) => {
  const result = await Swal.fire({
    title: `Delete "${roomTitle}"?`,
    text: "This action cannot be undone.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  });

  if (result.isConfirmed) {
    try {
      await deleteRoom(roomId);
      setRooms(rooms.filter((room) => room._id !== roomId));
      setTotalRooms(totalRooms - 1);
      Swal.fire({
        title: 'Deleted!',
        text: `Room "${roomTitle}" was successfully deleted.`,
        icon: 'success',
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err instanceof Error ? err.message : 'Failed to delete room',
      });
    }
  }
};


  const handleViewRoomDetails =async (roomId: string) => {
    navigate(`/roomDetails/${roomId}`)
  };

  const handleCreateRoom = () => {
    navigate('/addRoom');
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

  if (loading) return <div className="text-center mt-10 text-white">Loading rooms...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  const totalPages = Math.ceil(totalRooms / roomsPerPage);

  return (
    <div className="list-room-container">
      <div className="list-room-inner mt-2">
        <motion.div
          className="top-section"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="create-join-section"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.button
              className="create-room-button text-sm sm:text-base"
              onClick={handleCreateRoom}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Create Room +
            </motion.button>

            <div className="join-code-section">
              <h2 className="text-lg sm:text-xl md:text-2xl">
                YOUR AVAILABLE LIMIT TO CREATE ROOM:
              </h2>
              <div className="join-code-input-group">
                <motion.button
                  className="join-code-button text-sm sm:text-base"
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
          <div className="available-rooms-header flex flex-col sm:flex-row gap-4 sm:gap-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl">Available Rooms</h2>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by title or description..."
                className="search-input !text-white-900 p-2 border border-white-900 rounded-md focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto"
              />
              <div className="filter-select-wrapper">
                <select
                  className="filter-select p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value as "" | "PUBLIC" | "PRIVATE" | "MY");
                    setCurrentPage(1);
                  }}
                >
                  <option value="" className="!text-black">ALL ROOMS</option>
                  <option value="PUBLIC" className="!text-black">PUBLIC</option>
                  <option value="PRIVATE" className="!text-black">PRIVATE</option>
                  <option value="MY" className="!text-black">MY ROOMS</option>
                </select>
                <div className="filter-select-arrow">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
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
                      className="h-4 sm:h-5 w-4 sm:w-5"
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
                    className="h-3 sm:h-4 w-3 sm:w-4 mr-1"
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
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="room-title text-sm sm:text-base md:text-lg">{room.title}</h3>
                    
                    {room.type === 'PUBLIC' ? (
                      <Unlock className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Lock className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  
                  {user && room.createdBy.email === user.email && (
                    <div className="flex items-center gap-2">
                      
                      <motion.button
                        onClick={() => handleViewRoomDetails(room._id)}
                        className="text-gray-400 hover:text-indigo-500 transition"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        title="View Room Details"
                      >
                        <Search className="h-4 w-4" />
                      </motion.button>
                      
                      <motion.button
                        onClick={() => handleDeleteRoom(room._id, room.title)}
                        className="text-gray-400 hover:text-red-500 transition"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        title="Delete Room"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  )}
                </div>
                <p className="description text-xs sm:text-sm">{room.description}</p>
                <div className="action-section">
                  <motion.button
                    className="join-button text-xs sm:text-sm"
                    onClick={() => handleJoinRoom(room._id, room.type)}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Join
                  </motion.button>
                  <div className="flex items-center">
                    <span className="user-count text-xs sm:text-sm">{room.limit}</span>
                    <div className="avatars"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
          
        {totalPages > 1 && (
          <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          />
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              className="bg-white rounded-lg p-4 sm:p-6 max-w-sm w-[90%] sm:w-full shadow-lg"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Join Private Room</h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Enter the secret code to join this private room:
              </p>
              <input
                type="text"
                value={modalSecretCode}
                onChange={(e) => setModalSecretCode(e.target.value)}
                placeholder="Enter secret code"
                className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
              />
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <motion.button
                  onClick={handleModalJoin}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition text-sm sm:text-base"
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
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition text-sm sm:text-base"
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
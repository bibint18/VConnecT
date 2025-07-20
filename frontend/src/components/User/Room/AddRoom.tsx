
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '@/services/roomService';
import './AddRoom.css';

export interface RoomFormData {
  title: string;
  limit: number;
  premium: "Yes" | "No";
  type: "PUBLIC" | "PRIVATE";
  description: string;
}

const AddRoom: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RoomFormData>({
    title: '',
    limit: 0,
    premium: 'No',
    type: 'PUBLIC',
    description: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [secretCode, setSecretCode] = useState<string | null>(null); 
  const [showModal, setShowModal] = useState(false); 

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'limit' ? parseInt(value) || 0 : value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createRoom(formData);
      const newRoom = response.room;
      if (newRoom.type === 'PRIVATE' && newRoom.secretCode) {
        setSecretCode(response.room.secretCode);
        setShowModal(true); 
      } else {
        navigate('/rooms'); 
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create room');
    }
  };

  const handleCancel = () => {
    navigate('/rooms');
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSecretCode(null);
    navigate('/rooms'); 
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    hover: { scale: 1.1, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="add-room-container !pl-23">
      <motion.div
        className="form-card"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Room</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter room title"
              
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Limit</label>
            <input
              type="number"
              name="limit"
              value={formData.limit}
              onChange={handleFormChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter user limit"
              min="0"
              
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Premium</label>
            <select
              name="premium"
              value={formData.premium}
              onChange={handleFormChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleFormChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="PUBLIC">PUBLIC</option>
              <option value="PRIVATE">PRIVATE</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter room description"
              rows={3}
              
            />
          </div>
          <div className="flex gap-4">
            <motion.button
              type="submit"
              className="flex-1 join-button"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Create Room
            </motion.button>
            <motion.button
              type="button"
              onClick={handleCancel}
              className="flex-1 cancel-button"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Private Room Created!</h3>
            <p className="text-gray-600 mb-4">
              Share this secret code with others to let them join your private room:
            </p>
            <div className="bg-gray-100 p-3 rounded-md text-center text-indigo-600 font-mono text-lg mb-4">
              {secretCode}
            </div>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => navigator.clipboard.writeText(secretCode || '')}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
              >
                Copy Code
              </button>
              <button
                onClick={handleModalClose}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AddRoom;
// import React, { ChangeEvent, FormEvent } from 'react';
// import { motion } from 'framer-motion';

// interface FormData {
//   title: string;
//   limit: number;
//   premium: string;
//   type: string;
//   description: string;
// }

// interface CreateRoomFormProps {
//   formData: FormData;
//   onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
//   onSubmit: (e: FormEvent) => void;
//   onCancel: () => void;
// }

// const AddRoom: React.FC<CreateRoomFormProps> = ({ formData, onChange, onSubmit, onCancel }) => {
//   const buttonVariants = {
//     hover: { scale: 1.1, transition: { duration: 0.2 } },
//     tap: { scale: 0.95 },
//   };

//   return (
//     <motion.div
//       className="form-card"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: 20 }}
//       transition={{ duration: 0.5 }}
//     >
//       <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Room</h2>
//       <form onSubmit={onSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Title</label>
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={onChange}
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Enter room title"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Limit</label>
//           <input
//             type="number"
//             name="limit"
//             value={formData.limit}
//             onChange={onChange}
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Enter user limit"
//             min="0"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Premium</label>
//           <select
//             name="premium"
//             value={formData.premium}
//             onChange={onChange}
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
//           >
//             <option value="No">No</option>
//             <option value="Yes">Yes</option>
//           </select>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Type</label>
//           <select
//             name="type"
//             value={formData.type}
//             onChange={onChange}
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
//           >
//             <option value="PUBLIC">PUBLIC</option>
//             <option value="PRIVATE">PRIVATE</option>
//           </select>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Description</label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={onChange}
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Enter room description"
//             rows={3}
//             required
//           />
//         </div>
//         <div className="flex gap-4">
//           <motion.button
//             type="submit"
//             className="flex-1 join-button"
//             variants={buttonVariants}
//             whileHover="hover"
//             whileTap="tap"
//           >
//             Create Room
//           </motion.button>
//           <motion.button
//             type="button"
//             onClick={onCancel}
//             className="flex-1 cancel-button"
//             variants={buttonVariants}
//             whileHover="hover"
//             whileTap="tap"
//           >
//             Cancel
//           </motion.button>
//         </div>
//       </form>
//     </motion.div>
//   );
// };

// export default AddRoom;




// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import './AddRoom.css'; // We'll create this CSS file next
// import { createRoom } from '@/services/roomService';
// import { toast } from 'react-toastify';

// export interface FormData {
//   title: string;
//   limit: number;
//   premium: string;
//   type: string;
//   description: string;
// }

// const AddRoom: React.FC = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState<FormData>({
//     title: '',
//     limit: 0,
//     premium: 'No',
//     type: 'PUBLIC',
//     description: '',
//   });

//   const handleFormChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === 'limit' ? parseInt(value) || 0 : value,
//     }));
//   };

//   const handleFormSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     try {
//       const response = await createRoom(formData)
//       console.log(response)
//       navigate('/rooms')
//     } catch (error) {
//       if(error instanceof Error){
//         toast.error(error.message)
//       }else{
//         toast.error("failed creating plan")
//       }
//     }
//   };

//   // const handleCancel = () => {
//   //   navigate('/'); // Navigate back to the ListRoom route on cancel
//   // };

//   // Animation Variants
//   const formVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
//   };

//   const buttonVariants = {
//     hover: { scale: 1.1, transition: { duration: 0.2 } },
//     tap: { scale: 0.95 },
//   };

//   return (
//     <div className="add-room-container">
//       <motion.div
//         className="form-card"
//         variants={formVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Room</h2>
//         <form onSubmit={handleFormSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Title</label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleFormChange}
//               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Enter room title"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Limit</label>
//             <input
//               type="number"
//               name="limit"
//               value={formData.limit}
//               onChange={handleFormChange}
//               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Enter user limit"
//               min="0"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Premium</label>
//             <select
//               name="premium"
//               value={formData.premium}
//               onChange={handleFormChange}
//               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
//             >
//               <option value="No">No</option>
//               <option value="Yes">Yes</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Type</label>
//             <select
//               name="type"
//               value={formData.type}
//               onChange={handleFormChange}
//               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
//             >
//               <option value="PUBLIC">PUBLIC</option>
//               <option value="PRIVATE">PRIVATE</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Description</label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleFormChange}
//               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Enter room description"
//               rows={3}
//               required
//             />
//           </div>
//           <div className="flex gap-4">
//             <motion.button
//               type="submit"
//               className="flex-1 join-button"
//               variants={buttonVariants}
//               whileHover="hover"
//               whileTap="tap"
//             >
//               Create Room
//             </motion.button>
//             {/* <motion.button
//               type="button"
//               onClick={handleCancel}
//               className="flex-1 cancel-button"
//               variants={buttonVariants}
//               whileHover="hover"
//               whileTap="tap"
//             >
//               Cancel
//             </motion.button> */}
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// export default AddRoom;



// frontend/src/components/AddRoom.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '@/services/roomService';
import './AddRoom.css';

interface FormData {
  title: string;
  limit: number;
  premium: string;
  type: string;
  description: string;
}

const AddRoom: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    limit: 0,
    premium: 'No',
    type: 'PUBLIC',
    description: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [secretCode, setSecretCode] = useState<string | null>(null); // State for secret code
  const [showModal, setShowModal] = useState(false); // State for modal visibility

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
      console.log('Room created:', newRoom);
      if (newRoom.type === 'PRIVATE' && newRoom.secretCode) {
        setSecretCode(newRoom.secretCode); // Set secret code for private rooms
        setShowModal(true); // Show modal
      } else {
        navigate('/rooms'); // Navigate back for public rooms
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create room');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSecretCode(null);
    navigate('/rooms'); // Navigate after closing modal
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
    <div className="add-room-container">
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
              required
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
              required
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
              required
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

      {/* Secret Code Modal */}
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
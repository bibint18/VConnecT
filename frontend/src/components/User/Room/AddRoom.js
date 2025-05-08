import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '@/services/roomService';
import './AddRoom.css';
const AddRoom = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        limit: 0,
        premium: 'No',
        type: 'PUBLIC',
        description: '',
    });
    const [error, setError] = useState(null);
    const [secretCode, setSecretCode] = useState(null); // State for secret code
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'limit' ? parseInt(value) || 0 : value,
        }));
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createRoom(formData);
            const newRoom = response.room;
            console.log('Room created:', newRoom);
            if (newRoom.type === 'PRIVATE' && newRoom.secretCode) {
                setSecretCode(newRoom.secretCode);
                setShowModal(true);
            }
            else {
                navigate('/rooms');
            }
        }
        catch (err) {
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
    return (_jsxs("div", { className: "add-room-container !pl-23", children: [_jsxs(motion.div, { className: "form-card", variants: formVariants, initial: "hidden", animate: "visible", children: [_jsx("h2", { className: "text-xl font-bold text-gray-800 mb-4", children: "Create New Room" }), error && _jsx("p", { className: "text-red-500 mb-4", children: error }), _jsxs("form", { onSubmit: handleFormSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Title" }), _jsx("input", { type: "text", name: "title", value: formData.title, onChange: handleFormChange, className: "mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500", placeholder: "Enter room title" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Limit" }), _jsx("input", { type: "number", name: "limit", value: formData.limit, onChange: handleFormChange, className: "mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500", placeholder: "Enter user limit", min: "0" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Premium" }), _jsxs("select", { name: "premium", value: formData.premium, onChange: handleFormChange, className: "mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500", children: [_jsx("option", { value: "No", children: "No" }), _jsx("option", { value: "Yes", children: "Yes" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Type" }), _jsxs("select", { name: "type", value: formData.type, onChange: handleFormChange, className: "mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500", children: [_jsx("option", { value: "PUBLIC", children: "PUBLIC" }), _jsx("option", { value: "PRIVATE", children: "PRIVATE" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Description" }), _jsx("textarea", { name: "description", value: formData.description, onChange: handleFormChange, className: "mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500", placeholder: "Enter room description", rows: 3 })] }), _jsxs("div", { className: "flex gap-4", children: [_jsx(motion.button, { type: "submit", className: "flex-1 join-button", variants: buttonVariants, whileHover: "hover", whileTap: "tap", children: "Create Room" }), _jsx(motion.button, { type: "button", onClick: handleCancel, className: "flex-1 cancel-button", variants: buttonVariants, whileHover: "hover", whileTap: "tap", children: "Cancel" })] })] })] }), showModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { className: "bg-white rounded-lg p-6 max-w-sm w-full shadow-lg", variants: modalVariants, initial: "hidden", animate: "visible", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-800 mb-2", children: "Private Room Created!" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Share this secret code with others to let them join your private room:" }), _jsx("div", { className: "bg-gray-100 p-3 rounded-md text-center text-indigo-600 font-mono text-lg mb-4", children: secretCode }), _jsxs("div", { className: "flex justify-between gap-4", children: [_jsx("button", { onClick: () => navigator.clipboard.writeText(secretCode || ''), className: "flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition", children: "Copy Code" }), _jsx("button", { onClick: handleModalClose, className: "flex-1 bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition", children: "Close" })] })] }) }))] }));
};
export default AddRoom;

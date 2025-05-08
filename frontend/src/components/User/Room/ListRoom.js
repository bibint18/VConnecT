import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAllRooms, joinRoom } from '@/services/roomService';
import './ListRoom.css';
import toast from 'react-hot-toast';
const ListRoom = () => {
    const [secretCode, setSecretCode] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [modalSecretCode, setModalSecretCode] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');
    const [totalRooms, setTotalRooms] = useState(0);
    const roomsPerPage = 10;
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const data = await getAllRooms(currentPage, roomsPerPage, search, filter);
                setRooms(data.rooms);
                setUser(data.user);
                setTotalRooms(data.total);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load rooms');
            }
            finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, [search, filter, currentPage]);
    console.log("user details", user);
    const handleJoinRoom = async (roomId, roomType) => {
        if (roomType === 'PRIVATE') {
            setSelectedRoomId(roomId);
            setShowModal(true);
            return;
        }
        try {
            const response = await joinRoom(roomId);
            toast.success(`User joined "${response.room.title}"`, { duration: 3000 });
            navigate(`/room/${roomId}/call`);
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to join room');
        }
    };
    const handleModalJoin = async () => {
        if (!selectedRoomId || !modalSecretCode)
            return;
        try {
            const response = await joinRoom(selectedRoomId, modalSecretCode);
            toast.success(`User joined "${response.room.title}"`, { duration: 3000 });
            setShowModal(false);
            setModalSecretCode('');
            setSelectedRoomId(null);
            navigate(`/room/${selectedRoomId}/call`);
        }
        catch (err) {
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
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
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
    if (loading)
        return _jsx("div", { className: "text-center mt-10 text-white", children: "Loading rooms..." });
    if (error)
        return _jsx("div", { className: "text-red-500 text-center mt-10", children: error });
    const totalPages = Math.ceil(totalRooms / roomsPerPage);
    return (_jsx("div", { className: "list-room-container", children: _jsxs("div", { className: "list-room-inner mt-2", children: [_jsx(motion.div, { className: "top-section", variants: sectionVariants, initial: "hidden", animate: "visible", children: _jsxs(motion.div, { className: "create-join-section", variants: sectionVariants, initial: "hidden", animate: "visible", children: [_jsx(motion.button, { className: "create-room-button text-sm sm:text-base", onClick: handleCreateRoom, variants: buttonVariants, whileHover: "hover", whileTap: "tap", children: "Create Room +" }), _jsxs("div", { className: "join-code-section", children: [_jsx("h2", { className: "text-lg sm:text-xl md:text-2xl", children: "YOUR AVAILABLE LIMIT TO CREATE ROOM:" }), _jsx("div", { className: "join-code-input-group", children: _jsx(motion.button, { className: "join-code-button text-sm sm:text-base", onClick: handleJoinWithCode, variants: buttonVariants, whileHover: "hover", whileTap: "tap", children: user?.availableRoomLimit }) })] })] }) }), _jsxs(motion.div, { className: "available-rooms-section", variants: sectionVariants, initial: "hidden", animate: "visible", children: [_jsxs("div", { className: "available-rooms-header flex flex-col sm:flex-row gap-4 sm:gap-6", children: [_jsx("h2", { className: "text-xl sm:text-2xl md:text-3xl", children: "Available Rooms" }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3 items-start sm:items-center", children: [_jsx("input", { type: "text", value: search, onChange: (e) => {
                                                setSearch(e.target.value);
                                                setCurrentPage(1);
                                            }, placeholder: "Search by title or description...", className: "search-input !text-black p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto" }), _jsxs("div", { className: "filter-select-wrapper", children: [_jsxs("select", { className: "filter-select p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base", value: filter, onChange: (e) => {
                                                        setFilter(e.target.value);
                                                        setCurrentPage(1);
                                                    }, children: [_jsx("option", { value: "", className: "!text-black", children: "All Types" }), _jsx("option", { value: "PUBLIC", className: "!text-black", children: "Public" }), _jsx("option", { value: "PRIVATE", className: "!text-black", children: "Private" })] }), _jsx("div", { className: "filter-select-arrow", children: _jsx("svg", { className: "w-4 h-4 fill-current", viewBox: "0 0 20 20", children: _jsx("path", { d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" }) }) })] })] })] }), _jsx("div", { className: "room-grid", children: rooms.map((room, index) => (_jsxs(motion.div, { className: "room-card", variants: cardVariants, initial: "hidden", animate: "visible", whileHover: "hover", custom: index, children: [room.premium && (_jsx("div", { className: "featured-star", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 sm:h-5 w-4 sm:w-5", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" }) }) })), _jsxs("div", { className: "description-label", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-3 sm:h-4 w-3 sm:w-4 mr-1", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }), "Description:"] }), _jsx("h3", { className: "room-title text-sm sm:text-base md:text-lg", children: room.title }), _jsx("p", { className: "description text-xs sm:text-sm", children: room.description }), _jsxs("div", { className: "action-section", children: [_jsx(motion.button, { className: "join-button text-xs sm:text-sm", onClick: () => handleJoinRoom(room._id, room.type), variants: buttonVariants, whileHover: "hover", whileTap: "tap", children: "Join" }), _jsxs("div", { className: "flex items-center", children: [_jsx("span", { className: "user-count text-xs sm:text-sm", children: room.limit }), _jsx("div", { className: "avatars" })] })] })] }, room._id))) })] }), totalPages > 1 && (_jsxs("div", { className: "pagination mt-4 sm:mt-6 flex justify-center items-center gap-2", children: [_jsx(motion.button, { onClick: () => handlePageChange(currentPage - 1), disabled: currentPage === 1, className: `px-3 sm:px-4 py-1 sm:py-2 rounded-md text-sm sm:text-base ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`, variants: buttonVariants, whileHover: currentPage !== 1 ? "hover" : undefined, whileTap: currentPage !== 1 ? "tap" : undefined, children: "Previous" }), _jsxs("span", { className: "px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base", children: ["Page ", currentPage, " of ", totalPages] }), _jsx(motion.button, { onClick: () => handlePageChange(currentPage + 1), disabled: currentPage === totalPages, className: `px-3 sm:px-4 py-1 sm:py-2 rounded-md text-sm sm:text-base ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`, variants: buttonVariants, whileHover: currentPage !== totalPages ? "hover" : undefined, whileTap: currentPage !== totalPages ? "tap" : undefined, children: "Next" })] })), showModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { className: "bg-white rounded-lg p-4 sm:p-6 max-w-sm w-[90%] sm:w-full shadow-lg", variants: modalVariants, initial: "hidden", animate: "visible", children: [_jsx("h3", { className: "text-base sm:text-lg font-semibold text-gray-800 mb-2", children: "Join Private Room" }), _jsx("p", { className: "text-gray-600 mb-4 text-sm sm:text-base", children: "Enter the secret code to join this private room:" }), _jsx("input", { type: "text", value: modalSecretCode, onChange: (e) => setModalSecretCode(e.target.value), placeholder: "Enter secret code", className: "w-full p-2 border border-gray-300 rounded-md mb-4 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base" }), _jsxs("div", { className: "flex flex-col sm:flex-row justify-between gap-3", children: [_jsx(motion.button, { onClick: handleModalJoin, className: "flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition text-sm sm:text-base", variants: buttonVariants, whileHover: "hover", whileTap: "tap", children: "Join" }), _jsx(motion.button, { onClick: () => {
                                            setShowModal(false);
                                            setModalSecretCode('');
                                            setSelectedRoomId(null);
                                        }, className: "flex-1 bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition text-sm sm:text-base", variants: buttonVariants, whileHover: "hover", whileTap: "tap", children: "Cancel" })] })] }) }))] }) }));
};
export default ListRoom;

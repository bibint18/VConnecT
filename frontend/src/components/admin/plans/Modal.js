import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50", children: _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-lg w-1/2 relative", children: [_jsx("button", { onClick: onClose, className: "absolute top-2 right-2 text-gray-500", children: "\u2716" }), children] }) }));
};
export default Modal;

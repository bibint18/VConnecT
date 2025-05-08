import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Header from './Header';
import MainContent from './MainContent';
import EventCards from './Event-card';
import MainImage from './Event-cards';
import SubscriptionSection from './Subscription-banner';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
function HomePage() {
    const navigate = useNavigate();
    return (_jsxs("div", { className: "min-h-screen", children: [_jsx(Header, {}), _jsx(MainContent, {}), _jsxs("div", { className: "bg-black min-h-screen", children: [_jsx(EventCards, {}), _jsx("div", { className: "flex justify-center p-4", children: _jsx("button", { onClick: () => navigate('/rooms'), className: "bg-purple-600 text-white font-semibold py-2 px-6 rounded-full", children: "EXPLORE MORE" }) }), _jsx(MainImage, {}), _jsx(SubscriptionSection, {}), _jsx(Footer, {})] })] }));
}
export default HomePage;

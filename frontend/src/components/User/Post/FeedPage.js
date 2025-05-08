import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Footer from '../Header/Footer';
import Header from '../Header/Header';
import PostFeed from './PostFeed';
function FeedPage() {
    return (_jsxs("div", { className: "min-h-screen", children: [_jsx(Header, {}), _jsx(PostFeed, {}), _jsx(Footer, {})] }));
}
export default FeedPage;

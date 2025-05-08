import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Header from '../Header/Header';
import Footer from '../Header/Footer';
import UserTrivia from './UserTrivia';
function TriviaPage() {
    return (_jsxs("div", { className: "min-h-screen", children: [_jsx(Header, {}), _jsx(UserTrivia, {}), _jsx(Footer, {})] }));
}
export default TriviaPage;

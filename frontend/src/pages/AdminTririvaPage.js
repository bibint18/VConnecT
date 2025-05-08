import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Header from '../components/admin/header/Header';
import Sidebar from '../components/admin/sidebar/Sidebar';
import ListTrivia from '@/components/admin/Trivia/ListTrivia';
export default function AdminTriviaPage() {
    return (_jsxs("div", { className: "flex flex-col h-screen", children: [_jsx(Header, {}), _jsxs("div", { className: "flex flex-1 pt-16 ", children: [_jsx(Sidebar, {}), _jsx(ListTrivia, {})] })] }));
}

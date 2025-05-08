import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function Home() {
    const cookie = document.cookie;
    return (_jsxs("div", { children: [_jsx("h1", { style: { color: "black" }, children: "Home page" }), _jsx("p", { children: cookie })] }));
}
export default Home;

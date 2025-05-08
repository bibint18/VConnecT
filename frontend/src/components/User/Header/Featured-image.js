import { jsx as _jsx } from "react/jsx-runtime";
import image1 from '../../../assets/home2.png';
export default function FeaturedImage() {
    return (_jsx("div", { className: "my-8", children: _jsx("div", { className: "rounded-lg overflow-hidden", children: _jsx("img", { src: image1, alt: "Conference discussion", className: "w-full h-auto object-cover" }) }) }));
}

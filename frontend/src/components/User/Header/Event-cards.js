import { jsx as _jsx } from "react/jsx-runtime";
// import EventCard from "./Event-card"
// export default function EventCards() {
//   const events = [
//     {
//       id: 1,
//       title: "Let you go insane",
//       date: "Tuesday, 23rd January 2024",
//       venue: "Arcetto Bella",
//       price: "50 pounds",
//       location: "In this Room",
//     },
//     {
//       id: 2,
//       title: "Let you go insane",
//       date: "Tuesday, 23rd January 2024",
//       venue: "Arcetto Bella",
//       price: "50 pounds",
//       location: "In this Room",
//     },
//     {
//       id: 3,
//       title: "Let you go insane",
//       date: "Tuesday, 23rd January 2024",
//       venue: "Arcetto Bella",
//       price: "50 pounds",
//       location: "In this Room",
//     },
//     {
//       id: 4,
//       title: "Let you go insane",
//       date: "Tuesday, 23rd January 2024",
//       venue: "Arcetto Bella",
//       price: "50 pounds",
//       location: "In this Room",
//     },
//   ]
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//       {events.map((event) => (
//         <EventCard key={event.id} event={event} />
//       ))}
//     </div>
//   )
// }
// src/components/MainImage.jsx
const MainImage = () => {
    return (_jsx("div", { className: "flex justify-center p-4", children: _jsx("div", { className: "w-full max-w-4xl h-64 bg-gray-300 rounded-lg flex items-center justify-center", children: _jsx("p", { className: "text-white text-lg", children: "Main Conference Image Placeholder" }) }) }));
};
export default MainImage;

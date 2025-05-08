import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const EventCards = () => {
    const events = [
        {
            title: 'Let you go insane',
            date: 'Tuesday, 29th January 2024 - 22:00',
            description: '300 people are in this room consectetur. Sit massa et faucibus cursus integer aenean sed. Aliquet mi magna vive...',
        },
        {
            title: 'Let you go insane',
            date: 'Tuesday, 29th January 2024 - 22:00',
            description: '300 people are in this room consectetur. Sit massa et faucibus cursus integer aenean sed. Aliquet mi magna vive...',
        },
        {
            title: 'Let you go insane',
            date: 'Tuesday, 29th January 2024 - 22:00',
            description: '300 people are in this room consectetur. Sit massa et faucibus cursus integer aenean sed. Aliquet mi magna vive...',
        },
        {
            title: 'Let you go insane',
            date: 'Tuesday, 29th January 2024 - 22:00',
            description: '300 people are in this room consectetur. Sit massa et faucibus cursus integer aenean sed. Aliquet mi magna vive...',
        },
    ];
    return (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4", children: events.map((event, index) => (_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-4", children: [_jsx("div", { className: "w-full h-40 bg-gray-200 rounded-t-lg mb-4" }), _jsx("h3", { className: "text-lg font-bold", children: event.title }), _jsx("p", { className: "text-sm text-gray-500", children: event.date }), _jsx("p", { className: "text-sm text-gray-700 mt-2", children: event.description })] }, index))) }));
};
export default EventCards;

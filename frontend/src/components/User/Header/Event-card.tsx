// import { Share2, Heart } from "lucide-react"

// interface EventProps {
//   event: {
//     id: number
//     title: string
//     date: string
//     venue: string
//     price: string
//     location: string
//   }
// }

// export default function EventCard({ event }: EventProps) {
//   return (
//     <div className="rounded-lg overflow-hidden bg-black border border-gray-800">
//       <div className="relative">
//         <img src="/placeholder.svg?height=200&width=300" alt="Event" className="w-full h-40 object-cover" />
//         <div className="absolute top-2 right-2 flex space-x-1">
//           <button className="bg-black/70 p-1 rounded-full">
//             <Share2 className="w-4 h-4 text-white" />
//           </button>
//           <button className="bg-black/70 p-1 rounded-full">
//             <Heart className="w-4 h-4 text-white" />
//           </button>
//         </div>
//       </div>

//       <div className="p-4">
//         <h3 className="font-bold text-lg">{event.title}</h3>
//         <p className="text-xs text-gray-400">{event.date}</p>

//         <div className="mt-2">
//           <p className="font-semibold text-sm">{event.venue}</p>
//           <p className="text-xs text-gray-400">
//             {event.price} in {event.location}
//           </p>
//         </div>

//         <p className="mt-2 text-xs text-gray-400">
//           Lorem ipsum dolor sit amet consectetur. Sit massa et consequat. Sit massa et consequat. Adipiscing mi magna
//           vitae sed sed. Adipisci mi magna vitae...
//         </p>
//       </div>

//       <div className="px-4 pb-4">
//         <button className="w-full py-2 bg-[#6c2bd9] hover:bg-[#5a24b5] text-white rounded-md text-sm font-medium transition-colors">
//           Explore more
//         </button>
//       </div>
//     </div>
//   )
// }



// src/components/EventCards.jsx


const EventCards = () => {
  const events = [
    {
      title: 'Let you go insane',
      date: 'Tuesday, 29th January 2024 - 22:00',
      description:
        '300 people are in this room consectetur. Sit massa et faucibus cursus integer aenean sed. Aliquet mi magna vive...',
    },
    {
      title: 'Let you go insane',
      date: 'Tuesday, 29th January 2024 - 22:00',
      description:
        '300 people are in this room consectetur. Sit massa et faucibus cursus integer aenean sed. Aliquet mi magna vive...',
    },
    {
      title: 'Let you go insane',
      date: 'Tuesday, 29th January 2024 - 22:00',
      description:
        '300 people are in this room consectetur. Sit massa et faucibus cursus integer aenean sed. Aliquet mi magna vive...',
    },
    {
      title: 'Let you go insane',
      date: 'Tuesday, 29th January 2024 - 22:00',
      description:
        '300 people are in this room consectetur. Sit massa et faucibus cursus integer aenean sed. Aliquet mi magna vive...',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {events.map((event, index) => (
        <div key={index} className="bg-white rounded-lg shadow-lg p-4">
          <div className="w-full h-40 bg-gray-200 rounded-t-lg mb-4"></div>
          <h3 className="text-lg font-bold">{event.title}</h3>
          <p className="text-sm text-gray-500">{event.date}</p>
          <p className="text-sm text-gray-700 mt-2">{event.description}</p>
        </div>
      ))}
    </div>
  );
};

export default EventCards;
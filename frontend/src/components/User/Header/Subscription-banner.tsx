// export default function SubscriptionBanner() {
//   return (
//     <div className="relative rounded-lg overflow-hidden bg-[#6c2bd9] my-8">
//       <div className="absolute top-0 left-0 w-full h-full">
//         <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#8a4af3] opacity-30 -translate-x-1/2 translate-y-1/4"></div>
//         <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-[#8a4af3] opacity-30 translate-x-1/4 -translate-y-1/4"></div>
//       </div>

import { useNavigate } from "react-router-dom";

//       <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
//         <div className="text-center md:text-left mb-6 md:mb-0">
//           <p className="uppercase text-sm tracking-wider text-purple-200">START ROOM HOSTING NOW</p>
//           <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-3">Subscribe to premium now!</h2>
//           <p className="text-sm text-purple-200">Unlock room hosting and inviting</p>

//           <button className="mt-6 px-8 py-2 bg-[#8a4af3] hover:bg-[#7a3de3] text-white rounded-full text-sm font-medium transition-colors">
//             Subscribe
//           </button>
//         </div>

//         <div className="w-full md:w-auto">
//           <img
//             src="/placeholder.svg?height=300&width=300"
//             alt="Mobile app mockup"
//             className="w-full max-w-xs mx-auto md:mx-0 transform rotate-12"
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// src/components/SubscriptionSection.jsx


const SubscriptionSection = () => {
  const navigate = useNavigate()
  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-8 rounded-lg mx-4 my-8 flex flex-col md:flex-row items-center justify-between">
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold">START ROOM HOSTING NOW</h2>
        <h3 className="text-xl font-semibold mt-2">Subscribe to premium now!</h3>
        <p className="mt-2">Unlock room hosting and extra Benefits</p>
      </div>
      <button onClick={() => navigate('/user/plans')} className="bg-white text-purple-600 font-semibold py-2 px-6 rounded-full mt-4 md:mt-0">
        Subscribe
      </button>
    </div>
  );
};

export default SubscriptionSection;
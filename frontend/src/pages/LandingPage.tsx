// import EventCards from "../components/User/Home/Event-cards"
// import SubscriptionBanner from "../components/User/Home/Subscription-banner"
// import Footer from "../components/User/Home/Footer"
// import FeaturedImage from "../components/User/Home/Featured-image"

// export default function LandingPage() {
//   return (
//     <main className="min-h-screen bg-black text-white">
//       <div className="container mx-auto px-4 py-8">
//         <EventCards />
//         <FeaturedImage />
//         <SubscriptionBanner />
//       </div>
//       <Footer />
//     </main>
//   )
// }



// src/App.jsx

import EventCards from '../components/User/Header/Event-card';
import MainImage from '../components/User/Header/Event-cards';
import SubscriptionSection from '../components/User/Header/Subscription-banner';
import Footer from '../components/User/Header/Footer';

const LandingPage = () => {
  return (
    <div className="bg-black min-h-screen">
      <EventCards />
      <div className="flex justify-center p-4">
        <button className="bg-purple-600 text-white font-semibold py-2 px-6 rounded-full">
          EXPLORE MORE
        </button>
      </div>
      <MainImage />
      <SubscriptionSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
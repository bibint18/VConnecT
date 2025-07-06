
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

import Header from './Header'
import MainContent from './MainContent'
import EventCards from './Event-card'
import MainImage from './Event-cards'
import SubscriptionSection from './Subscription-banner'
import Footer from './Footer'
function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <MainContent />
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
    </div>
  )
}

export default HomePage


import one from '../../../assets/Vconnectroom1.png'
import two from '../../../assets/vconnectroom2.png'
import three from '../../../assets/vconnectroom3.png'
import four from '../../../assets/vconnectroom4.png'
const EventCards = () => {
  const events = [
    {
      title: 'ARTIFICIAL INTELLIGENCE' ,
      image:one,
      date: 'Tuesday, 23th January 2025 - 22:00',
      description:
        'Room for the AI related Talks.',
    },
    {
      title: 'CyberSecurity',
      image:two,
      date: 'Tuesday, 16th October 2025 - 05:00',
      description:
        'Room for the Cyber Security related Talks.',
    },
    {
      title: 'FULL STACK DEVELOPERS',
      image:three,
      date: 'Tuesday, 21th February 2025 - 09:00',
      description:
        'Room for the discussion of full stack developers.',
    },
    {
      title: 'VIBE HERE...',
      image:four,
      date: 'Tuesday, 15th August 2025 - 20:00',
      description:
        'A Room to chill with strangers.',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {events.map((event, index) => (
        <div key={index} className="bg-white rounded-lg shadow-lg p-4">
          <div className="w-full h-40 bg-gray-200 rounded-t-lg mb-4">
            <img
            src={event.image} // Replace with your image URL or local path
            alt={event.title}
            className="!w-full !h-40 !object-cover !rounded-t-lg !mb-4 !animate-fadeIn"
          />
          </div>
          <h3 className="text-lg font-bold">{event.title}</h3>
          <p className="text-sm text-gray-500">{event.date}</p>
          <p className="text-sm text-gray-700 mt-2">{event.description}</p>
        </div>
      ))}
    </div>
  );
};

export default EventCards;
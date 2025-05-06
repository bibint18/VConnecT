
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
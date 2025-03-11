import React from 'react';

const MainContent: React.FC = () => {
  return (
    <main className="bg-black text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center h-screen text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          CONNECT THE PEOPLE THROUGH <br />
          V<span className="text-purple-500">CONNECT</span>
        </h1>
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full text-lg hover:scale-105 transition">
          REGISTER
        </button>
      </section>

      {/* Make Memorable Moments Section */}
      <section className="flex flex-col md:flex-row items-center justify-center py-16 px-4">
        {/* Image Placeholder */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <div className="bg-gray-500 h-64 md:h-96 rounded-lg flex items-center justify-center">
            <span className="text-white">Image Placeholder</span>
          </div>
        </div>

        {/* Text and Stats */}
        <div className="w-full md:w-1/2 md:pl-8 text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Make Memorable Moments</h2>
          <p className="text-gray-400 mb-6">
            Aliquam vel platea curabitur sit vestibulum egetas sit id lorem. Aliquam
            neque, duis eget scelerisque. Non sit at venenatis tortor amet feugiat
            ullamcorper. Eros eu commodo cras vel lacinia turpis volutpat adipiscing.
            Sollicitudin erat bibendum cras nunc in.
          </p>
          <div className="flex justify-center md:justify-start space-x-4">
            <div className="bg-purple-600 p-4 rounded-lg">
              <p className="text-2xl font-bold">2K+</p>
              <p className="text-sm">Total Rooms Hosted</p>
            </div>
            <div className="bg-purple-600 p-4 rounded-lg">
              <p className="text-2xl font-bold">10K+</p>
              <p className="text-sm">Total Developers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Make Your Virtual Space Section */}
      <section className="bg-white text-black py-16 px-4 flex flex-col md:flex-row items-center justify-center">
        {/* Illustration Placeholder */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <div className="bg-gray-300 h-64 md:h-96 rounded-lg flex items-center justify-center">
            <span className="text-black">Illustration Placeholder</span>
          </div>
        </div>

        {/* Text and Button */}
        <div className="w-full md:w-1/2 md:pl-8 text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Make your virtual space</h2>
          <p className="text-gray-600 mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full text-lg hover:scale-105 transition">
            Create Room
          </button>
        </div>
      </section>
    </main>
  );
};

export default MainContent;
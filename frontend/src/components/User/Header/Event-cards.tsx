
import mainImage from '../../../assets/VconnectMainConferance.png'
const MainImage = () => {
  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-4xl h-64 bg-gray-300 rounded-lg flex items-center justify-center">
        <img
src={mainImage}
alt="Main Conference"
className="object-cover w-full h-full"
/>
      </div>
    </div>
  );
};

export default MainImage;
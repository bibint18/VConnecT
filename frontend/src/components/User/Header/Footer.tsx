import logo from '../../../assets/logovct1.png'
const Footer = () => {
  return (
    <footer className="bg-black text-white p-4 flex flex-col md:flex-row items-center justify-between">
      <div className="flex items-center">
        <img className="w-46 h-8 bg-gray-500  mr-2" src={logo}></img>
        
      </div>
      <p className="text-sm">© 2025 VconnecT, Inc. ALL rights reserved.</p>
      <div className="flex space-x-4 mt-4 md:mt-0">
        <a href="#" className="text-sm hover:underline">Terms</a>
        <a href="#" className="text-sm hover:underline">Privacy</a>
        <a href="#" className="text-sm hover:underline">Support</a>
      </div>
    </footer>
  );
};

export default Footer;
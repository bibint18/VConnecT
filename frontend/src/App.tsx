import { BrowserRouter as Router} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import {Toaster} from 'react-hot-toast'
import AppRoute from "./components/Routes/AppRoute";
function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <ToastContainer />  
      <AppRoute/>
    </Router>
  );
}

export default App;

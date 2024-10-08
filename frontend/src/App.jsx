import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Myprofile from "./components/core/Dashboard/Myprofile";
import { useDispatch, useSelector } from "react-redux";
import Error from "./pages/Error";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import Login from "./pages/Login"
import Privacy from "./pages/Privacy"
import { useNavigate } from 'react-router-dom';
import RelayPage from "./pages/RelayPage";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {

            localStorage.removeItem('token');

            navigate('/'); // Adjust the path as needed
        };

        performLogout();
    }, [navigate]);

    navigate("/");
};


function App() 
{
  const { token } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();

  useEffect(()=> {
    const setData = async() => {
      const decodedToken = await jwtDecode(token)
      if(decodedToken !== userData){
        setUserData(decodedToken)
        console.log(decodedToken);
        //dispatch(setUserReal(decodedToken))
      }
    }
    if(token){
      setData();
    }
  }, [token]);

  


  return (
    <div className="w-screen min-h-screen bg-pure-greys-5 flex flex-col font-inter">
      <Navbar/> 
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/privacy-policy" element={<Privacy/>} />
        <Route path="/relay" element={<RelayPage />} />
        <Route path="/dashboard" element={<PrivateRoute><Myprofile /></PrivateRoute>}/>
        <Route path="/logout"  element={<Logout/>}/>
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;

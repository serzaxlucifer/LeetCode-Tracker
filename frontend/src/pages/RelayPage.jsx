import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { setToken } from "../slices/authSlice";
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';

const RelayPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const getTokenFromUrl = () => {
      const urlParams = new URLSearchParams(location.search);
      return urlParams.get('token');
    };

    const token = getTokenFromUrl();

    if (token) {
      // Post the token back to the parent window
      Cookies.set('token', token, {
        expires: 7, 
        secure: true, 
        sameSite: 'Lax', 
      });
      dispatch(setToken(token));
      localStorage.setItem("token", token);
    } else {
      console.error('Token not found in URL!');
    }

    // Optionally navigate back to the homepage or any other page
  }, [location, navigate]);

  return (
    <div>
      <h1>Authentication Successful. You may close this window.</h1>
    </div>
  );
};

export default RelayPage;
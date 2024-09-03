import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { setToken } from "../slices/authSlice";
import { useDispatch } from 'react-redux';

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
      dispatch(setToken(token));
      localStorage.setItem("token", token);
    } else {
      console.error('Token not found in URL!');
    }

    // Optionally navigate back to the homepage or any other page
  }, [location, navigate]);

  return (
    <div>
      <p>Authentication Successful. You may close this window.</p>
    </div>
  );
};

export default RelayPage;
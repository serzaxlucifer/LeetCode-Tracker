import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const RelayPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const getTokenFromUrl = () => {
      const urlParams = new URLSearchParams(location.search);
      return urlParams.get('token');
    };

    const token = getTokenFromUrl();

    if (token) {
      // Post the token back to the parent window
      if (window.opener) {
        window.opener.postMessage({ token }, '*');
        // Close the popup window
        window.close();
      } else {
        console.error('No opener window found!');
      }
    } else {
      console.error('Token not found in URL!');
    }

    // Optionally navigate back to the homepage or any other page
  }, [location, navigate]);

  return (
    <div>
      <p>Authentication Successfull. You may close this window.</p>
    </div>
  );
};

export default RelayPage;
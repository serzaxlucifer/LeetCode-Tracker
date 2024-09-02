import { toast } from "react-hot-toast";
import { endpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import { setToken } from "../../slices/authSlice";
import { setUser } from "../../slices/profileSlice";

const { LOGIN_API } = endpoints;

export function login(navigate) {
  return async (dispatch) => {
    
    localStorage.removeItem("token");

    const authWindow = window.open(
      LOGIN_API, 
      '_blank', 
      'width=500,height=600'
    );

    const intervalDuration = 1000; // 1 second
    const timeoutDuration = 60000; // 15 seconds

    let elapsed = 0;
    const intervalId = setInterval(() => {

      let cookie = document.cookie.split('; ').find(row => row.startsWith('token='));
            if (cookie) {
                const cookieString = document.cookie;
                cookie = cookieString.split('; ').find(row => row.startsWith('token='));
                cookie = cookie.split('=')[1];
                console.log(cookie);
                clearInterval(intervalId);
                dispatch(setToken(cookie));
                localStorage.setItem("token", JSON.stringify(cookie));
                navigate("/dashboard");
                return;
            }

        elapsed += intervalDuration;

        if (elapsed >= timeoutDuration) {
            console.log('Timeout reached. Cookie not found.');
            clearInterval(intervalId);
            dispatch(logout(navigate));
        }
    }, intervalDuration);
  };
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    navigate("/");
  };
}

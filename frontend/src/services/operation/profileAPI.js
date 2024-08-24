import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { profileEndpoints } from "../apis";
import { setUser } from "../../slices/profileSlice";
import { logout } from "./authAPI";


export function getUser(token) {
  return async (dispatch) => {
    const { GET_USER_DETAILS_API } = profileEndpoints;
    const toastId = toast.loading("Loading...");
    let result = [];
    try {
      console.log(GET_USER_DETAILS_API);
      const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      });
      if (response.data.message !== "Success") {
        throw new Error(response.data.error);
      }
      result = response.data.data;
      //
      dispatch(setUser(result));
    } catch (err) {
      toast.error(err.response.data.message);
      toast.dismiss(toastId);
    }
    toast.dismiss(toastId);
  }
};


export function updateUser(token, data) {
  return async (dispatch) => {
    const { UPDATE_USER_DETAILS_API } = profileEndpoints;
    const toastId = toast.loading("Loading...");
    let result = [];
    console.log(data);
    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_USER_DETAILS_API,
        JSON.stringify(data),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data.message !== "Success") {
        throw new Error(response.data.error);
      }
      result = response.data.data;
      dispatch(setUser(result));
    } catch (err) {
      toast.error(err.response.data.message);
      toast.dismiss(toastId);
    }
    toast.dismiss(toastId);
    return result;
  };
}

export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const { DELETE_USER_DETAILS_API } = profileEndpoints;
    const toastId = toast.loading("Loading...");
    let result = [];
    try {
      const response = await apiConnector(
        "DELETE",
        DELETE_USER_DETAILS_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      logout(navigate);
    } catch (error) {
      toast.error(error.response.data.error);
      toast.dismiss(toastId);
    }
    toast.dismiss(toastId);
    return;
  };
}

export function changeSettings(token, dbVal) {
  return async (dispatch) => {
    const { DB_SWITCH_API } = profileEndpoints;
    const toastId = toast.loading("Loading...");
    let result = [];
    try {
      const response = await apiConnector(
        "PATCH",
        DB_SWITCH_API,
        JSON.stringify({ STORE_TO_DB: dbVal }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );
    } catch (error) {
      toast.error(error.response.data.error);
      toast.dismiss(toastId);
    }
    toast.dismiss(toastId);
    return;
  };
}
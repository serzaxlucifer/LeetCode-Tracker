import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { statisticsEndpoints } from "../apis";

const {
	GET_COMMUNITY_API,
	GET_MY_STATS_API,
	GET_MY_STATS_TOPIC_API
} = statisticsEndpoints;


export async function getMyStats(token) {
	const toastId = toast.loading("Loading...");
	let result = [];
	try {
	  const response = await apiConnector("GET", GET_MY_STATS_API, null, {
		Authorization: `Bearer ${token}`,
	  });

	  if (response.data.message !== "Success") {
		throw new Error(response.data.error);
	  }
	  result = response.data.data;

	} catch (err) {
	  toast.error(err.response.data.message);
	}
	toast.dismiss(toastId);
	return result;
}
  
export async function getMyStatsTopic(token, topic) {
	const toastId = toast.loading("Loading...");
	let result = [];
	try {
	  const response = await apiConnector("GET", GET_MY_STATS_TOPIC_API + `?topic=${topic}`, null, {
		Authorization: `Bearer ${token}`,
	  });

	  if (response.data.message !== "Success") {
		throw new Error(response.data.error);
	  }
	  result = response.data.data;

	} catch (err) {
	  toast.error(err.response.data.message);
	  toast.dismiss(toastId);
	}
	toast.dismiss(toastId);
	return result;
}
  
export async function getCommunity(token) {
	const toastId = toast.loading("Loading...");
	let result = [];
	try {
	  const response = await apiConnector("GET", GET_COMMUNITY_API, null, {
		Authorization: `Bearer ${token}`,
	  });

	  if (response.data.message !== "Success") {
		throw new Error(response.data.error);
	  }
	  result = response.data.data;

	} catch (err) {
	  toast.error(err.response.data.message);
	  toast.dismiss(toastId);
	}
	toast.dismiss(toastId);
	return result;
}
  
const BASE_URL = "http://localhost:5000";


// AUTH ENDPOINTS
export const endpoints = 
{
  LOGIN_API: BASE_URL + "/auth/google"
};

// PROFILE ENDPOINTS
export const profileEndpoints = 
{
  GET_USER_DETAILS_API: BASE_URL + "/dashboard/get-profile",
  UPDATE_USER_DETAILS_API: BASE_URL + "/dashboard/update-profile",
  DELETE_USER_DETAILS_API: BASE_URL + "/dashboard/delete-profile",
  DB_SWITCH_API: BASE_URL + "/dashboard/db-change"  
};


// STATISTICS ENDPOINTS
export const statisticsEndpoints = 
{
  GET_COMMUNITY_API: BASE_URL + "/dashboard/get-community",
  GET_MY_STATS_API: BASE_URL + "/dashboard/get-submissions",
  GET_MY_STATS_TOPIC_API: BASE_URL + "/dashboard/get-submissions-topic"
};
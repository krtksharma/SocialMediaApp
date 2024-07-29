import axios from "axios";
import {
  getItem,
  KEY_ACCESS_TOKEN,
  removeItem,
  setItem,
} from "./localStorageManager";
import store from "../redux/store";
import { setLoading, showToast } from "../redux/slice/appConfigSlice";
import { TOAST_FAILURE } from "../App";

export const axiosClient = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

axiosClient.interceptors.request.use((request) => {
  const accessToken = getItem(KEY_ACCESS_TOKEN);
  request.headers["Authorization"] = `Bearer ${accessToken}`;
  store.dispatch(setLoading(true));
  return request;
});

axiosClient.interceptors.response.use(async (response) => {
  store.dispatch(setLoading(false));

  const data = response.data;
  if (data.status === "ok") {
    return response;
  }
  const originalRequest = response.config;
  const statusCode = data.statusCode;
  const error = data.message;
  console.log("eror hogaya bhai ",error);
 store.dispatch(showToast(
  {
    type: TOAST_FAILURE,
    message: error,
  }
 ));
  

  if (statusCode === 401 && originalRequest.url === "/auth/refresh") {
    removeItem(KEY_ACCESS_TOKEN);
    window.location.replace("/login", "_self");
    console.log("inside 401 not refresh error ",error);
    return Promise.reject(error);
  }
  if (statusCode === 401 && originalRequest.url !== "/auth/refresh") {
    try {
      const response = await axiosClient.get("/auth/refresh");
      if (response.data.status === "ok") {
        setItem(KEY_ACCESS_TOKEN, response.data.result.acesstoken);
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${response.data.result.accessToken}`;
        return axios(originalRequest);
      }
      return response;
    } catch (error) {
      console.error(" encountered error during refresh ", error.message); // add settimeout to check if we delete cookies and localstorage and then login what will happen
      removeItem(KEY_ACCESS_TOKEN);
      window.location.replace("/login", "_self");
      console.log("inside 401  refresh error ",error);
      return Promise.reject(error);
    }
  }
  console.log("inside 500 not refresh not 401 error ",error);
  return Promise.reject(error);
},async (error) => {
  store.dispatch(setLoading(false));
  store.dispatch(showToast(
    {
      type: TOAST_FAILURE,
      message: error,
    }
    
   ));
   return Promise.reject(error);

});

import React, { useEffect, useRef } from "react";
import Login from "./pages/login/Login";
import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/signup/SignUp";
import Home from "./pages/home/Home";
import RequiredUser from "./components/RequiredUser";
import Feed from "./components/feed/Feed";
import Profile from "./components/profile/Profile";
import UpdateProfile from "./components/updateProfile/UpdateProfile";
import { useSelector } from "react-redux";
import LoadingBar from "react-top-loading-bar";
import OnlyLogin from "./components/OnlyLogin";
import toast, { Toaster } from "react-hot-toast";

export const TOAST_SUCCESS = "toast_success";
export const TOAST_FAILURE = "toast_failure";

const App = () => {
  const isLoading = useSelector((state) => state.appConfigReducer.isLoading);
  const loadRef = useRef(null);
  const toastData = useSelector((state) => state.appConfigReducer.toastData);

  useEffect(() => {
    if (isLoading) loadRef.current?.continuousStart();
    else loadRef.current?.complete();
  }, [isLoading]);

  useEffect(() => {
    switch (toastData.type) {
      case TOAST_SUCCESS:
        toast.success(toastData.message);
        break;
      case TOAST_FAILURE:
        toast.error(toastData.message);
        break;
    }
  }, [toastData]);

  return (
    <div>
      <LoadingBar color="#000" ref={loadRef} loaderSpeed={500} />
      <div>
        <Toaster />
      </div>
      <Routes>
        <Route element={<RequiredUser />}>
          <Route path="/" element={<Home />}>
            <Route path="/" element={<Feed />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/updateProfile" element={<UpdateProfile />} />
          </Route>
        </Route>
        <Route element={<OnlyLogin />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;

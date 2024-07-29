import React, { useEffect } from "react";
import "./Home.scss";
import Navbar from "../../components/navbar/Navbar";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getMyInfo } from "../../redux/slice/appConfigSlice";

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMyInfo());
  },[]);

  return (
    <>
      <Navbar />
      <div className="outlet-container" style={{ marginTop: "80px" }}>
        <Outlet />
      </div>
    </>
  );
};

export default Home;

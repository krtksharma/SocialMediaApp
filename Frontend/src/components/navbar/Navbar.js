import React from "react";
import "./Navbar.scss";
import Avatar from "../avatar/Avatar";
import { useNavigate } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import { useSelector } from "react-redux";
import { KEY_ACCESS_TOKEN, removeItem } from "../../utils/localStorageManager";
import { axiosClient } from "../../utils/axiosClient";
import tokomoko from "../../assets/TokoMoko.png";

const Navbar = () => {
  const navigate = useNavigate();
  const loadState = useSelector((state) => state.appConfigReducer.isLoading);
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);

  async function handleLogoutClicked() {
    try {
      console.log(loadState, "curr state");
      await axiosClient.get("/auth/logout");
      removeItem(KEY_ACCESS_TOKEN);
      navigate("/login");
    } catch (e) {}
  }
  return (
    <div className="navbar">
      <div className="container">
        <h2 className="navbar-header hover-link" onClick={() => navigate("/")}>
          <img src={tokomoko} />
        </h2>
        <div className="right-side">
          <div
            className="profile hover-link"
            onClick={() => navigate(`/profile/${myProfile._id}`)}
          >
            <Avatar src={myProfile?.avatar?.url} />
          </div>
          <div className="logout hover-link">
            <AiOutlineLogout onClick={() => handleLogoutClicked()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

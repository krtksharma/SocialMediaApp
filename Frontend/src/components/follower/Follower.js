import React, { useEffect, useState } from "react";
import "./Follower.scss";
import Avatar from "../avatar/Avatar";
import { useDispatch, useSelector } from "react-redux";
import {
  followAndUnfollowUser,
} from "../../redux/slice/feedSlice";

const Follower = ({ user }) => {
  const feedData = useSelector((state) => state.feedReducer.feedData);
  const [isFollowing, setIsFollowing] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsFollowing(feedData.followings.find((item) => item._id === user._id));
  }, [feedData, dispatch]);

  const handleFollower = () => {
    dispatch(followAndUnfollowUser({ userIdToFollow: user._id }));
  };
  return (
    <div className="Follower">
      <div className="user-info">
        <Avatar src={user?.avatar?.url} />
        <h4 className="name">{user?.name}</h4>
      </div>
      <h5
        className={isFollowing ? "hover-link follow-link" : "btn-primary"}
        onClick={handleFollower}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </h5>
    </div>
  );
};

export default Follower;

import React from "react";
import "./Post.scss";
import Avatar from "../avatar/Avatar";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { likeAndUnlikePosts } from "../../redux/slice/postSlice";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../redux/slice/appConfigSlice";
import {  TOAST_SUCCESS } from "../../App";

const Post = ({post}) => {
  const dispatch = useDispatch();

  const handlePostLike = async () => {
    dispatch(likeAndUnlikePosts({
      PostId : post._id,
    }))
    dispatch(showToast({
      type : TOAST_SUCCESS,
      message : "Post liked successfully!",
    }))
  }
  const navigate = useNavigate();
  return (
    <div className="Post">
      <div className="profile-container" onClick={() => navigate(`/profile/${post.owner._id}`)}>
        <Avatar src={post.owner.avatar.url}/>
        <h4>{post.owner.name}</h4>
      </div>
      <div className="content">
        <img src={post?.image?.url} className="image" alt="content-image" />
      </div>
      <div className="footer">
        <div className="like" onClick={handlePostLike}>
          {post.isLiked ? <AiFillHeart className="icon" style={{color:"red"}}/> : <AiOutlineHeart className="icon" />}
          <h4>{post.likesCount} Likes</h4>
        </div>
        <p className="caption">{post.caption}</p>
        <h5 className="time-ago">{post?.timeAgo}</h5>
      </div>
    </div>
  );
};

export default Post;

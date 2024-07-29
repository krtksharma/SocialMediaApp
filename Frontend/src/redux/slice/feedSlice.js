import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import { likeAndUnlikePosts } from "./postSlice";

export const getFeedData = createAsyncThunk(
  "user/getFeedData",
  async () => {
    try {
      const res = await axiosClient.get("/users/getFeedData");
      return res.data.result;
    } catch (e) {
      return Promise.reject(e);
    } 
  }
);

export const followAndUnfollowUser = createAsyncThunk(
    "user/followAndUnfollowUser",
    async (body) => {
      try {
        const res = await axiosClient.post("/users/follow",body);
        console.log("feed data: ", res.data.result);
        return res.data.result;
      } catch (e) {
        return Promise.reject(e);
      } 
    }
  );

const feedData = createSlice({
  name: "feedData",
  initialState: {
    feedData: {},
  },
  extraReducers: (builder) => {
    builder.addCase(getFeedData.fulfilled, (state, action) => {
      state.feedData = action.payload;
    }).addCase(likeAndUnlikePosts.fulfilled, (state, action) =>{
        const post = action.payload;
        const postIndex = state?.feedData?.posts?.findIndex(
          (p) => p._id === post._id
        );
        if(postIndex !== undefined && postIndex !== -1)
        {
            state.feedData.posts[postIndex] = post;
        }
    }).addCase(followAndUnfollowUser.fulfilled, (state, action) =>{
        const user = action.payload.user;
        const userIdIndex = state?.feedData?.followings?.findIndex(
          (u) => u._id === user._id
        );
        if(userIdIndex!== undefined && userIdIndex!== -1)
        {
            state.feedData.followings.splice(userIdIndex,1);
        }
        else{
            state.feedData.followings.push(user);
        }
    });
  },
});

export default feedData.reducer;

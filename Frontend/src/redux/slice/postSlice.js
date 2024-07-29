import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";

export const getUserProfile = createAsyncThunk(
  "user/getUserProfile",
  async (data) => {
    try {
      const res = await axiosClient.post("/users/getUserProfile", data);
      console.log("userProfile: ", res.data.result);
      return res.data.result;
    } catch (e) {
      return Promise.reject(e);
    }
  }
);

export const likeAndUnlikePosts = createAsyncThunk(
  "posts/likeUnlike",
  async (data) => {
    try {
      const res = await axiosClient.post("posts/likeAndUnlike", data);
      console.log("userProfile: ", res.data.result.post);
      return res.data.result.post;
    } catch (e) {
      console.log("userProfile: error: ", e);
      return Promise.reject(e);
    } 
  }
);

const postSlice = createSlice({
  name: "postSlice",
  initialState: {
    userProfile: {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload;
      })
      .addCase(likeAndUnlikePosts.fulfilled, (state, action) => {
        const post = action.payload;
        const postIndex = state?.userProfile?.posts?.findIndex(
          (p) => p._id === post._id
        );
        if (postIndex !== undefined && postIndex !== -1) {
          state.userProfile.posts[postIndex] = post;
        }
      });
  },
});

export default postSlice.reducer;

const Post = require("../models/postModel");
const User = require("../models/userModel");
const { success, failure: error } = require("../utils/responseStatus");
const mapPostToOutput = require("../utils/utils");
const cloudinary = require("cloudinary").v2;
const postMap = require("../utils/utils");

const followOrUnfollowUser = async (req, res) => {
  try {
    const { userIdToFollow } = req.body;
    const loggedInUser = req.id;

    const userToFollow = await User.findById(userIdToFollow);
    const currUser = await User.findById(loggedInUser);
    if (!userToFollow) {
      return res.status(404).json(error(404, "User not found"));
    }

    if (userIdToFollow === loggedInUser) {
      return res.status(409).json(error(409, "You can't follow yourself"));
    }

    if (currUser.followings.includes(userIdToFollow)) {
      console.log("inside ddd");

      const userIndex = currUser.followings.indexOf(userIdToFollow);
      currUser.followings.splice(userIndex, 1);

      const currUserIndex = userToFollow.followers.indexOf(loggedInUser);
      userToFollow.followers.splice(currUserIndex, 1);
    } else {
      currUser.followings.push(userToFollow);
      userToFollow.followers.push(currUser);
      
    }
    await currUser.save();
    await userToFollow.save();
    return res.send(success(200, {user : userToFollow}));
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};

const getFeedData = async (req, res) => {
  try {
    const currUser = await User.findById(req.id).populate("followings");

    const fullPosts = await Post.find({
      owner: { $in: currUser.followings },
    }).populate("owner");

    const posts = fullPosts.map((post) => postMap(post, req.id)).reverse();
    const followings = currUser.followings.map((user) => user._id);
    const suggestion = await User.find({
      _id: {
        $nin: followings,
        $ne: req.id,
      },
    });

    return res.send(
      success(200, {
        ...currUser._doc,
        suggestion,
        posts,
      })
    );
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};

const getCurrentUserPosts = async (req, res) => {
  try {
    const currUser = await User.findById(req.id);
    const posts = await Post.find({
      owner: currUser,
    }).populate("likes");
    return res.send(
      success(200, {
        currUser,
        posts,
      })
    );
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};
const getUsersPostsById = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.send(error(400, "UserId is required"));
    const currUser = await User.findById(userId);
    const posts = await Post.find({
      owner: currUser,
    }).populate("likes");
    return res.send(
      success(200, {
        currUser,
        posts,
      })
    );
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};

const removeCurrentUser = async (req, res) => {
  try {
    const userId = req.id;

    const currUser = await User.findById(userId);
    if (!currUser) return res.send(error(400, "User Not Found"));

    await Post.deleteMany({ owner: userId });

    // Remove the current user from followers' followings array
    for (const followerId of currUser.followers) {
      const follower = await User.findById(followerId);
      if (follower) {
        const userIndex = follower.followings.indexOf(userId);
        if (userIndex !== -1) {
          follower.followings.splice(userIndex, 1);
          await follower.save();
        }
      }
    }

    // Remove the current user from followings' followers array
    for (const followingId of currUser.followings) {
      const following = await User.findById(followingId);
      if (following) {
        const userIndex = following.followers.indexOf(userId);
        if (userIndex !== -1) {
          following.followers.splice(userIndex, 1);
          await following.save();
        }
      }
    }

    // Remove the current user from all posts' likes array
    const allPosts = await Post.find();
    for (const post of allPosts) {
      const likeIndex = post.likes.indexOf(userId);
      if (likeIndex !== -1) {
        post.likes.splice(likeIndex, 1);
        await post.save();
      }
    }

    // Finally, remove the current user
    await User.findByIdAndDelete(userId);

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });

    return res.send(
      success(204, {
        message: "User deleted successfully",
        deletedUser: currUser,
      })
    );
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};

const getMyInfo = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    return res.send(
      success(200, {
        User: user,
      })
    );
  } catch (e) {
    res.send(error(500, e.message));
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.id;
    const { name, bio, userImg } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.send(error(404, "User not found"));

    if (name) {
      user.name = name;
    }
    if (bio) {
      user.bio = bio;
    }
    if (userImg) {
      const uploadImg = await cloudinary.uploader.upload(userImg, {
        folder: "profileImg",
      });
      user.avatar = {
        public_id: uploadImg.public_id,
        url: uploadImg.secure_url,
      };
    }
    await user.save();
    return res.send(success(200, { User: user }));
  } catch (e) {
    return res.send(error(500, { mssg: e.message }));
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).populate({
      path: "posts",
      populate: { path: "owner" },
    });

    const fullPost = user.posts;
    console.log("Fullposts are ", fullPost);

    const posts = fullPost.map((post) => postMap(post, req.id)).reverse();
    console.log("posts are ", posts);
    return res.send(success(200, { ...user._doc, posts }));
  } catch (e) {
    return res.send(error(500, { mssg: e.message }));
  }
};

module.exports = {
  followOrUnfollowUser,
  getFeedData,
  getCurrentUserPosts,
  getUsersPostsById,
  removeCurrentUser,
  getMyInfo,
  updateUser,
  getUserProfile,
};

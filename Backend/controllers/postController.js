const { success, failure: error } = require("../utils/responseStatus");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const mapPostToOutput = require("../utils/utils");
const cloudinary = require("cloudinary").v2;

// const getAllPosts = async function (req, res) {
//   try {
//     return res.json(success(200, req.id));
//   } catch (e) {
//     return res.json(error(404, "error to fetch all posts"));
//   }
// };

const createPost = async function (req, res) {
  try {
    const { caption, postImg } = req.body;

    if (!caption || !postImg) {
      return res.send(error(400, "Caption and postImg are required"));
    }
    const cloudImg = await cloudinary.uploader.upload(postImg, {
      folder: "postImg",
    });

    const owner = req.id;

    const user = await User.findById(req.id);

    const post = await Post.create({
      owner,
      caption,
      image: {
        publicId: cloudImg.public_id,
        url: cloudImg.url,
      },
    });

    user.posts.push(post._id);
    await user.save();

    console.log("user", user);
    console.log("post", post);

    return res.json(success(200, { post }));
  } catch (e) {
    return res.json(error(500, e.message));
  }
};

const likeAndUnlikePosts = async function (req, res) {
  try {
    const { PostId } = req.body;
    const owner = req.id;

    const post = await Post.findById(PostId).populate('owner');

    if (!post) {
      return res.json(error(404, "Post not found"));
    }

    if (post.likes.includes(owner)) {
      const userIndex = post.likes.indexOf(owner);
      post.likes.splice(userIndex, 1);
      await post.save();
    } else post.likes.push(owner);
    await post.save();
    return res.json(success(200, {post : mapPostToOutput(post, req.id)}));
  } catch (e) {
    return res.json(error(500, e.message));
  }
};

const updatePost = async function (req, res) {
  try {
    const { PostId, caption } = req.body;
    const owner = req.id;

    const post = await Post.findById(PostId);

    if (!post) {
      return res.json(error(404, "Post not found"));
    }

    if (post.owner.toString() !== owner) {
      return res.json(error(403, "You are not allowed to update this post"));
    }

    post.caption = caption;
    await post.save();
    return res.json(
      success(201, {
        message: "Post updated successfully",
        updatedPost: post,
      })
    );
  } catch (e) {
    return res.json(error(500, e.message));
  }
};

const deletePost = async function (req, res) {
  try {
    const { PostId } = req.body;
    const owner = req.id;
    const post = await Post.findById(PostId);
    if (!post) {
      return res.json(error(404, "Post not found"));
    }
    if (post.owner.toString() !== owner) {
      return res.json(error(403, "You are not allowed to delete this post"));
    }
    await Post.findByIdAndDelete(PostId);
    const currUser = await User.findById(owner);
    const postIndex = currUser.posts.indexOf(post);
    currUser.posts.splice(postIndex, 1);
    await currUser.save();

    return res.json(
      success(200, {
        message: "Post deleted successfully",
        deletedPost: post,
        allPost: currUser.posts,
      })
    );
  } catch (e) {
    return res.json(error(500, e.message));
  }
};

module.exports = {
  updatePost,
  deletePost,
  createPost,
  likeAndUnlikePosts,
};

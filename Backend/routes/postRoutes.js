const postController = require("../controllers/postController");
const {authChecker} = require("../middleware/authMiddleware");
const router = require("express").Router();

// router.get('/getAllPosts',authChecker,postController.getAllPosts);
router.post('/',authChecker,postController.createPost);
router.put('/',authChecker,postController.updatePost);
router.post('/likeAndUnlike',authChecker,postController.likeAndUnlikePosts);
router.delete('/',authChecker,postController.deletePost);

module.exports = router;

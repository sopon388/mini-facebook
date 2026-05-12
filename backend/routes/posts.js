const router = require('express').Router();
const mongoose = require('mongoose');
const Post = require('../models/Post');


// 🔥 CREATE POST
router.post('/', async (req, res) => {
  try {

    // ✅ check valid user id
    if (!mongoose.Types.ObjectId.isValid(req.body.userId)) {
      return res.status(400).json({
        error: "Invalid user id"
      });
    }

    const post = new Post({
      userId: req.body.userId,

      userName: req.body.userName,

      text: req.body.text || '',

      image: req.body.image || null,

      video: req.body.video || null,

      profilePic: req.body.profilePic || null
    });

    await post.save();

    // ✅ populate user info
    const populatedPost = await Post.findById(post._id)
      .populate('userId', 'firstName surname email');

    res.json(populatedPost);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Post failed"
    });
  }
});


// 🔥 GET ALL POSTS
router.get('/', async (req, res) => {
  try {

    const posts = await Post.find()

      // ✅ connect user data
      .populate('userId', 'firstName surname email')

      // ✅ newest first
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (err) {
    console.log(err);

    res.status(500).send("Error fetching posts");
  }
});


// 👍 LIKE POST
router.post('/like/:id', async (req, res) => {
  try {

    const updated = await Post.findByIdAndUpdate(
      req.params.id,

      {
        $inc: { likes: 1 }
      },

      {
        new: true
      }
    );

    if (!updated) {
      return res.status(404).send("Post not found");
    }

    res.json(updated);

  } catch (err) {
    console.log(err);

    res.status(500).send("Like failed");
  }
});


// 💬 COMMENT POST
router.post('/comment/:id', async (req, res) => {
  try {

    if (!req.body.text) {
      return res.status(400).send("Comment required");
    }

    const updated = await Post.findByIdAndUpdate(
      req.params.id,

      {
        $push: {
          comments: {
            text: req.body.text
          }
        }
      },

      {
        new: true
      }
    );

    if (!updated) {
      return res.status(404).send("Post not found");
    }

    res.json(updated);

  } catch (err) {
    console.log(err);

    res.status(500).send("Comment failed");
  }
});


// 🔥 DELETE POST
router.delete('/:id', async (req, res) => {
  try {

    const deleted = await Post.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).send("Post not found");
    }

    res.send("Deleted successfully");

  } catch (err) {
    console.log(err);

    res.status(500).send("Delete failed");
  }
});


module.exports = router;
const router = require('express').Router();

const FriendRequest = require('../models/FriendRequest');

const User = require('../models/User');


// 🔥 SEND REQUEST (with duplicate check)
router.post('/send', async (req, res) => {

  const { from, to } = req.body;

  // 🔥 check duplicate both side
  const exist = await FriendRequest.findOne({

    $or: [
      { from, to },
      { from: to, to: from }
    ],

    status: 'pending'
  });

  if (exist) {

    return res.json({
      message: "Already sent"
    });
  }

  const reqq = new FriendRequest({

    from,
    to,
    status: 'pending'
  });

  await reqq.save();

  res.json(reqq);
});


// 🔥 NOTIFICATIONS
router.get('/notifications/:id', async (req, res) => {

  const data = await FriendRequest.find({

    to: req.params.id,

    status: 'pending'
  });

  res.json(data);
});


// 🔥 ACCEPT REQUEST
router.post('/accept', async (req, res) => {

  const request = await FriendRequest.findByIdAndUpdate(

    req.body.id,

    {
      status: 'accepted'
    },

    {
      new: true
    }
  );

  res.json(request);
});


// 🔥 REMOVE FRIEND
router.post('/remove', async (req, res) => {

  try {

    await FriendRequest.findOneAndDelete({

      $or: [

        {
          from: req.body.from,
          to: req.body.to
        },

        {
          from: req.body.to,
          to: req.body.from
        }
      ],

      status: 'accepted'
    });

    res.send("Removed");

  } catch (err) {

    res.status(500).send("Remove failed");
  }
});


// 🔥 GET FRIEND LIST
router.get('/list/:id', async (req, res) => {

  try {

    const id = req.params.id;

    const friends = await FriendRequest.find({

      $or: [

        {
          from: id,
          status: 'accepted'
        },

        {
          to: id,
          status: 'accepted'
        }
      ]
    });

    const result = [];

    for (let f of friends) {

      // 🔥 actual friend id
      const friendId =
        f.from === id
          ? f.to
          : f.from;

      // 🔥 get user data
      const user = await User.findById(friendId);

      if (user) {

        result.push({

          _id: user._id,

          firstName: user.firstName,

          surname: user.surname
        });
      }
    }

    res.json(result);

  } catch (err) {

    console.log(err);

    res.status(500).send("Friend list failed");
  }
});


module.exports = router;
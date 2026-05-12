const router = require('express').Router();
const Message = require('../models/Message');


// 🔥 SAVE MESSAGE
router.post('/', async (req, res) => {

  try {

    const msg = new Message({
      sender: req.body.sender,
      receiver: req.body.receiver,
      text: req.body.text
    });

    await msg.save();

    res.json(msg);

  } catch (err) {
    console.log(err);
    res.status(500).send("Message failed");
  }
});


// 🔥 GET CHAT
router.get('/:sender/:receiver', async (req, res) => {

  try {

    const messages = await Message.find({

      $or: [

        {
          sender: req.params.sender,
          receiver: req.params.receiver
        },

        {
          sender: req.params.receiver,
          receiver: req.params.sender
        }
      ]

    }).sort({ createdAt: 1 });

    res.json(messages);

  } catch (err) {

    console.log(err);
    res.status(500).send("Fetch failed");
  }
});

module.exports = router;
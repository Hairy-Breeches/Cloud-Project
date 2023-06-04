const express = require('express');
const Post = require("../models/posts");
const multer = require('multer');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype]
    let error = new Error('Invalid mime-type!');

    if(isValid) {
      error = null;
    }

    cb(error, 'backend/images');

  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];

    cb(null, fileName + '-' + Date.now() + '.' + ext);

  }
});

const router = express.Router();


router.post("", multer({storage: storage}).single('image'), (req, res) => {
  const url = req.protocol + "://" + req.get('host');
  console.log('host: ', req.get('host'));

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename
  });

  post.save().then(post => {
    res.status(200).json({
      message: "successful posting!",
      post: {
        id: post._id,
        title: post.title,
        content: post.content,
        imagePath: post.imagePath
      },
    });
  });
});

router.get("", (req, res) => {
  Post.find().then((documents) => {
    res.status(200).json({
      message: "Response from the server!",
      posts: documents,
    });
  });

router.get("/:id", (req, res) => {
  Post.findById(req.params.id).then((document) => {
    res.status(200).json({
      message: "successfully fetched the post by ID!",
      post: {
        id: document._id,
        title: document.title,
        content: document.content,
        imagePath: document.imagePath
      },
    });

  });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  Post.deleteOne({ _id: id }).then((result) => {
    res.status(200).json({ message: "post deleted!" });
  });
});

router.put("/:id", multer({storage: storage}).single('image'), (req, res) => {
  let imagePath = req.body.imagePath;

  if(req.file) {
    const url = req.protocol + "://" + req.get('host');
    imagePath = url + '/images/' + req.file.filename;

  }

  const currentPost = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });

  currentPost._id = req.params.id;

  Post.updateOne({ _id: req.params.id }, currentPost).then((response) => {
    res.status(200).json({
      message: 'Successfully edited the post!'
    }
    );
  });
});
});


module.exports = router

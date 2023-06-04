const Post = require("../models/posts");

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get('host');

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
};

exports.updatePost = (req, res, next) => {
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
};

exports.getPost = (req, res, next) => {
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
};

exports.deletePost = (req, res, next) => {
  const id = req.params.id;

  Post.deleteOne({ _id: id }).then((result) => {
    res.status(200).json({ message: "post deleted!" });
  });
};

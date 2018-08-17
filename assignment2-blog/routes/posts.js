const { validationResult } = require('express-validator/check');

module.exports = {
  // send all the posts to the client
  getPosts(req, res) {
    let post = req.store.posts
    // check if the post exist.
    if (post==null) return res.status(404).send("post not found")
  	res.status(200).send(req.store.posts)
  },
  // add a post to server and sends back the postId to the client as success
  addPost(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }   
    if(!req.body.name || !req.body.url || !req.body.text || !req.body.comments) return res.sendStatus(400)

    let obj={
        name: req.body.name,
        url: req.body.url,
        text: req.body.text,
        comments: req.body.comments
    }
    let posts = req.store.posts
    postId = posts.length
    posts.push(obj)
    res.status(201).send({postId: postId})
  },
  // update a post
  updatePost(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }   
    let post = req.store.posts[req.params.postId]
    // check if the post exist.
    if (post==null) return res.status(404).send("post not found")
  	updatedPost = req.body
    req.store.posts[req.params.postId] = updatedPost
    res.status(200).send(req.store.posts[req.params.postId])
  },
  // remove a post
  removePost(req, res) {
    let post = req.store.posts[req.params.postId]
    // check if the post exist.
    if (post==null) return res.status(404).send("post not found")
  	req.store.posts.splice(req.params.postId,1)
  	res.status(204).send()
  }
}

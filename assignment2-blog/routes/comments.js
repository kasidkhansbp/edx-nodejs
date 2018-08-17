const { validationResult } = require('express-validator/check');

module.exports = {
	// send all the comments of a particular post to client
	getComments(req, res) {
		let comments = req.store.posts[req.params.postId].comments
		// check if comment exist
		if(comments==null) return res.status(404).send("comments not found")
		res.status(200).send(req.store.posts[req.params.postId].comments)
	}, 
	// add a comment to a post
	addComment(req, res) {
		const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }   
		if(!req.body.text) return res.status(400)
        let obj={
        text: req.body.text
      }
        let post = req.store.posts[req.params.postId]
        // check if the post exist.
        if (post==null) return res.status(404).send("post not found")
        let comments = req.store.posts[req.params.postId].comments
	    let commentId = comments.length
	    comments.push(obj)
	    res.status(201).send({commentId: commentId})
	},
	// update a comment in a post
	updateComment(req, res) {
		const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }
        let comment = req.store.posts[req.params.postId].comments[req.params.commentId]
		// check if comment exist
		if(comment==null) return res.status(404).send("comment not found")
		let updateComment = req.body
		req.store.posts[req.params.postId].comments[req.params.commentId]=updateComment
		res.status(200).send(req.store.posts[req.params.postId].comments[req.params.commentId])
	},
	// remove a comment in a post
	removeComment(req, res) {
		let comment = req.store.posts[req.params.postId].comments[req.params.commentId]
		// check if comment exist
		if(comment==null) return res.status(404).send("comment not found")
		req.store.posts[req.params.postId].comments.splice(req.params.customerId,1)
		res.status(204).send()
	}  
}
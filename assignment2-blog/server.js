const routes = require('./routes')
const express = require('express') 
const logger = require('morgan')
const errorhandler = require('errorhandler')
const bodyParser = require('body-parser')

// format in which posts and comments are to be stored in computer memory
let store = {
  posts: [
    {name: 'Top 10 ES6 Features every Web Developer must know',
    url: 'https://webapplog.com/es6',
    text: 'This essay will give you a quick introduction to ES6. If you donâ€™t know what is ES6, itâ€™s a new JavaScript implementation.',
    comments: [
      {text: 'Cruelâ€¦..var { house, mouse} = No type optimization at all'},
      {text: 'I think youâ€™re undervaluing the benefit of â€˜letâ€™ and â€˜constâ€™.'},
      {text: '(p1,p2)=>{ â€¦ } ,i understand this ,thank you !'} 
    ]
  }
]
}

// A variable to hold express object
let app = express()
// Express app to use body-parser and extract the entire body portion of an incoming request stream and exposes it on req.body
app.use(bodyParser.json())
// Express app to use Morgan as a helper to collect logs from the server.
// And 'dev' as a parameter helps to produce colored status response
app.use(logger('dev'))

// comments.js and posts.js file need the variable store to perform actions. Below middleware helps to put the store variable in 
// req so that it can be accessed in comments.js and posts.js files.
app.use((req,res,next)=>{
	req.store=store
	next()
})

// API to get all the posts
app.get('/posts',routes.posts.getPosts)
// API to push a post 
app.post('/posts',routes.posts.addPost)
// API to modify a post identified by its postId
app.put('/posts/:postId',routes.posts.updatePost)
// API to delete a post identified by its postId
app.delete('/posts/:postId',routes.posts.removePost)

// API to get all the comments for a post identified by its postId
app.get('/posts/:postId/comments',routes.comments.getComments) 
// API to push a comment on a post identified by its postId 
app.post('/posts/:postId/comments',routes.comments.addComment) 
// API to modify any comment on a post identified by its postId
app.put('/posts/:postId/comments/:commentId',routes.comments.updateComment) 
// API to delete any comment identified by its commentId under a post identified by its postId
app.delete('/posts/:postId/comments/:commentId',routes.comments.removeComment)

// express app listening to port number 3000
app.listen(3000)
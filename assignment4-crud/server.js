const logger = require('morgan')
const errorHandler =require('errorhandler')
const bodyParser = require('body-parser')
const express = require('express')
const { validationResult } = require('express-validator/check');

var mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/edx-course-db')

// declare a Schema
var Schema = mongoose.Schema

// create a schema for accounts
const accountsSchema = new Schema (
	{name: String,
	 balance: Number
	})

// create a model which uses the Schema
var Account = mongoose.model('Account',accountsSchema)

let app = express()
app.use(logger('dev'))
app.use(bodyParser.json())

// API to get all the accounts
app.get('/accounts',(req,res)=>{
   Account.find({},(error,accounts)=>{
   	 if (error) {
   	 	console.log('error: '+error)
   	 	process.exit(1)
   	   }
   	   res.status(200).send(accounts)
   })
}) 

//API to create a new account
app.post('/accounts',(req,res)=>{
  //validate the request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }   
  if(!req.body.name || !req.body.balance) return res.sendStatus(400)
    // create a new account
    let account= new Account({
        name: req.body.name,
        balance: req.body.balance
    })
    //saves the account
  account.save((error)=> {
    	if (error) throw error
      res.status(201).send('Account created!')
    })
    
}) 

// API to update the account
app.put('/accounts/:id',(req,res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        } 
  //find the account by ID
  Account.findById(req.params.id,(error,account)=> {
    if(error) {
      console.log('error: '+error)
      process.exit(1)
    }
    // check if the post exist.
  if (account==null) return res.status(404).send("account not found")
    // update the change
    account.name = req.body.name
    account.balance = req.body.balance

    //save the function
    account.save((error)=> {
      if(error) {
      console.log('error: '+error)
      process.exit(1)
    }
    res.status(200).send('Updated successfully')
    })
  })  

}) 

//API to delete the account
app.delete('/accounts/:id',(req,res)=>{
  //find the account by ID
  Account.findById(req.params.id,(error,account)=> {
    if(error) {
      console.log('error: '+error)
      process.exit(1)
    }
  // check if the post exist.
  if (account==null) return res.status(404).send("account not found")
  // Delete the account
  account.remove((error)=> {
    if (error) {
      console.log('error: '+error)
      process.exit(1)
    }
    res.status(204).send()
  })
  })
}) 

//listening to port 3000
app.listen(3000,function() {
  console.log('listening to port 3000')
})
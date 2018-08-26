const express = require('express')
const logger = require('morgan')
const errorhandler = require('errorhandler')
const mongodb = require('mongodb')
const bodyParser = require('body-parser')
const customers = require('./m3-customer-data.json')
const customerAddressData = require('./m3-customer-address-data.json')
const url = 'mongodb://localhost:27017/edx-course-db'
const async = require('async')

let app = express()
app.use(logger('dev'))
app.use(bodyParser.json())

let tasks=[]

const limit = parseInt(process.argv[2]) || 1000

mongodb.MongoClient.connect(url,(error,db)=>{
  console.log('enter mongdb connect')
  if(error) {
    console.log('error: '+error)
    return process.exit(1)
  }
  customers.forEach((customer,index,list)=> {
    customers[index]=Object.assign(customer,customerAddressData[index])
    
    if (index%limit==0) {
      const start = index
      const end = (start+limit > customer.length) ? customer.length-1 : start+limit
      tasks.push((done)=> {
        console.log(`Processing ${start}-${end} out of ${customers.length}`)
        db.collection('customers').insert(customers.slice(start,end),(error,results)=> {
          done(error,results)
        })
      })
    }
})
console.log('launching ${tasks.length} parallel tasks')
async.parallel(tasks, (error, results) => {
  if (error) console.error(error)
  db.close()
   })
})

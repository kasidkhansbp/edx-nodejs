const csvtojson = require('csvtojson');
const fs = require('fs');
const csvFilePath = './customer-dataTest.csv'

csvtojson()
 .fromFile(csvFilePath)
 .then((jsonObj)=>{
 	fs.writeFile('customer-dataTest.json',JSON.stringify(jsonObj,null,4),(err)=> {
 	 if(err) {
 		console.log(err)
 		return
 	};
 	console.log('conversion completed successfully')
 })
})
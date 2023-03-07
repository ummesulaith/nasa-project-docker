const mongoose = require('mongoose')
const MONGO_URL = 'mongodb+srv://nasa-api:OYjp9XPtWGOV7VkX@nasacluster.6tozxe7.mongodb.net/?retryWrites=true&w=majority'

mongoose.connection.once('open',()=>{
    console.log('MongoDb is ready')
  })
  mongoose.connection.on('error',(err)=>{
    console.log('MongoDb is not ready', err)
  })

  async function mongoConnect (){
   await mongoose.connect(MONGO_URL)
  }
  async function mongoDisconnect(){
    await mongoose.disconnect()
  }
  
  module.exports = {
    mongoConnect,
    mongoDisconnect
}
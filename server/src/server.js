// const http = require('http')
// const app = require('./app')

// const PORT = 8000 
// const server = http.createServer(app)

// server.listen(PORT,()=>{
//     console.log('listening to port')
// })



const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');

const {loadPlanetsData} = require('./models/planets.model')
const PORT = process.env.PORT || 8000;
const MONGO_URL = 'mongodb+srv://nasa-api:OYjp9XPtWGOV7VkX@nasacluster.6tozxe7.mongodb.net/?retryWrites=true&w=majority'

const server = http.createServer(app);

mongoose.connection.once('open',()=>{
  console.log('MongoDb is ready')
})
mongoose.connection.on('error',(err)=>{
  console.log('MongoDb is not ready', err)
})

async function startServer(){
  await mongoose.connect(MONGO_URL)
    await loadPlanetsData()
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer()



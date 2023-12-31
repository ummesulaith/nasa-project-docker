// const http = require('http')
// const app = require('./app')

// const PORT = 8000 
// const server = http.createServer(app)

// server.listen(PORT,()=>{
//     console.log('listening to port')
// })



const http = require('http');
const app = require('./app');
const {loadLaunchData} = require('./models/launches.model')
require ('dotenv').config()
const {loadPlanetsData} = require('./models/planets.model')
const PORT = process.env.PORT || 8000;
const {mongoConnect} = require('./services/mongo')
const server = http.createServer(app);


async function startServer(){
  await mongoConnect()
    await loadPlanetsData()
    await loadLaunchData()
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer()



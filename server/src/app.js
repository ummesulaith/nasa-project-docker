const express = require('express'),
    cors = require('cors'),
    api = require('./routes/api')
    path = require('path'),
    app = express(),
    morgan = require('morgan');

app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(morgan('combined'))
app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use('/v1', api);
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','public','index.html'))
})

module.exports = app

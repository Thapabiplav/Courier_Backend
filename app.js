const express = require('express')
const { envPort } = require('./src/config/config')


const app = express()



const port= envPort.port
app.listen(port,()=>{
  console.log(`project has successfully started at ${port}`)
})
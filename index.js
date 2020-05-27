const express = require('express')
const app = express()
const http = require('http')

const server = http.createServer(app)

const socketIo = require('socket.io')

const io = socketIo.listen(server)

app.use(express.static(__dirname + '/public'))

server.listen(3000, () => {
  console.log('Running')
})

const drawHistory = []

io.on('connection', (socket) => {
  console.log('new connextiom')

  drawHistory.forEach((line) => {
    socket.emit('draw', line)
  })

  socket.on('draw', (line) => {
    drawHistory.push(line)
    io.emit('draw', line)
  })
})

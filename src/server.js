import WebSocket from 'ws'
import http from 'http'
import express from 'express'

const port = 3000
const app = express()

app.set('view engine', 'pug')
app.set('views', __dirname + '/views')

app.use('/public', express.static(__dirname + '/public'))
app.get('/', (_, res) => res.render('home'))
app.get('/*', (_, res) => res.redirect('/'))

const handleListening = () => console.log(`✅ Listening on http://localhost:${port}`)

const server = http.createServer(app)

const wss = new WebSocket.Server({server})

function onSocketClose() {
  console.log('Disconnected from the Browser ❌')
}

const sockets = []

wss.on('connection', (socket) => {
  sockets.push(socket)
  console.log('Connected to Browser ✅')
  socket.on('close', onSocketClose)
  socket.on('message', (message) => {
    sockets.forEach((aSocket) => {
      aSocket.send(message.toString('utf-8'))
    })
  })
})

server.listen(3000, handleListening)

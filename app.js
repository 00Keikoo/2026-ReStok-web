const express = require('express')
const cors = require('cors')
const path = require('path')
const http = require('http')
const { WebSocketServer } = require('ws')

const app = express()
const server = http.createServer(app)

// WebSocket Server
const wss = new WebSocketServer({ server })

// Simpan semua koneksi aktif
const clients = new Set()

wss.on('connection', (ws) => {
    clients.add(ws)
    ws.on('close', () => clients.delete(ws))
})

// Fungsi broadcast ke semua client
const broadcast = (data) => {
    const msg = JSON.stringify(data)
    clients.forEach(client => {
        if (client.readyState === 1) client.send(msg)
    })
}

// Export broadcast supaya bisa dipakai controller
app.set('broadcast', broadcast)

app.use(cors({ origin: ['http://localhost:5173'] }))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')))

const authRoutes = require('./src/routes/authRoutes')
const carRoutes = require('./src/routes/carRoutes')
const userRoutes = require('./src/routes/userRoutes')

app.use('/api/auth', authRoutes)
app.use('/api/cars', carRoutes)
app.use('/api/users', userRoutes)
const catalogRoutes = require('./src/routes/catalogRoutes')
app.use('/api/catalog', catalogRoutes)

// Error handler Multer
app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ success: false, message: `Field tidak dikenal: ${err.field}` })
    }
    next(err)
})

const PORT = ProcessingInstruction.env.PORT || 3000
server.listen(PORT, () => console.log(`Server jalan di http://localhost:${PORT}`))
const express = require('express')
const cors = require('cors')
const prisma = require('./src/config/db')
const app = express()
const path = require('path')
const PORT = 3000

app.use(cors({
    origin: 'http://localhost:5173'
}))

app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')))

app.use(express.json())

// Import routes
const authRoutes = require('./src/routes/authRoutes')
const carRoutes = require('./src/routes/carRoutes')

// Pakai routes
app.use('/api/auth', authRoutes)
app.use('/api/cars', carRoutes)

app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`)
})

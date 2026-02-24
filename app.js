const express = require('express')
const prisma = require('./src/config/db')
const app = express()
const PORT = 3000

app.use(express.json())

// Import routes
const authRoutes = require('./src/routes/authRoutes')

// Pakai routes
app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`)
})

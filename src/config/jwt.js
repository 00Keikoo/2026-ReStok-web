// Helper untuk buat dan verifikasi token

const jwt = require('jsonwebtoken')
const JWT_SECRET = 'showroom_secret_key_123' // nanti pindah ke .env

function generateToken(payload){
    //buat token yg expired dalam 7 hari
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d'})
}

function verifyToken(token){
    //verifikasi token - throw error kalau tidak valid
    return jwt.verify(token, JWT_SECRET)
}

module.exports = { generateToken, verifyToken}
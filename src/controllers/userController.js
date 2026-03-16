const prisma = require('../config/db')
const bcrypt = require('bcryptjs')

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, createdAt: true }
        })
        res.json({ success: true, data: users })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const createUser = async (req, res) => {
    try{
        const { name, email, password, role } = req.body
        if(!name || !email || !password || !role) {
            return res.status(400).json({
                success: false, 
                message: 'Semua field wajib diisi'
            })
        }
        const existing = await prisma.user.findUnique({ where: { email } })
        if(existing){
            return res.status(400).json({
                success: false,
                message: 'Email sudah digunakan'
            })
        }
        const hashed = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: { name, email, password: hashed, role: role.toUpperCase() },
            select: { id: true, name: true, email: true, role: true, createdAt: true }
        })
        res.status(201).json({
            success: true,
            message: 'User berhasil dibuat.',
            data: user
        })
    } catch (error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteUser = async (req, res) => {
    try{
        const id = parseInt(req.params.id)
        const user = await prisma.user.findUnique({ where: { id } })
        if(!user) return res.status(404).json({
            success: false,
            message: 'User tidak ditemukan!'
        })

        // Jangan bisa hapus sendiri IMPORTANT
        if(req.user.id === id){
            return res.status(400).json({
                success: false, 
                message: 'Tidak bisa menghapus akun sendiri'
            })
        }

        await prisma.user.delete({ where: { id } })
        res.json({
            success: true,
            message: `User ${user.name} berhasil dihapus.`
        })
    } catch(error){
        res.status(500).json({
            succes: false,
            message: error.message
        })
    }
}

module.exports = { getAllUsers, createUser, deleteUser }
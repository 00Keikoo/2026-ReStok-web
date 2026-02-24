const prisma = require('../config/db')
const bcrypt = require('bcryptjs')
const { generateToken } = require('../config/jwt')

// --Register--
async function register(req, res){
    try{
        console.log('register dipanggil')
        console.log('body:', req.body)
        const { name, email, password, role } = req.body
        
        // validasi field wajib
        if(!name || !email || !password){
            return res.status(400).json({
                success: false, 
                message: 'Name, email, dan password wajib diisi'
            })
        }

        // cek apakah email sudah terdaftar
        const cekUser = await prisma.user.findUnique({ where: { email } })
        if(cekUser){
            return res.status(409).json({
                succes: false,
                message: 'Email sudah terdaftar'
            })
        }

        // Hash password - Jangan simpan password polos ke database
        // angka 10 = seberapa kuat enkripsinya (makin besar makin aman tapi makin lambat)
        const hashedPassword = await bcrypt.hash(password, 10)

        // simpan user baru
        const user = await prisma.user.create({
            data: {
                name, 
                email,
                password: hashedPassword,
                role: role === 'ADMIN'? 'ADMIN' : 'SALES'
            }
        })

        return res.status(201).json({
            success: true,
            message: 'Registrasi berhasil',
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch(error){
        res.status(500).json({ success: false, message: error.message })
    }
}

// --Login--
const login = async (req, res) => {
    try{
        const { email, password } = req.body
        
        //validasi email dan password
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: 'Email dan password wajib diisi'
            })
        }

        // cari user berdasarkan email
        const user = await prisma.user.findUnique({ where: { email }})
        if(!user){
            return res.status(401).json({
                success: false, 
                message: 'Email atau password salah' // sengaja tidak spesifik
            })
        }

        // Bandingkan password yg diketik  dengan hash di database
        const passwordCocok = await bcrypt.compare(password, user.password)
        if(!passwordCocok){
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah'
            })
        }

        // Buat token JWT berisi info user
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        })

        return res.json({
            success: true,
            message: 'Login berhasil',
            data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }
        })
    } catch(error){
        res.status(500).json({ success: false, message: error.message })
    }
}

module.exports = { register, login }

// Token login eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzE4MjYwODksImV4cCI6MTc3MjQzMDg4OX0.Q7MB98A2yyi1qTur7D5M9DX4b_UDIC2NTudsL4WsfJw
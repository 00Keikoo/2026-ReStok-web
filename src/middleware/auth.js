const { verifyToken } = require('../config/jwt')

const authenticate = (req, res, next) => {
    //Ambil header Authorization
    //Formatnya: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzE4MjYwODksImV4cCI6MTc3MjQzMDg4OX0.Q7MB98A2yyi1qTur7D5M9DX4b_UDIC2NTudsL4WsfJw"

    const authHeader = req.headers['authorization']

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Akses ditolakm Token tidak ditemukan'
        })
    }

    //Pisahkan kata "Bearer" dari tokennya
    const token = authHeader.split(' ')[1]

    try{
        //Verifikasi token - kalau tidak valid akan throw error
        const decoded = verifyToken(token)

        //Simpan data user ke req.user
        //Sekarang controller bisa askes req.user.id, req.user.role, dll
        req.user = decoded

        next() // lanjut ke middleware/controller berikutnya
    } catch(error){
        return res.status(401).json({
            success: false,
            message: 'Token tidak valid atau sudah expired.'
        })
    }
}

module.exports = authenticate
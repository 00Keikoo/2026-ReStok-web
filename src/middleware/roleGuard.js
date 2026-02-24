const requireRole = (...roles) => {
    return (req, res, next) => {
        if(!req.user) {
            return res.status(401).json({
                success: false, 
                message: 'Unathorized.'
            })
        }

        //Cek apakah role user ada di daftar role yg diizinkan
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                success: false, 
                message: `Akses ditolak. Hanya ${roles.join(' atau ')} yang diizinkan`
            })
        }

        next()
    }
}

// Shortcut biar tidak perlu tulis requireRole('ADMIN') terus
const requireAdmin = requireRole('ADMIN')
const requireAdminOrSales = requireRole('ADMIN', 'SALES')

module.exports = { requireRole, requireAdmin, requireAdminOrSales }
const express = require('express')
const router = express.Router()
const prisma = require('../config/db')

router.get('/', async (req, res) => {
    try {
        const { status } = req.query
        const where = {}
        if (status) where.status = status.toUpperCase()

        const cars = await prisma.car.findMany({
            where,
            include: { media: true },
            orderBy: { createdAt: 'desc' }
        })

        const allCars = await prisma.car.findMany()
        const summary = {
            total: allCars.length,
            ready: allCars.filter(c => c.status === 'READY').length,
            sold: allCars.filter(c => c.status === 'SOLD').length,
        }

        res.json({ success: true, summary, data: cars })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
})

module.exports = router

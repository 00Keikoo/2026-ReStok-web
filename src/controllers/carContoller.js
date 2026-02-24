const prisma = require('../config/db')

//GET semua mobil - bisa filter by status
const getAllCars = async (req, res) => {
    try{
        const { status } = req.query

        const where = {}
        if(status) {
            where.status = status.toUpperCase()
        }

        const cars = await prisma.car.findMany({
            where,
            orderBy: { createdAt: 'desc '}
        })

        //Hitung summary
        const allCars = await prisma.car.findMany()
        const summary = {
            total: allCars.length,
            ready: allCars.filter(c => c.status === 'READY').length,
            sold: allCars.filter(c => c.status === 'SOLD').length,
        }

        res.json({ success: true, summary, data:cars })
    } catch(error){
        res.status(500).json({
            success: false, 
            message: error.message
        })
    }
}

//GET detail 1 mobil
const getCarById = async (req, res) => {
    try{
        const id = parseInt(req.params.id)

        const car = await prisma.car.findUnique({ where: { id } })
        if(!car){
            return res.status(404).json({
                success: false,
                message: 'Mobil tidak ditemukan!'
            })
        }
        res.json({ success: true, data: car})
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//POST tambah mobil - Admin only
const createCar = async (req, res) => {
    try{
        const { brand, model, type, transmisi, year, color, price, plateNumber, description} = req.body

        if(!brand || !model || !year || !color || !price){
            return res.status(400).json({
                success: false, 
                message: 'Brand, model, type, transmisi, year, color dan price wajib diisi'
            })
        }

        const car = await prisma.car.create({
            data: {
                brand,
                model,
                year: parseInt(year),
                color,
                price: parseFloat(price),
                plateNumber: plateNumber || null,
                description: description || null,
            }
        })

        res.status(201).json({
            success: true,
            message: 'Mobil berhasil ditambahkan'
        })
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// PATCH update status - Admin only
const updateCarStatus = async (req, res) => {
    try{
        const id = parseInt(req.params.id)
        const { status } = req.body

        if(!['READY', 'SOLD'].includes(status?.toUpperCase())){
            return res.status(400).json({
                success: false,
                message: 'Status tidak valid. Gunakan ready atau SOLD.'
            })
        }

        const car = await prisma.car.findUnique({ where: { id }})
        if(!car){
            return res.status(404).json({
                success: false,
                message: 'Mobil tidak ditemukan'
            })
        }

        const updated = await prisma.car.update({
            where: { id },
            data: { status: status.toUpperCase() }
        })

        res.json({
            success: true,
            message:  `Status diubah menjadi ${updated.data}.`,
            data: updated
        })
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// DELETE hapus mobil - Admin only
const deleteCar = async (req, res) => {
    try{
        const id = parseInt(req.params.id)

        const car = await prisma.car.findUnique({ where: { id }})

        if(!car){
            return res.status(404).json({
                success: false,
                message: 'Mobil tidak ditemukan'
            })
        }

        await prisma.car.delete({ where: { id }})
        res.json({
            success: true,
            message: `Mobil ${car.brand} ${car.model} berhasil dihapus`
        })
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { getAllCars, getCarById, createCar, updateCarStatus, deleteCar }
const prisma = require('../config/db')

async function getAllCars(req, res) {
  try {
    const { status } = req.query
    const where = {}
    if (status) where.status = status.toUpperCase()

    const cars = await prisma.car.findMany({ 
      where,
      include: { media:true }, // sertakan media
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
}

async function getCarById(req, res) {
  try {
    const id = parseInt(req.params.id)
    const car = await prisma.car.findUnique({ 
      where: { id }, 
      include: { media: true }
    })
    if (!car) return res.status(404).json({ success: false, message: 'Mobil tidak ditemukan.' })
    res.json({ success: true, data: car })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

async function createCar(req, res) {
  try {
    const { brand, model, type, transmisi, year, color, price, plateNumber, description } = req.body
    if (!brand || !model || !type || !transmisi || !year || !color || !price) {
      return res.status(400).json({ 
        success: false,
        message: 'Brand, model, year, color, dan price wajib diisi.' 
      })
    }

    // Buat data mobil dulu 
    const car = await prisma.car.create({
      data: {
        brand, model, type, transmisi,color,
        year: parseInt(year),
        price: parseFloat(price),
        plateNumber: plateNumber || null,
        description: description || null
      }
    })
    
    // Simpan semua file media yang diupload
    if(req.files && req.files.length > 0){
      const mediaData = req.files.map(file => ({
        carId: car.id,
        url: `/uploads/${file.filename}`,
        type: file.mimetype.startsWith('video') ? 'video' : 'image'
      }))

      await prisma.carMedia.createMany({ data: mediaData })
    }

    // Ambil data lengkap dengan media
    const carWithMedia = await prisma.car.findUnique({
      where: { id: car.id },
      include: { media: true }
    })

    res.status(201).json({ 
      success: true, 
      message: 'Mobil berhasil ditambahkan.', 
      data: car 
    })
  } catch (error) {
    res.status(500).json({ 
    success: false, 
    message: error.message 
    })
  }
}

const updateCar = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { brand, model, type, transmisi, year, color, price, plateNumber, description } = req.body

    const car = await prisma.car.findUnique({ where: {id} })
    if(!car) return res.status(404).json({
      success: false,
      message: 'Mobil tidak ditemukan'
    })

    const updated = await prisma.car.update({
      where: { id },
      data: {
        brand, model, type, transmisi, color,
        year: parseInt(year),
        price: parseFloat(price),
        plateNumber: plateNumber || null,
        description: description || null
      },
      include: { media: true }
    })

    res.json({ 
      success: true,
      message: 'Mobil berhasil diupdate.',
      data: updated
    })
  } catch(error){
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

async function updateCarStatus(req, res) {
  try {
    const id = parseInt(req.params.id)
    const { status } = req.body

    if (!['READY', 'SOLD'].includes(status?.toUpperCase())) {
      return res.status(400).json({
        success: false, 
        message: 'Status tidak valid. Gunakan READY atau SOLD.' 
      })
    }

    const car = await prisma.car.findUnique({ where: { id } })

    if (!car) return res.status(404).json({ success: false, message: 'Mobil tidak ditemukan.' })
    
    const updated = await prisma.car.update({ 
      where: { id }, 
      data: { status: status.toUpperCase() },
      include: { media: true } 
    })

    res.json({ success: true, message: `Status berhasil diubah jadi ${updated.status}.`, data: updated })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

async function deleteCar(req, res) {
  try {
    const id = parseInt(req.params.id)
    const car = await prisma.car.findUnique({ where: { id } })

    if (!car) return res.status(404).json({ success: false, message: 'Mobil tidak ditemukan.' })
    await prisma.car.delete({ where: { id } })
    res.json({ success: true, message: `Mobil ${car.brand} ${car.model} berhasil dihapus.` })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = { getAllCars, getCarById, createCar, updateCar, updateCarStatus, deleteCar }

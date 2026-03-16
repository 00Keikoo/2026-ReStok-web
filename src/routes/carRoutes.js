const express = require('express')
const router = express.Router()
const carController = require('../controllers/carController')
const authenticate = require('../middleware/auth')
const { requireAdmin } = require('../middleware/roleGuard')
const upload = require('../config/multer')

// Admin & Sales
router.get('/', authenticate, carController.getAllCars)
router.get('/:id', authenticate, carController.getCarById)

// Admin only
router.post('/', authenticate, requireAdmin, (req, res, next) => {
    console.log('Content-Type: ', req.header['content-type'])
    next()
}, upload.array('media', 20), carController.createCar)
router.put('/:id', authenticate, requireAdmin, carController.updateCar)
router.post('/:id/media', authenticate, requireAdmin, upload.array('media', 20), carController.addMedia)
router.delete('/:id/media/:mediaId', authenticate, requireAdmin, carController.deleteMedia)
router.patch('/:id/status', authenticate, requireAdmin, carController.updateCarStatus)
router.delete('/:id', authenticate, requireAdmin, carController.deleteCar)

module.exports = router

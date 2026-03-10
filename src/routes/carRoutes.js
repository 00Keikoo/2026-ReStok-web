const express = require('express')
const router = express.Router()
const carController = require('../controllers/carController')
const authenticate = require('../middleware/auth')
const { requireAdmin } = require('../middleware/roleGuard')
const upload = require('../config/multer')


//Admin & Sales - Hanya butuh token
router.get('/', authenticate, carController.getAllCars)
router.get('/:id', authenticate, carController.getCarById)

//Admin only - butuh token + role ADMIN
router.get('/', authenticate, carController.getAllCars)
router.get('/:id', authenticate, carController.getCarById)
router.post('/', authenticate, requireAdmin, upload.array('media', 10), carController.createCar)
router.patch('/:id/status', authenticate, requireAdmin, carController.updateCarStatus)
router.delete('/:id', authenticate, requireAdmin, carController.deleteCar)

module.exports = router
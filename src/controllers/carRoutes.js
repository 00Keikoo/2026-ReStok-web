const express = require('express')
const router = express.Router
const carController = require('../controllers/carContoller')
const authenticate = require('../middleware/auth')
const { requireAdmin } = require('../middleware/roleGuard')

//Admin & Sales - Hanya butuh token
router.get('/', authenticate, carController.getAllCars)

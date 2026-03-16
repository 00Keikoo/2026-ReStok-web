const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authenticate = require('../middleware/auth')
const { requireAdmin } = require('../middleware/roleGuard')

router.get('/', authenticate, requireAdmin, userController.getAllUsers)
router.post('/', authenticate, requireAdmin, userController.createUser)
router.delete('/:id', authenticate, requireAdmin, userController.deleteUser)

module.exports = router
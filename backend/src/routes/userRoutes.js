const express = require('express');
const router = express.Router();
const { getAgents, getAllUsers, updateUserRole } = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/agents', authorize('admin', 'agent'), getAgents);
router.get('/', authorize('admin'), getAllUsers);
router.put('/:id/role', authorize('admin'), updateUserRole);

module.exports = router;

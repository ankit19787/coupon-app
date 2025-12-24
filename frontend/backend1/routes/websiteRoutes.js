
const router = require('express').Router();
const controller = require('../controllers/websiteController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, controller.getWebsites);
router.get('/:id', authenticateToken, controller.getWebsiteById);
router.post('/', authenticateToken, controller.createWebsite);
router.put('/:id', authenticateToken, controller.updateWebsite);
router.delete('/:id', authenticateToken, controller.deleteWebsite);

module.exports = router;

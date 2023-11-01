const express = require('express');
const router = express.Router();
const timelineController = require('../controllers/timelineController');

router.get('/status/:id', timelineController.getStatusFromLocalStorage);

router.post('/atualizarOrcamento', timelineController.atualizarOrcamento);

module.exports = router;
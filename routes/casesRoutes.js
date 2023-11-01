const express = require('express');
const router = express.Router();
const casesController = require('../controllers/casesController');

router.get('/listadecasos', casesController.getCases);

router.get('/listadecasos/:id', casesController.getCasesByUser);

router.get('/caso/:id', casesController.getCaseById);

router.post('/recusaorcamento/:id', casesController.postMessageRecusaOrcamento)

router.get('/recusaorcamento/:id', casesController.getMessageRecusaOrcamento)

router.post('/recusaseguimentacao/:id', casesController.postMessageRecusaSeguimentacao)

router.get('/recusaseguimentacao/:id', casesController.getMessageRecusaSeguimentacao)

router.post('/recusarelatoriocaso/:id', casesController.postMessageRecusaRelatorioCaso)

router.get('/recusarelatoriocaso/:id', casesController.getMessageRecusaRelatorioCaso)

router.post('/casocancelado/:id', casesController.postMessageCasoCancelado)

router.get('/casocancelado/:id', casesController.getMessageCasoCancelado)

module.exports = router;
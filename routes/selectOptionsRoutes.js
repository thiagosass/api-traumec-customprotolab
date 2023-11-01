const express = require('express');
const router = express.Router();
const selectOptionsController = require('../controllers/selectOptionsController');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Define o diretório de destino para os arquivos
    },
    filename: function (req, file, cb) {
      // Define o nome do arquivo conforme necessário
      cb(null, file.originalname);
    }
  });

const upload = multer({ storage: storage }).fields([
    { name: 'zipFile', maxCount: 1 },
    { name: 'intraOralZipFile', maxCount: 1 },
    { name: 'clinicalImagesZipFile', maxCount: 1 },
]);

// Rota para inserir um novo caso com upload de arquivo
router.post('/inserircaso', upload, selectOptionsController.inserirCaso);

// Rota para obter os nomes de cirurgiões
router.get('/cirurgioes', selectOptionsController.getCirurgioes);

// Rota para obter o nome de cirurgiões pelo ID
router.get('/cirurgioes/:id', selectOptionsController.getCirurgiaoById);

// Rota para obter os nomes de distribuidores
router.get('/distribuidores', selectOptionsController.getDistribuidores);

// Rota para obter os nomes de distribuidores
router.get('/distribuidores/:id', selectOptionsController.getDistribuidoresById);

// Rota para obter os tipos de produto
router.get('/tipodeproduto', selectOptionsController.getProductType);

module.exports = router;


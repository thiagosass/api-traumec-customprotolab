const express = require("express");
const router = express.Router();

const { 

    getUsers,              // Obtém todos os usuários
    createUser,            // Cria um novo usuário
    createSurgeon,         // Cadastra um cirurgião
    getSurgeon,            // Obtém todos os cirurgiões
    createDistributor,     // Cadastra um distribuidor
    getDistributor,        // Obtém todos os distribuidores
    updateUser,            // Atualiza um usuário existente   
    getUsuarios,           // Obtém uma lista de usuários (cirurgiões e distribuidores)
    login,                 // Realiza o login do usuário
    deleteDistributor      // Exclui um usuário

} = require("../controllers/user.js");

// Rotas:

// Obtém todos os usuários
router.get("/", getUsers);

// Cria um novo usuário
router.post("/", createUser);

// Obtém todos os cirurgiões
router.get("/cadastrocirurgiao", getSurgeon);

// Cadastra um cirurgião
router.post("/cadastrocirurgiao", createSurgeon);

// Obtém todos os distribuidores
router.get("/cadastrodistribuidor", getDistributor);

// Cadastra um distribuidor
router.post("/cadastrodistribuidor", createDistributor);

// Atualiza um usuário existente
router.put("/:iduser", updateUser);

// Exclui um usuário
router.delete("/deleteDistributor/:iduser", deleteDistributor);

// Obtém uma lista de usuários (cirurgiões e distribuidores)
router.get("/usuarios", getUsuarios);

// Realiza o login do usuário
router.post("/login", login);

module.exports = router;
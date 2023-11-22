const mysql = require('mysql2/promise');
const db = require('../db.js');
const bcrypt = require("bcrypt");
const saltRounds = 10; 
const jwt = require("jsonwebtoken");

// Obter todos os usuários
const getUsers = async (_, res) => {
    try {
        const q = "SELECT * FROM surgeons";
        const [rows] = await db.query(q);

        return res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
};

// Cadastro de usuário
const createUser = async (req, res) => {
    const { nome, email, senha, usertype } = req.body;
    const q = "INSERT INTO users (nome, email, senha, usertype) VALUES (?, ?, ?, ?)";

    try {
        const [data] = await db.query(q, [nome, email, senha, usertype]);
        return res.status(201).json({ message: "Usuário criado com sucesso", id: data.insertId });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
};

const createSurgeon = async (req, res) => {
    const {
        nomeSurgeon,
        telSurgeon,
        numCRO,
        cpf,
        emailSurgeon,
        senhaSurgeon,
        nomeUsuario,
    } = req.body;

    // Iniciar uma transação para garantir consistência
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // 1. Inserir dados do usuário na tabela de usuários
        const tipoUsuario = 1
        const hashedPassword = await bcrypt.hash(senhaSurgeon, saltRounds);
        const userInsertQuery = "INSERT INTO users (nome_usuario, senha_usuario, tipo_usuario) VALUES (?, ?, ?)";
        await connection.query(userInsertQuery, [nomeUsuario, hashedPassword, tipoUsuario]);

        // 2. Recuperar o ID do usuário recém-inserido
        const userIdQuery = "SELECT LAST_INSERT_ID() as userId";
        const [userIdRow] = await connection.query(userIdQuery);
        const userId = userIdRow[0].userId;

        // 3. Inserir dados específicos de cirurgião na tabela de cirurgiões com o ID do usuário associado
        const cirurgiaoInsertQuery = "INSERT INTO surgeons (id_cirurgiao, nome_cirurgiao, tel_cirurgiao, numCRO, cpf_cirurgiao, email_cirurgiao ) VALUES (?, ?, ?, ?, ?, ?)";
        const [cirurgiaoData] = await connection.query(cirurgiaoInsertQuery, [
            userId, // ID do usuário recém-inserido
            nomeSurgeon,
            telSurgeon,
            numCRO,
            cpf,
            emailSurgeon,
        ]);

        // Confirmar a transação
        await connection.commit();

        return res.status(201).json({
            message: "Cirurgião cadastrado com sucesso",
            id: cirurgiaoData.insertId, // Você pode retornar o ID da tabela de cirurgiões ou qualquer outro dado relevante
        });
    } catch (err) {
        console.error(err);

        // Em caso de erro, desfazer a transação
        await connection.rollback();

        return res.status(500).json({ message: "Erro interno no servidor" });
    } finally {
        // Liberar a conexão após o uso
        connection.release();
    }
};

// Obter todos os cirurgiões
const getSurgeon = async (_, res) => {
    try {
        const q = "SELECT * FROM surgeon";
        const [rows] = await db.query(q);

        return res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
};

// Excluir um usuário
const deleteSurgeon = async (req, res) => {
    const { iduser } = req.params;
    const q = "DELETE FROM surgeon WHERE idsurgeon = ?";

    try {
        const [data] = await db.query(q, [iduser]);
        if (data.affectedRows === 0) return res.status(404).json({ message: "Usuário não encontrado" });
        return res.status(200).json({ message: "Usuário excluído com sucesso" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
};

const createDistributor = async (req, res) => {
    const {
        nomeRepresentante,
        telRepresentante,
        nomeEmpresa,
        enderecoEmpresa,
        emailRepresentante,
        senhaRepresentante,
        nomeUsuario, 
    } = req.body;

    // Iniciar uma transação para garantir consistência
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // 1. Inserir dados do usuário na tabela de usuários
        const tipoUsuario = 2
        const hashedPassword = await bcrypt.hash(senhaRepresentante, saltRounds);
        const userInsertQuery = "INSERT INTO users (nome_usuario, senha_usuario, tipo_usuario) VALUES (?, ?, ?)";
        await connection.query(userInsertQuery, [nomeUsuario, hashedPassword, tipoUsuario]);

        // 2. Recuperar o ID do usuário recém-inserido
        const userIdQuery = "SELECT LAST_INSERT_ID() as userId";
        const [userIdRow] = await connection.query(userIdQuery);
        const userId = userIdRow[0].userId;

        // 3. Inserir dados específicos do distribuidor na tabela de distribuidores com o ID do usuário associado
        const distributorInsertQuery = "INSERT INTO distributors (id_distribuidor, nome_representante, tel_representante, nome_empresa, endereco_empresa, email_representante) VALUES (?, ?, ?, ?, ?, ?)";
        const [distributorData] = await connection.query(distributorInsertQuery, [
            userId, // ID do usuário recém-inserido
            nomeRepresentante,
            telRepresentante,
            nomeEmpresa,
            enderecoEmpresa,
            emailRepresentante,
        ]);

        // Confirmar a transação
        await connection.commit();

        return res.status(201).json({
            message: "Distribuidor cadastrado com sucesso",
            id: distributorData.insertId, // Você pode retornar o ID da tabela de distribuidores ou qualquer outro dado relevante
        });
    } catch (err) {
        console.error(err);

        // Em caso de erro, desfazer a transação
        await connection.rollback();

        return res.status(500).json({ message: "Erro interno no servidor" });
    } finally {
        // Liberar a conexão após o uso
        connection.release();
    }
};

// Obter todos os Distribuidores
const getDistributor = async (_, res) => {
    try {
        const q = "SELECT * FROM distributor";
        const [rows] = await db.query(q);

        return res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
};

// Excluir um usuário
const deleteDistributor = async (req, res) => {
    const { iduser } = req.params;
    const q = "DELETE FROM distributor WHERE iddistributor = ?";

    try {
        const [data] = await db.query(q, [iduser]);
        if (data.affectedRows === 0) return res.status(404).json({ message: "Usuário não encontrado" });
        return res.status(200).json({ message: "Usuário excluído com sucesso" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
};

// Atualizar um usuário existente
const updateUser = async (req, res) => {
    const { iduser } = req.params;
    const { nome, email, senha, usertype } = req.body;
    const q = "UPDATE users SET nome = ?, email = ?, senha = ?, usertype = ? WHERE iduser = ?";

    try {
        const [data] = await db.query(q, [nome, email, senha, usertype, iduser]);
        if (data.affectedRows === 0) return res.status(404).json({ message: "Usuário não encontrado" });
        return res.status(200).json({ message: "Usuário atualizado com sucesso" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
};

const getUsuarios = async (_, res) => {
    try {
        const q = `
            SELECT 'cirurgião' AS usertype, idsurgeon AS idusuario, emailSurgeon AS emailUsuario, senhaSurgeon AS senhaUsuario
            FROM surgeon
            UNION ALL
            SELECT 'distribuidor' AS usertype, iddistributor AS idusuario, emailRepresentante AS emailUsuario, senhaRepresentante AS senhaUsuario
            FROM distributor;
        `;

        const [rows] = await db.query(q);

        return res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
};

const login = async (req, res) => {
    try {
        const { nomeUsuario, senha } = req.body;

        // Consulta para verificar o usuário na tabela de usuários
        const [userRows] = await db.query("SELECT usuario_id, nome_usuario, senha_usuario, tipo_usuario FROM users WHERE nome_usuario = ?", [nomeUsuario]);

        if (userRows.length === 0) {
            return res.status(401).json({ message: "Nome de usuário não encontrado" });
        }

        const user = userRows[0];

        // Verifica se a senha está correta
        const senhaCorreta = await bcrypt.compare(senha, user.senha_usuario);

        if (!senhaCorreta) {
            return res.status(401).json({ message: "Senha incorreta" });
        }

        // Se chegou até aqui, as credenciais são válidas
        const tokenData = { userId: user.usuario_id, userName: user.nome_usuario, userType: user.tipo_usuario};
        
        // Gere um token de autenticação
        const token = jwt.sign(tokenData, "seu_segredo_secreto");

        // Retorne uma resposta de sucesso com o token
        return res.status(200).json({ message: "Login realizado com sucesso", token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
};

module.exports = { 
    getUsers, 
    createUser, 
    updateUser,     
    getUsuarios,

    createSurgeon, 
    getSurgeon,
    deleteSurgeon,

    createDistributor,
    getDistributor,
    deleteDistributor,
     
    login 
};


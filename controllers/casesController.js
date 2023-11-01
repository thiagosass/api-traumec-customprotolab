const db = require('../db.js');

// Função para buscar todos os casos no banco de dados
const getCases = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        cases.id_caso,
        patients.cod_paciente,
        patients.iniciais_paciente,
        cases.tipo_produto,
        cases.cirurgiao,
        cases.distribuidor,
        cases.status_atual
      FROM cases
      JOIN patients ON patients.id_paciente = cases.id_caso
    `);

    const cases = rows.map((row) => ({
      idcaso: row.id_caso,
      codigoPaciente: row.cod_paciente,
      iniciaisPaciente: row.iniciais_paciente,
      tipoProduto: row.tipo_produto,
      nomeCirurgiao: row.cirurgiao,
      empresaRepresentante: row.distribuidor,
      status: row.status_atual,
    }));

    res.status(200).json(cases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};

// Função para buscar todos os casos no banco de dados
const getCasesByUser = async (req, res) => {
  const { id } = req.params; // Obtenha o ID do usuário da URL
  
  try {
    const [rows] = await db.query(`
      SELECT
        cases.id_caso,
        patients.cod_paciente,
        patients.iniciais_paciente,
        cases.tipo_produto,
        cases.cirurgiao,
        cases.distribuidor,
        cases.status_atual
      FROM cases
      JOIN patients ON patients.id_paciente = cases.id_caso
      WHERE cases.usuario_solicitante = ?
    `, [id]);

    const cases = rows.map((row) => ({
      idcaso: row.id_caso,
      codigoPaciente: row.cod_paciente,
      iniciaisPaciente: row.iniciais_paciente,
      tipoProduto: row.tipo_produto,
      nomeCirurgiao: row.cirurgiao,
      empresaRepresentante: row.distribuidor,
      status: row.status_atual,
    }));

    res.status(200).json(cases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};

// Função para buscar um caso específico por ID no banco de dados
const getCaseById = async (req, res) => {
  const { id } = req.params; // Assumindo que o ID é passado como um parâmetro na URL
  
  try {
    const [rows] = await db.query(`
      SELECT
        patients.cod_paciente,
        patients.iniciais_paciente,
        cases.tipo_produto,
        cases.cirurgiao,
        cases.distribuidor,
        cases.status_atual
      FROM patients
      JOIN cases ON patients.id_paciente = cases.id_caso
      WHERE patients.id_paciente = ?
    `, [id]);
    
    // Verifica se encontrou um caso com o ID especificado
    if (rows.length === 0) {
      return res.status(404).json({ message: "Caso não encontrado" });
    }

    const caseData = {
      codigoPaciente: rows[0].cod_paciente,
      iniciaisPaciente: rows[0].iniciais_paciente,
      tipoProduto: rows[0].tipo_produto,
      nomeCirurgiao: rows[0].cirurgiao,
      empresaRepresentante: rows[0].distribuidor,
      status: rows[0].status_atual,
    };

    res.status(200).json(caseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};

const getMessageRecusaOrcamento = async (req, res) => {
  const { id } = req.params; // Assumindo que o ID é passado como um parâmetro na URL
  
  try {
    const [rows] = await db.query('SELECT * FROM cases WHERE id_caso = ?', [id]);
    
    // Verifica se encontrou um caso com o ID especificado
    if (rows.length === 0) {
      return res.status(404).json({ message: "Caso não encontrado" });
    }

    const caseData = {      
      recusaOrcamento: rows[0].recusaOrcamento,
    };

    res.status(200).json(caseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};

const postMessageRecusaOrcamento = async (req, res) => {
  const { id } = req.params; // Assumindo que o ID é passado como um parâmetro na URL
  const { recusaOrcamento } = req.body; // Supondo que a mensagem seja enviada no corpo da solicitação

  try {
    // Verifique se o caso com o ID especificado existe
    const [existingCases] = await db.query('SELECT * FROM cases WHERE idcaso = ?', [id]);

    // Verifica se encontrou um caso com o ID especificado
    if (existingCases.length === 0) {
      return res.status(404).json({ message: "Caso não encontrado" });
    }

    // Atualize o campo 'recusaOrcamento' no caso com a mensagem fornecida
    await db.query('UPDATE cases SET recusaOrcamento = ? WHERE idcaso = ?', [recusaOrcamento, id]);

    res.status(200).json({ message: "Mensagem de recusa de orçamento inserida com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};


const getMessageCasoCancelado = async (req, res) => {
  const { id } = req.params; // Assumindo que o ID é passado como um parâmetro na URL
  
  try {
    const [rows] = await db.query('SELECT * FROM cases WHERE idcaso = ?', [id]);
    
    // Verifica se encontrou um caso com o ID especificado
    if (rows.length === 0) {
      return res.status(404).json({ message: "Caso não encontrado" });
    }

    const caseData = {      
      casoCancelado: rows[0].casoCancelado,
    };

    res.status(200).json(caseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};

const postMessageCasoCancelado = async (req, res) => {
  const { id } = req.params; // Assumindo que o ID é passado como um parâmetro na URL
  const { casoCancelado } = req.body; // Supondo que a mensagem seja enviada no corpo da solicitação

  try {
    // Verifique se o caso com o ID especificado existe
    const [existingCases] = await db.query('SELECT * FROM cases WHERE idcaso = ?', [id]);

    // Verifica se encontrou um caso com o ID especificado
    if (existingCases.length === 0) {
      return res.status(404).json({ message: "Caso não encontrado" });
    }

    // Atualize o campo 'recusaOrcamento' no caso com a mensagem fornecida
    await db.query('UPDATE cases SET casoCancelado = ? WHERE idcaso = ?', [casoCancelado, id]);

    res.status(200).json({ message: "Mensagem de cancelamento inserida com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};


const getMessageRecusaSeguimentacao = async (req, res) => {
  const { id } = req.params; // Assumindo que o ID é passado como um parâmetro na URL
  
  try {
    const [rows] = await db.query('SELECT * FROM cases WHERE idcaso = ?', [id]);
    
    // Verifica se encontrou um caso com o ID especificado
    if (rows.length === 0) {
      return res.status(404).json({ message: "Caso não encontrado" });
    }

    const caseData = {      
      recusaSeguimentacao: rows[0].recusaSeguimentacao,
    };

    res.status(200).json(caseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};

const postMessageRecusaSeguimentacao = async (req, res) => {
  const { id } = req.params; // Assumindo que o ID é passado como um parâmetro na URL
  const { recusaSeguimentacao } = req.body; // Supondo que a mensagem seja enviada no corpo da solicitação

  try {
    // Verifique se o caso com o ID especificado existe
    const [existingCases] = await db.query('SELECT * FROM cases WHERE idcaso = ?', [id]);

    // Verifica se encontrou um caso com o ID especificado
    if (existingCases.length === 0) {
      return res.status(404).json({ message: "Caso não encontrado" });
    }

    // Atualize o campo 'recusaOrcamento' no caso com a mensagem fornecida
    await db.query('UPDATE cases SET recusaSeguimentacao = ? WHERE idcaso = ?', [recusaSeguimentacao, id]);

    res.status(200).json({ message: "Mensagem de recusa de seguimentação inserida com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};

const getMessageRecusaRelatorioCaso = async (req, res) => {
  const { id } = req.params; // Assumindo que o ID é passado como um parâmetro na URL
  
  try {
    const [rows] = await db.query('SELECT * FROM cases WHERE idcaso = ?', [id]);
    
    // Verifica se encontrou um caso com o ID especificado
    if (rows.length === 0) {
      return res.status(404).json({ message: "Caso não encontrado" });
    }

    const caseData = {      
      recusaRelatorioCaso: rows[0].recusaRelatorioCaso,
    };

    res.status(200).json(caseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};

const postMessageRecusaRelatorioCaso = async (req, res) => {
  const { id } = req.params; // Assumindo que o ID é passado como um parâmetro na URL
  const { recusaRelatorioCaso } = req.body; // Supondo que a mensagem seja enviada no corpo da solicitação

  try {
    // Verifique se o caso com o ID especificado existe
    const [existingCases] = await db.query('SELECT * FROM cases WHERE idcaso = ?', [id]);

    // Verifica se encontrou um caso com o ID especificado
    if (existingCases.length === 0) {
      return res.status(404).json({ message: "Caso não encontrado" });
    }

    // Atualize o campo 'recusaOrcamento' no caso com a mensagem fornecida
    await db.query('UPDATE cases SET recusaRelatorioCaso = ? WHERE idcaso = ?', [recusaRelatorioCaso, id]);

    res.status(200).json({ message: "Mensagem de recusa de relatório inserida com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};

module.exports = {
  getCases,
  getCasesByUser,
  getCaseById,
  postMessageRecusaOrcamento,
  getMessageRecusaOrcamento,
  getMessageCasoCancelado,
  postMessageCasoCancelado,
  getMessageRecusaSeguimentacao,
  postMessageRecusaSeguimentacao,
  getMessageRecusaRelatorioCaso,
  postMessageRecusaRelatorioCaso
};
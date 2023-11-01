const db = require('../db.js');

const getStatusFromLocalStorage = async (req, res) => {
  const { id } = req.params; // Obtém o ID do caso

  try {
    // Aqui você usará o ID do caso do localStorage para buscar na tabela de status
    const [rows] = await db.query('SELECT * FROM status WHERE idstatus = ?', [id]);

    // Adicionando um console.log para verificar os resultados
    console.log('Rows from the database:', rows);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Status não encontrado ainda" });
    }

    // Retorna o status encontrado para o ID do caso
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};

const atualizarOrcamento = async (req, res) => {
  const { idcaso } = req.body; // Certifique-se de enviar o idcaso do frontend

  try {
    // Atualiza a tabela de status no banco de dados com os novo valores
    const queryStatus = 'UPDATE status SET status_orcamento = ?, status_orcamento_aprov = ? WHERE idstatus = ?';
    const valuesStatus = ['Concluído!', 'Aguardando aprovação', idcaso];

    // Atualiza o campo status_atual na tabela cases
    const queryCases = 'UPDATE cases SET status_atual = ? WHERE id_caso = ?';
    const valuesCases = ['Aprovando orçamento', idcaso];

    await db.query(queryStatus, valuesStatus);
    await db.query(queryCases, valuesCases);

    res.status(200).json({ message: 'Status de orçamento atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar o status de orçamento' });
  }
};

module.exports = {
  getStatusFromLocalStorage,
  atualizarOrcamento,
};
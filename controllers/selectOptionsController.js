const db = require('../db.js');
const fs = require('fs');
const path = require('path');

    // Função para formatar o nome completo em iniciais com pontos e espaçamentos
    function formatNameToInitials(name) {
        const words = name.split(' ');
        const initials = words.map((word) => word.charAt(0).toUpperCase() + '. ');
        return initials.join('');
    }

    // Obtém os nomes de cirurgiões
    const getCirurgioes = async (_, res) => {
        try {
            const q = "SELECT nome_cirurgiao, tel_cirurgiao, numCRO, email_cirurgiao FROM surgeons";
            const [rows] = await db.query(q);
            const cirurgioes = rows.map((row) => ({
                nome: row.nome_cirurgiao,
                telefone: row.tel_cirurgiao,
                cro_crm: row.numCRO,
                email: row.email_cirurgiao,
            }));
            res.status(200).json(cirurgioes);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erro interno no servidor" });
        }
    };

    // Obtém os dados de um cirurgião pelo ID
    const getCirurgiaoById = async (req, res) => {
        const cirurgiaoId = req.params.id; // Obtém o ID da URL
        try {
            const q = "SELECT nome_cirurgiao, tel_cirurgiao, numCRO, email_cirurgiao FROM surgeons WHERE id_cirurgiao = ?";
            const [rows] = await db.query(q, [cirurgiaoId]);
            
            if (rows.length === 0) {
                return res.status(404).json({ message: "Cirurgião não encontrado" });
            }
    
            const cirurgiao = {
                nome: rows[0].nome_cirurgiao,
                telefone: rows[0].tel_cirurgiao,
                cro_crm: rows[0].numCRO,
                email: rows[0].email_cirurgiao,
            };
            
            // Retorna o cirurgião em um array com um único item
            res.status(200).json([cirurgiao]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erro interno no servidor" });
        }
    };

    // Obtém os nomes de distribuidores
    const getDistribuidores = async (_, res) => {
        try {
            const q = "SELECT nome_representante, email_representante, tel_representante, nome_empresa, endereco_empresa FROM distributors";
            const [rows] = await db.query(q);
            const distribuidores = rows.map((row) => ({
                nome: row.nome_representante,
                email: row.email_representante,
                telefone: row.tel_representante,
                nome_empresa: row.nome_empresa,
                endereco_empresa: row.endereco_empresa
            }));
            
            res.status(200).json(distribuidores);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erro interno no servidor" });
        }
    };

    // Obtém os dadosde um distribuidor pelo ID
    const getDistribuidoresById = async (req, res) => {
        const distribuidorId = req.params.id; // Obtém o ID da URL
        try {
            const q = "SELECT nome_representante, email_representante, tel_representante, nome_empresa, endereco_empresa FROM distributors WHERE id_distribuidor = ?";
            const [rows] = await db.query(q, [distribuidorId]);
            
            if (rows.length === 0) {
                return res.status(404).json({ message: "Distribuidor não encontrado" });
            }
    
            const distribuidor = {
                nome: rows[0].nome_representante,
                email: rows[0].email_representante,
                telefone: rows[0].tel_representante,
                nome_empresa: rows[0].nome_empresa,
                endereco_empresa: rows[0].endereco_empresa
            };
    
            // Retorna o distribuidor em um array com um único item
            res.status(200).json([distribuidor]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erro interno no servidor" });
        }
    };

    // Obtém os nomes de distribuidores
    const getProductType = async (_, res) => {
        try {
            const q = "SELECT nome_tipo_produto FROM product_type";
            const [rows] = await db.query(q);
            const tipoProduto = rows.map((row) => ({
                tipoProduto: row.nome_tipo_produto
            }));
            
            res.status(200).json(tipoProduto);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erro interno no servidor" });
        }
    };

    // Função para inserir um novo caso na tabela "cases"
    const inserirCaso = async (req, res) => {
        console.log('Requisição para inserir um novo caso, recebida!');
        console.log('Files:', req.files);

        try {
            const { nomePaciente, tipoProduto, nomeCirurgiao, empresaRepresentante, status, userId } = req.body;
            const { zipFile, intraOralZipFile, clinicalImagesZipFile } = req.files;
    
            // Verifique se os campos obrigatórios estão presentes
            if (!nomePaciente || !tipoProduto || !nomeCirurgiao || !empresaRepresentante || !status) {
                return res.status(400).json({ message: 'Por favor, preencha todos os campos obrigatórios.' });
            }
    
            // Formate o nome do paciente para iniciais
            const iniciaisPaciente = formatNameToInitials(nomePaciente);
    
            // Obtenha os dois últimos dígitos do ano atual
            const currentYear = new Date().getFullYear() % 100;
    
            // Consulte o banco de dados para contar quantos casos existem com o mesmo ano atual no código do paciente
            const [rows] = await db.query('SELECT COUNT(*) as count FROM patients WHERE cod_paciente LIKE ?', [`%-${currentYear}`]);
            const count = rows[0].count + 1; // O próximo número sequencial
    
            // Formate o número sequencial com zeros à esquerda, se necessário (por exemplo, "001")
            const formattedCount = count.toString().padStart(3, '0');
    
            // Crie o novo código de paciente no formato desejado (por exemplo, "001-22")
            const novoCodigoPaciente = `${formattedCount}-${currentYear}`;
    
            // Use novoCodigoPaciente como nome do diretório
            const casoDirectory = path.join(__dirname, '../uploads', novoCodigoPaciente);
    
            // Use o módulo fs para criar o diretório
            fs.mkdir(casoDirectory, { recursive: true }, (err) => {
                if (err) {
                    console.error('Erro ao criar diretório:', err);
                    return res.status(500).json({ message: 'Erro interno no servidor' });
                }
                console.log('Diretório do paciente criado com sucesso');
    
                // Função para mover os arquivos da pasta temporária para o diretório do paciente
                const moveFiles = (files, sourceDirectory, destinationDirectory) => {
                    files.forEach((file) => {
                        if (file) { // Verifica se o arquivo existe
                            const sourcePath = path.join(sourceDirectory, file);
                            const destinationPath = path.join(destinationDirectory, file);
                
                            fs.copyFile(sourcePath, destinationPath, (err) => {
                                if (err) {
                                    console.error('Erro ao mover o arquivo:', err);
                                    return res.status(500).json({ message: 'Erro ao mover o arquivo para o diretório do paciente' });
                                }
                                console.log('Arquivo movido com sucesso');
                
                                fs.unlink(sourcePath, (err) => {
                                    if (err) {
                                        console.error('Erro ao excluir o arquivo da pasta temporária:', err);
                                    }
                                });
                            });
                        }
                    });
                };
    
                // Mova os arquivos da pasta temporária para o diretório do paciente
                const sourceDirectory = path.join(__dirname, '../uploads');
                
                // Verificando se o arquivo zipFile[0] existe e movendo-o, se estiver definido
                if (zipFile && zipFile[0]) {
                    moveFiles([zipFile[0].filename], sourceDirectory, casoDirectory);
                }

                // Verificando se o arquivo intraOralZipFile[0] existe e movendo-o, se estiver definido
                if (intraOralZipFile && intraOralZipFile[0]) {
                    moveFiles([intraOralZipFile[0].filename], sourceDirectory, casoDirectory);
                }

                // Verificando se o arquivo clinicalImagesZipFile[0] existe e movendo-o, se estiver definido
                if (clinicalImagesZipFile && clinicalImagesZipFile[0]) {
                    moveFiles([clinicalImagesZipFile[0].filename], sourceDirectory, casoDirectory);
                }

                // O diretório foi criado com sucesso, os arquivos foram movidos, e os dados do caso foram inseridos no banco de dados
                res.status(200).json({ message: 'Caso inserido com sucesso', insertedId: novoCodigoPaciente });
            });

            const statusCaso = 'Aguardando Orçamento'
            const resultCases = await db.query(
                'INSERT INTO cases (tipo_produto, cirurgiao, distribuidor, usuario_solicitante, status_atual) VALUES (?, ?, ?, ?, ?)',
                [tipoProduto, nomeCirurgiao, empresaRepresentante, userId, statusCaso]
            );
            
            // Recuperar o ID do caso recém-inserido
            const userIdQuery = "SELECT LAST_INSERT_ID() as caseId";
            const [userIdRow] = await db.query(userIdQuery);
            const caseId = userIdRow[0].caseId;
            
            // Insira os valores na tabela patients
            const resultPatients = await db.query(
                'INSERT INTO patients (id_paciente, cod_paciente, nome_paciente, iniciais_paciente) VALUES (?, ?, ?, ?)',
                [caseId, novoCodigoPaciente, nomePaciente, iniciaisPaciente]
            );

            // Insira os valores na tabela patients
            const resultStatus = await db.query(
                'INSERT INTO status (idstatus, status_orcamento) VALUES (?, ?)',
                [caseId, status]
            );
                        
            
        } catch (error) {
            console.error('Erro ao inserir caso:', error);
            res.status(500).json({ message: 'Erro interno no servidor' });
        }
    };

module.exports = {
    getCirurgioes,
    getCirurgiaoById,
    getDistribuidores,
    getDistribuidoresById,
    getProductType,
    inserirCaso,
};
// Importa as bibliotecas necessárias
const mysql = require('mysql2');         // Para conexão com o MySQL
const express = require('express');       // Para criar o servidor
const bodyParser = require('body-parser');// Para interpretar JSON e URL-encoded
const cors = require('cors');             // Para habilitar CORS (Cross-Origin Resource Sharing)
require('dotenv').config();               // Para carregar variáveis de ambiente do arquivo .env

// Configuração do banco de dados
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: '3306',
};

// Inicialização do Express
const app = express();

// Lista de domínios permitidos para requisições ao backend
const allowedOrigins = [
    'https://sistemadechaves-1mp8.onrender.com', // Frontend
    'https://lablisa.online',                    // Domínio permitido adicional
];

const BACKEND_URL = 'https://sistema-de-chaves.onrender.com';

// Configuração do CORS com verificação de origem
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

// Middlewares para interpretar JSON e URL-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexão com o banco de dados
const db = mysql.createConnection(dbConfig);

db.connect((error) => {
    if (error) {
        console.error('Erro ao conectar com o banco de dados:', error);
        return;
    }
    console.log('Conectado ao banco de dados com sucesso!');
});

// Função auxiliar para registrar log de consulta ao banco de dados
function logQueryResults(error, results, res, successMessage) {
    if (error) {
        console.error('Erro ao executar consulta:', error);
        return res.status(500).json({ error: 'Erro ao executar consulta.' });
    }
    res.status(200).json({ message: successMessage, data: results });
}

// Rota de login
app.post('/pag_login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });
    }

    const query = 'SELECT * FROM login WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Erro ao realizar login:', err);
            return res.status(500).json({ error: 'Erro ao realizar login' });
        }

        if (results.length > 0) {
            res.status(200).json({ message: 'Login bem-sucedido' });
        } else {
            res.status(401).json({ message: 'Usuário ou senha inválidos' });
        }
    });
});

// Rota de cadastro de chaves
app.post('/pag_cadastro_chaves', (req, res) => {
    const { name, numero } = req.body;

    if (!name || !numero) {
        return res.status(400).json({ error: 'Nome e número da sala são obrigatórios.' });
    }

    const query = 'INSERT INTO chaves (setor, numero) VALUES (?, ?)';
    db.query(query, [name, numero], (err, results) => {
        logQueryResults(err, results, res, 'Chave cadastrada com sucesso.');
    });
});

// Rota de cadastro de admins
app.post('/pag_cadastro_adm', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
    }

    const query = 'INSERT INTO login (username, password) VALUES (?, ?)';
    db.query(query, [username, password], (err, results) => {
        logQueryResults(err, results, res, 'Usuário cadastrado com sucesso!');
    });
});

// Rota de cadastro de responsáveis
app.post('/pag_cadastro_resp', (req, res) => {
    const { nome, profissao } = req.body;

    if (!nome || !profissao) {
        return res.status(400).json({ error: 'Nome e profissão são obrigatórios.' });
    }

    const query = 'INSERT INTO responsaveis (nome, profissao) VALUES (?, ?)';
    db.query(query, [nome, profissao], (err, results) => {
        logQueryResults(err, results, res, 'Responsável cadastrado com sucesso.');
    });
});

// Rota para criação de registro
app.post('/pag_principal', (req, res) => {
    const { date, sector, operation, responsible, time } = req.body;

    const query = 'INSERT INTO registros (date, setor, operacao, responsavel, time) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [date, sector, operation, responsible, time], (err, results) => {
        logQueryResults(err, results, res, 'Registro criado com sucesso');
    });
});

// Rota para obter setores
app.get('/getSetores', (req, res) => {
    const query = 'SELECT setor FROM chaves';
    db.query(query, (err, results) => {
        logQueryResults(err, results, res, 'Setores obtidos com sucesso');
    });
});

// Rota para obter responsáveis
app.get('/getResponsaveis', (req, res) => {
    const query = 'SELECT nome, profissao FROM responsaveis';
    db.query(query, (err, results) => {
        logQueryResults(err, results, res, 'Responsáveis obtidos com sucesso');
    });
});

// Rota para obter registros
app.get('/pag_registros', (req, res) => {
    const query = 'SELECT * FROM registros';
    db.query(query, (err, results) => {
        logQueryResults(err, results, res, 'Registros obtidos com sucesso');
    });
});

// Rota para obter chaves e registros
app.get('/pag_chaves', (req, res) => {
    const queryChaves = 'SELECT setor FROM chaves';
    db.query(queryChaves, (err, resultsChaves) => {
        if (err) return res.status(500).json({ error: 'Erro ao obter chaves.' });

        const queryRegistros = 'SELECT operacao, setor, responsavel FROM registros';
        db.query(queryRegistros, (err, resultsRegistros) => {
            if (err) return res.status(500).json({ error: 'Erro ao obter registros.' });

            res.status(200).json({ chaves: resultsChaves, registros: resultsRegistros });
        });
    });
});

// Servir arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Inicializa o servidor
const port = 5500;
app.listen(port, () => {
    console.log(`Servidor iniciado em ${BACKEND_URL}:${port}/`);
});

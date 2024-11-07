const mysql = require('mysql2'); // Importa o MySQL
const express = require('express'); // Cria instância do Express
const bodyParser = require('body-parser'); // Middleware para interpretar JSON e URL-encoded
const cors = require('cors'); // Middleware para habilitar CORS
require('dotenv').config(); // Carrega variáveis de ambiente

// CONFIGURAÇÃO DO BANCO DE DADOS
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: '3306',
};

// INICIALIZAÇÃO DO EXPRESS
const app = express();

// LISTA DE DOMÍNIOS PERMITIDOS PARA CORS
const allowedOrigins = [
    'https://sistemadechaves-1mp8.onrender.com', // Frontend
    'https://lablisa.online',                    // Domínio permitido adicional
];

const BACKEND_URL = 'https://sistema-de-chaves.onrender.com';


app.use(cors()); // Habilita CORS para todas as rotas

// MIDDLEWARES PARA JSON E URL-ENCODED
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CONEXÃO COM O BANCO DE DADOS
let db;

function connectToDatabase() {
    db = mysql.createConnection(dbConfig);

    db.connect((error) => {
        if (error) {
            console.error('Erro ao conectar com o banco de dados:', error);
            setTimeout(connectToDatabase, 2000); // Tenta reconectar após 2 segundos
        } else {
            console.log('Conectado ao banco de dados com sucesso!');
        }
    });

    db.on('error', (error) => {
        console.error('Erro na conexão do banco de dados:', error);
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            connectToDatabase(); // Reconecta em caso de perda de conexão
        }
    });
}

connectToDatabase(); // Chama a função de conexão para inicializar

//FUNÇÃO QUE AUXILIA PARA REGISTRAR LOG DE CONSULTA AO BANCO DE DADOS
function logQueryResults(error, results, res, successMessage) {
    if (error) {
        console.error('Erro ao executar consulta:', error);
        return res.status(500).json({ error: 'Erro ao executar consulta.' });
    }
    res.status(200).json({ message: successMessage, data: results });
}


// ROTA DE LOGIN
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


// ROTA DE CADASTRO DE CHAVES
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

// ROTA DE CADASTRO DE ADMINS
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

// ROTA DE CADASTRO DE RESPONSÁVEIS
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

// ROTA PARA PÁGINA PRINCIAL
app.post('/pag_principal', (req, res) => {
    const { date, sector, operation, responsible, time } = req.body;

    const query = 'INSERT INTO registros (date, setor, operacao, responsavel, time) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [date, sector, operation, responsible, time], (err, results) => {
        logQueryResults(err, results, res, 'Registro criado com sucesso');
    });
});

// ROTA PARA OBTER SETORES
app.get('/getSetores', (req, res) => {
    const query = 'SELECT setor FROM chaves';
    db.query(query, (err, results) => {
        logQueryResults(err, results, res, 'Setores obtidos com sucesso');
    });
});


// ROTA PARA OBTER RESPONSÁVEIS
app.get('/getResponsaveis', (req, res) => {
    const query = 'SELECT nome, profissao FROM responsaveis';
    db.query(query, (err, results) => {
        logQueryResults(err, results, res, 'Responsáveis obtidos com sucesso');
    });
});


// ROTA PARA PÁGINA DE REGISTROS
app.get('/pag_registros', (req, res) => {
    const query = 'SELECT * FROM registros';
    db.query(query, (err, results) => {
        logQueryResults(err, results, res, 'Registros obtidos com sucesso');
    });
});

// ROTA PARA PÁGIANA DE CHAVES
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

// SERVE ARQUIVOS ESTÁTICOS
app.use(express.static('public'));

// INICIALIZA O SERVIDOR
const port = 5500;
app.listen(port, () => {
    console.log(`Servidor iniciado em ${BACKEND_URL}:${port}/`);
});

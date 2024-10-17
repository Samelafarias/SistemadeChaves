const mysql = require('mysql2'); // Importa o MySQL
const express = require('express'); // Importa Express
const bodyParser = require('body-parser'); // Middleware para interpretar corpo das requisições
const bcrypt = require('bcrypt'); // Biblioteca para hashing de senhas
const cors = require('cors'); // Middleware para CORS
require('dotenv').config(); // Carrega variáveis de ambiente

// Configuração do Banco de Dados
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: '3306'
};

// Pool de conexões para melhor performance
const db = mysql.createPool(dbConfig);

const allowedOrigins = [
    'https://sistemadechaves-1mp8.onrender.com',
    'https://lablisa.online'
];

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do CORS
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

// Função para obter uma conexão do pool
const getConnection = (callback) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Erro ao obter conexão com o banco:', err);
            return callback(err);
        }
        callback(null, connection);
    });
};

// API de Login
app.post('/pag_login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });
    }

    const query = 'SELECT * FROM login WHERE username = ?';
    getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro na conexão com o banco' });

        connection.query(query, [username], async (err, results) => {
            connection.release(); // Libera a conexão

            if (err) return res.status(500).json({ error: 'Erro no banco de dados' });

            if (results.length === 0) {
                return res.status(401).json({ message: 'Usuário ou senha inválidos' });
            }

            const user = results[0];
            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(401).json({ message: 'Usuário ou senha inválidos' });
            }

            res.status(200).json({ message: 'Login bem-sucedido' });
        });
    });
});

// API de Cadastro de Chaves
app.post('/pag_cadastro_chaves', (req, res) => {
    const { name, numero } = req.body;

    if (!name || !numero) {
        return res.status(400).json({ error: 'Nome da sala e número são obrigatórios' });
    }

    const query = 'INSERT INTO chaves (setor, numero) VALUES (?, ?)';
    getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro na conexão com o banco' });

        connection.query(query, [name, numero], (err) => {
            connection.release();

            if (err) {
                console.error('Erro ao inserir dados no banco:', err);
                return res.status(500).json({ error: 'Erro ao inserir dados' });
            }

            res.status(200).json({ message: 'Chave cadastrada com sucesso.' });
        });
    });
});

// API de Cadastro de Usuários (Admin)
app.post('/pag_cadastro_adm', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO login (username, password) VALUES (?, ?)';
    getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro na conexão com o banco' });

        connection.query(query, [username, hashedPassword], (err) => {
            connection.release();

            if (err) {
                console.error('Erro ao cadastrar usuário:', err);
                return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
            }

            res.status(200).json({ message: 'Usuário cadastrado com sucesso!' });
        });
    });
});


  //API PPÁGINA PRINCIPAL
// Rota para criar novos registros
app.post('/pag_principal', (req, res) => {
    const newRecord = req.body;
    const query = 'INSERT INTO registros (date, setor, operacao, responsavel, time) VALUES (?, ?, ?, ?, ?)';
    const values = [newRecord.date, newRecord.sector, newRecord.operation, newRecord.responsible, newRecord.time];

    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Registro criado com sucesso', id: result.insertId });
    });
});

// Rota para obter setores
app.get('/getSetores', (req, res) => {
    const query = 'SELECT setor FROM chaves';

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

// Rota para obter responsáveis
app.get('/getResponsaveis', (req, res) => {
    const query = 'SELECT profissao, nome FROM responsaveis';

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

// API PARA PÁGINA DE REGISTROS
// Rota para obter todos os registros
app.get('/pag_registros', (req, res) => {
    let sql = 'SELECT * FROM registros';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// API PARA PÁGINA DE CHAVES
// Rota para obter dados das chaves
app.get('/pag_chaves', (req, res) => {
    const queryChaves = 'SELECT setor FROM chaves';
    db.query(queryChaves, (err, resultsChaves) => {
        if (err) {
            console.error('Erro ao buscar dados das chaves:', err);
            res.status(500).send('Erro ao buscar dados das chaves');
            return;
        }
        const queryRegistros = 'SELECT operacao, setor, responsavel FROM registros';
        db.query(queryRegistros, (err, resultsRegistros) => {
            if (err) {
                console.error('Erro ao buscar dados dos registros:', err);
                res.status(500).send('Erro ao buscar dados dos registros');
                return;
            }
            res.json({ chaves: resultsChaves, registros: resultsRegistros });
        });
    });
});

// Servindo arquivos estáticos
app.use(express.static('public'));

// Iniciando o Servidor
const port = 5500;
app.listen(port, () => {
    console.log(`Servidor rodando em https://sistema-de-chaves.onrender.com:${port}/`);
});
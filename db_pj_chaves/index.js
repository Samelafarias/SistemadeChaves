const mysql = require('mysql2')//Importa o módulo Mysql para conectar ao banco de dados
const express = require('express')// Importa o módulo Express para criar o servidor web
const bodyParser = require('body-parser')// Middleware para interpretar o corpo das requisições
const bcrypt = require('bcrypt')// Biblioteca para hashing de senhas
const cors = require('cors')// Middleware para permitir requisições CORS

// CONFIGURAÇÃO DO BANCO DE DADOS
const dbConfig = {
    host: 'localhost',  // Endereço do servidor do banco de dados
    user: 'root', // Usuário do banco de dados
    password: '', //Senha do banco de dados
    database: 'db_pj_chaves', //Nome do banco de dados
    port: '3306' //Porta do servidor Mysql
};

const app = express(); // Cria uma instância do servidor Express
app.use(bodyParser.json()); // Middleware para interpretar JSON no corpo das requisições
app.use(cors()); // Aplica o middleware CORS para permitir requisições de diferentes origens
app.use(bodyParser.urlencoded({ extended: true })); // Middleware para interpretar dados codificados na URL

// CRIAR CONEXÃO COM O BANCO DE DADOS
const db = mysql.createConnection(dbConfig);

// CONECTAR AO BANCO DE DADOS
db.connect((error) => {
    if (error) {
        console.error('Erro ao conectar com o banco de dados remoto');
        return;
    }
    console.log('Conectado ao banco de dados remoto com sucesso!!!');
});

// API PÁGINA DE LOGIN
// Rota para login de usuários
app.post('/pag_login', (req, res) => {
    const username = req.body.username; // Obtém o nome de usuário do corpo da requisição
    const password = req.body.password; // Obtém a senha do corpo da requisição

    if (!username || !password) {
        return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });
    }

    const query = 'SELECT * FROM login WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            res.status(200).json({ message: 'Login bem-sucedido' });
        } else {
            res.status(401).json({ message: 'Usuário ou senha inválidos' });
        }
    });
});

    //API da página de cadastro de chaves
    // Rota para lidar com o cadastro de chaves
app.post('/pag_cadastro_chaves', (req, res) => {
    const { name, numero } = req.body;
    if (!name || !numero) {
      return res.status(400).json({ error: 'Nome da sala e número da sala são obrigatórios.' });
    }
  
    const query = 'INSERT INTO chaves (setor, numero) VALUES (?, ?)';
    db.query(query, [name, numero], (err, result) => {
      if (err) {
        console.error('Erro ao inserir dados no banco de dados:', err);
        return res.status(500).json({ error: 'Erro ao inserir dados no banco de dados.' });
      }
      res.status(200).json({ message: 'Chave cadastrada com sucesso.' });
    });
  });
  

    //API DA PÁGINA DE REGISTRO DE ADMS
    app.post('/pag_cadastro_adm', (req, res) => {
        const { username, password } = req.body;
    
        if (!username || !password) {
            return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
        }
    
        db.query('INSERT INTO login (username, password) VALUES (?, ?)', [username, password], (err, results) => {
            if (err) {
                console.error('Erro ao inserir o usuário:', err);
                return res.status(500).json({ error: 'Erro interno do servidor.' });
            }
    
            res.status(200).json({ message: 'Usuário cadastrado com sucesso!' });
        });
    });

    //API DA PÁGINA DE REGISTRO DE RESPONSÁVEIS
    // Rota para lidar com o cadastro de chaves
app.post('/pag_cadastro_resp', (req, res) => {
    const { nome, profissao } = req.body;
  
    if (!nome || !profissao) {
      return res.status(400).json({ error: 'Nome da sala e número da sala são obrigatórios.' });
    }
  
    const query = 'INSERT INTO responsaveis (nome, profissao) VALUES (?, ?)';
    db.query(query, [nome, profissao], (err, result) => {
      if (err) {
        console.error('Erro ao inserir dados no banco de dados:', err);
        return res.status(500).json({ error: 'Erro ao inserir dados no banco de dados.' });
      }
      res.status(200).json({ message: 'Chave cadastrada com sucesso.' });
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
// Servindo arquivos estáticos (HTML, CSS, JS) na pasta 'public'
app.use(express.static('public'));

// INICIAR O SERVIDOR
const port = 5500; // Porta em que o servidor vai escutar
app.listen(port, () => {
    console.log(`Servidor iniciado na porta http://localhost:${port}/`);
});

  
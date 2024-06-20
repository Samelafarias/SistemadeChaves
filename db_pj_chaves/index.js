const mysql = require('mysql')
const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const cors = require('cors')

// CONFIGURAÇÃO DO BANCO DE DADOS
const dbConfig = {
    host: 'localhost', // Corrigido o nome do host
    user: 'root',
    password: '1234567',
    database: 'db_pj_chaves',
    port: '3306'
};

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use (bodyParser.urlencoded({extended: true}));

// CONFIGURAR O BODY-PARSER PARA LIDAR COM AS REQUISIÇÕES URL-ENCODED
app.use(bodyParser.urlencoded({ extended: true }));

// CRIAR CONEXÃO COM O BANCO DE DADOS
const db = mysql.createConnection(dbConfig);

// CONECTAR AO BANCO DE DADOS
db.connect((error) => {
    if (error) {
        console.error('Erro ao conectar com o banco de dados');
        return;
    }
    console.log('Conectado ao banco de dados com sucesso!!!');
});

  //API PAGINA DE LOGIN
 // Rota de login
 app.post('/pag_login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

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

//pesquisar sobre: se esssa é a api correta para a pagina principal
//API PARA PAGINA PRINCIPAL
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
   
    
    //API PAGINA DE REGISTROS
// Endpoint para obter todos os registros
// Rota para buscar os dados
app.get('/pag_registros', (req, res) => {
    let sql = 'SELECT * FROM registros'; 
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

//api da pagina de chaves
app.get('/pag_chaves', (req, res) => {
    db.get("SELECT * FROM registros WHERE operacao IS NOT NULL", (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: "No record found" });
            return;
        }
        res.json({ operacao: row.operacao });
    });
    });


// Servindo os arquivos estáticos (HTML, CSS, JS)
app.use(express.static('public'));


  // INICIAR O SERVIDOR
const port = 5500;
  app.listen(port, () => {
    console.log(`Servidor iniciado na porta http://localhost:${port}/`);
  });

  
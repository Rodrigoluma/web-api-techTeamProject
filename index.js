require("dotenv").config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = normalizaPort(process.env.PORT || '3000');
const mysql = require('mysql2');

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/', (req, res) => res.json({ message: 'Funcionando!' }));

// metodos para o projeto
// deixei editar/deletar de fora:

// (get) conferência dos dados armazenados em cookie através de filtro na tabela user (login/senha)  ---- Não entendi
// (post) cadastro de usuários (só dados do html) ------ Quais são os dados
// (get) filtro se já existe o cpf cadastrado pra não gerar dois cadastros --- FEITO Retorna todos os dados user com o cpf cadastrado, no JS da pra filtrar o que mostrar
// (post) cadastro de endereço(dados do html e ID de quem estiver cadastrado) --- Somente de pontos de coleta né?
// (get) pág parceiros (abre todos os endereços já cadastrados) ---- FEITO Retorna todas as informações, no JS da pra filtrar o que mostrar
// (get) filtra esses endereços e retorna a cidade escolhida ---- FEITO Retorna todas as informações dos pontos que tem a cidade escolhida, no JS da pra filtrar o que mostrar
// (post) cadastra id do coletor na tabela pontodecoleta que ele escolher ---- Esse id não é auto incrementado. Como vamos gerar ele? Tentei pegar os dois id e trocar um pelo outro.
// (get) retorna no cadastro do doador/coletor dados dele e lista de endereços ligados ao seu ID ---- Retorna todas as informações do user, no JS da pra filtrar o que mostrar. Não sei como pegar os dados do endereço ligados ao id dele. Já que o endereço está no ponto de coleta.

app.get('/user/:cpfCnpj', (req, res) => {    
    const {cpfCnpj} = req.params;
    execSQLQuery(`SELECT * FROM user WHERE cpfCnpj = '${cpfCnpj}'`, res);
});

app.get('/pontocoleta', (req, res) => {
    execSQLQuery('SELECT * FROM pontocoleta', res);
});

app.get('/pontocoleta/:cidade', (req, res) => {    
    const {cidade} = req.params;
    execSQLQuery(`SELECT * FROM pontocoleta WHERE cidade = '${cidade}'`, res);
});

app.post('/user', (req, res) => {
    const {nome, cpfCnpj, telefone, areaAtuacao, email, senha, coletor_doador} = req.body;
    //talvez vai da pra tirar o WHERE
    execSQLQuery(`INSERT INTO user(nome, cpfCnpj, telefone, areaAtuacao, email, senha, coletor_doador) VALUES('${nome}', '${cpfCnpj}', '${telefone}','${areaAtuacao}', '${email}', '${senha}', '${coletor_doador}')`, res);
});

app.post('/pontocoleta/:id', (req, res) => {
    const {id_coletor} = req.params;
    const {id_coletor_coleta} = req.body;
    //talvez vai da pra tirar o WHERE
    execSQLQuery(`UPDATE pontocoleta SET id_coletorcoleta = ${id_coletor} WHERE id_coletorcoleta = ${id_coletor_coleta};`, res);
});

app.get('/user', (req, res) => {  
    execSQLQuery(`SELECT * FROM user`, res);
});



// Exemplos a serem apagados
// app.post('/pontocoleta/:id', (req, res) => {
//     const {id_coletor} = req.params;
//     execSQLQuery(`INSERT INTO doador(nome, areaAtuacao) VALUES('${nome}', '${areaAtuacao}')`, res);
// });
// app.get('/doador', (req, res) => {
//     connection.query('SELECT * FROM doador', function(err, results, fields) {
//         console.log(results); // results contains rows returned by server
//         console.log(fields); // fields contains extra meta data about results, if available
//     });
//     return res;
// });

// //filtra os fornecedores pela cidade

// app.get('/doador/:id', async (req, res) => {
//     let { id_pontocoleta } = req.params.id;
//     await execSQLQuery('SELECT * FROM doador WHERE id_pontocoleta = ?', [id_pontocoleta]);
// });

// app.post('/doador', async (req, res) => {
//     const { nome, telefone, area } = req.body;    
//     await execSQLQuery(`INSERT INTO doador(nome, telefone, areaAtuacao) VALUES(?,?,?)`, [nome, Number(telefone), area]);
// });

// app.patch('/fornecedores/:id', (req, res) => {
//     const id = parseInt(req.params.id);
//     const { nome, cidade, cep } = req.body;
    
//     execSQLQuery(`UPDATE fornecedores SET nome='${nome}', cidade='${cidade}', cep='${cep}' WHERE id=${id}`, res);
// })

// app.delete('/fornecedores/:id', (req, res) => {
//     console.log(req.params);
//     execSQLQuery('DELETE FROM fornecedores WHERE id=' + parseInt(req.params.id), res);
// });

function normalizaPort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}

app.listen(port, function () {
    console.log(`app listening on port ${port}`)
})



async function execSQLQuery(querySql, response){ 
    if(querySql === undefined){
        return
    }  
    const connection = mysql.createConnection({
        host     : process.env.HOST,
        user     : process.env.USER,
        password : process.env.PASSWORD,
        database : process.env.DATABASE
    });
   console.log(querySql);
    connection.query(querySql, (error, results, fields) => {
        if(error) 
          response.json(error);
        else
          response.json(results);
        connection.end();
        console.log('executou!');
    });
    // if(global.connection && global.connection.state !== 'disconnected')
    //     return global.connection;
 
    
    // console.log("Conectou no MySQL!");
    // global.connection = connection;
    // return connection;
}
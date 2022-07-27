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

app.get('/doador', (req, res) => {
    execSQLQuery('SELECT * FROM doador', res);
});

app.get('/doador/:areaAtuacao?', (req, res) => {    
    const {areaAtuacao} = req.params;
    console.log(areaAtuacao);
    let filter = '';
    if (areaAtuacao) filter = ` WHERE areaAtuacao = '${areaAtuacao}'`;
    execSQLQuery('SELECT * FROM doador' + filter, res);
});

app.post('/doador', (req, res) => {
    const {nome, areaAtuacao} = req.body;
    execSQLQuery(`INSERT INTO doador(nome, areaAtuacao) VALUES('${nome}', '${areaAtuacao}')`, res);
});

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
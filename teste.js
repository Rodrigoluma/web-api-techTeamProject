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

//filtra os fornecedores pela cidade

app.get('/doador/:id?', (req, res) => {
    let { id_pontocoleta } = req.params.id;
    execSQLQuery('SELECT * FROM doador WHERE id_pontocoleta = ?', [id_pontocoleta]);
});

app.post('/doador', (req, res) => {
    //removi essa linha e passei direto o req eo res interiros
    execSQLQuery(`INSERT INTO doador(nome, telefone, areaAtuacao) VALUES(?,?,?)`, req, res);
});

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



function execSQLQuery(sqlQry, req, res){
    const { nome, telefone, area } = req.body; // desestruturei o req.body
    const connection = mysql.createConnection({
        host     : 'us-cdbr-east-06.cleardb.net',
        user     : 'b15e8849916ff3',
        password : '21b571b8',
        database : 'heroku_60eb452e3f44a0e'
    });
    
    connection.query(sqlQry, [nome, Number(telefone), area], (error, results, fields) => { // passei eles como parametros aqui
        if(error) 
          res.json(error);
        else
          res.json(results);
        connection.end();
        console.log('executou!');
    });
}
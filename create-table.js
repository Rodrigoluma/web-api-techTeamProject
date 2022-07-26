// const mysql = require('mysql2');
// const connection = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : 'Hpdj692c$',
//     database : 'form'
// });

// connection.connect((err) => {
//     if(err) return console.error(err);
//     console.log('connection');
// })

//deve ser chamada em uma função de criar tabela, mas não usei
// function addRows(conn) {
//     const sql = "INSERT INTO fornecedores(nome, cidade) VALUES ?";
//     const values = [
//         ['Cesar', 'Ecops'],
//         ['Johnny', 'Hans'],
//         ['Ruslan', 'Kings'],
//     ];
//     conn.query(sql, [values], (err, result, fields) => {
//         if(err) return console.error(err);
//         console.log('add linhas');
//         conn.end();
//     });
// }
// db.js

const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '5.161.203.214',
  user: 'playerad_cli',
  password: 'Yampmacc14$',
  database: 'playerad_dbradio',
});

//const db = mysql.createConnection({
//  host: 'localhost',
//  user: 'root',
//  password: '',
//  database: 'radiodb',
//});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión a la base de datos exitosa');
  }
});

module.exports = db;
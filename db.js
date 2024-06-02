// db.js

const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '5.161.203.214',
  user: 'playerad_render',
  password: 'Yampmacc14$',
  database: 'playerad_dbradio',
  connectTimeout: 30000
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión a la base de datos exitosa');
  }
});

module.exports = db;
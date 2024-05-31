// db.js

const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'viaduct.proxy.rlwy.net',
  user: 'root',
  password: 'KxexhaKdBKpAwsGQNuxXFAxhpREVnDRP',
  database: 'railway',
  port: 26071
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión a la base de datos exitosa');
  }
});

module.exports = db;